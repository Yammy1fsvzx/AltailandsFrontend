'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
// Restore necessary imports
import Image from 'next/image'; 
import { formatPrice } from '@/utils/formatting';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card"; 
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Phone, FileText, Copy, Check, ArrowLeft } from "lucide-react";
import ApplicationForm from './ApplicationForm';
import { ListingDetail, MediaFile, isLandPlotDetail, LandPlotDetail } from '@/types/catalog';
import { getContacts } from '@/lib/api/contacts';
import { ContactInfo } from '@/types/contacts';
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs"; 
// @ts-ignore // Suppress TypeScript error for missing type declarations
import FsLightbox from 'fslightbox-react';
// Import the new utility function
import { getPublicAssetUrl, getPublicImageUrl } from '@/lib/api/utils';

interface ListingViewProps {
  listing: ListingDetail;
  categorySlug: string; 
}

// Helper function to filter images from media files
const getImageFiles = (mediaFiles: MediaFile[] | undefined): MediaFile[] => {
    // Filter for files that are likely images and have a URL
    const images = mediaFiles?.filter(file => 
        (file.type === 'image' || (!file.type && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.file_url || file.url || ''))) &&
        (file.file_url || file.url) // Ensure there is a URL field to use
    ) || [];
    
    // Sort images: main image first, then by order
    images.sort((a, b) => {
        if (a.is_main && !b.is_main) return -1;
        if (!a.is_main && b.is_main) return 1;
        return (a.order ?? Infinity) - (b.order ?? Infinity); // Sort by order if available
    });

    return images;
};

// Helper function to filter documents from media files
const getDocumentFiles = (mediaFiles: MediaFile[] | undefined): MediaFile[] => {
    // Primary check: Use the 'type' field from the API
    return mediaFiles?.filter(file => 
        file.type === 'document' || // Check API type first
        // Fallback checks (if type field is sometimes missing/unreliable)
        (
            (file.type_display?.toLowerCase().includes('документ') || // Check type_display (case-insensitive)
             file.type_display?.toLowerCase().includes('pdf') || 
             file.type_display?.toLowerCase().includes('doc') ||
             file.type_display?.toLowerCase().includes('xls') 
            ) && 
            (file.file_url || file.url) // Ensure URL exists
        ) ||
        // Last resort: Check if URL doesn't look like a common image extension
        (!file.type && !file.type_display && (file.file_url || file.url) && 
         !/\.(jpg|jpeg|png|gif|webp)$/i.test(file.file_url || file.url || ''))
    ) || [];
};

// Copy status type
type CopyStatus = 'idle' | 'copied';

const ListingView: React.FC<ListingViewProps> = ({ listing, categorySlug }) => {

  const router = useRouter(); // Initialize router
  const images = getImageFiles(listing.media_files);
  const documents = getDocumentFiles(listing.media_files);
  const price = parseFloat(listing.price); // Convert price string to number

  // Use type guard to check if it's a land plot
  const isLand = isLandPlotDetail(listing);

  // --- Normalize Cadastral Numbers ---
  // Now returns string[] | null
  const getNormalizedCadastralNumbersArray = (numbers: string | string[] | null | undefined): string[] | null => {
    if (!numbers) {
      return null;
    }
    let numbersArray: string[] = [];
    if (Array.isArray(numbers)) {
      // Case 1: Already an array
      numbersArray = numbers.map(n => n?.trim()).filter(Boolean) as string[];
    } else if (typeof numbers === 'string') {
      // Case 2: It's a string - could be plain, JSON array string, or comma/space separated
      try {
        const parsed = JSON.parse(numbers);
        if (Array.isArray(parsed)) {
          // It was a JSON array string
          numbersArray = parsed.map(n => String(n)?.trim()).filter(Boolean);
        } else {
          // Parsed successfully, but not an array - treat as plain string (split by comma/space)
          numbersArray = numbers.split(/[,\s]+/).map(n => n.trim()).filter(Boolean);
        }
      } catch (e) {
        // JSON.parse failed - treat as plain string (split by comma/space)
        numbersArray = numbers.split(/[,\s]+/).map(n => n.trim()).filter(Boolean);
      }
    } else {
        return null; // Should not happen with correct types
    }
    // Return null if the resulting array is empty
    return numbersArray.length > 0 ? numbersArray : null;
  };

  // Get the array of numbers
  const cadastralNumbersArray = isLand ? getNormalizedCadastralNumbersArray(listing.cadastral_numbers) : null;

  // --- Filter Features for Land Plots ---
  const communicationFeatures = isLand ? listing.features?.filter(feat => feat.type_display === "Коммуникация участка") || [] : [];
  const otherFeatures = isLand ? listing.features?.filter(feat => feat.type_display !== "Коммуникация участка") || [] : [];

  // State for fetched contact phone
  const [contactPhone, setContactPhone] = useState<string | null>(null);
  const [isLoadingPhone, setIsLoadingPhone] = useState(true);
  // State for copy status
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  // State for Lightbox
  const [lightboxToggler, setLightboxToggler] = useState(false);
  const [lightboxSlideIndex, setLightboxSlideIndex] = useState(0);

  // --- Calculate Price per Sotka for Land Plots ---
  let pricePerSotkaFormatted: string | null = null;
  if (isLand) {
    const area = parseFloat(listing.area || '0'); // Parse area as float, default to 0
    if (area > 0 && price > 0) { // Check parsed area
      const pricePerSotka = price / area; // Use parsed area
      pricePerSotkaFormatted = formatPrice(pricePerSotka); // Format the calculated price
    }
  }

  // --- Format Full Address ---
  // Use correct fields based on Location type: locality and region
  const locationParts = [
    listing.location?.locality, 
    listing.location?.region
  ].filter(Boolean); // Remove any null/undefined/empty parts
  const formattedAddress = locationParts.join(', ');

  // Fetch contacts on component mount
  useEffect(() => {
    const fetchContact = async () => {
      setIsLoadingPhone(true);
      try {
        const contactInfo = await getContacts();
        if (contactInfo) {
          setContactPhone(contactInfo.phone);
        }
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
        // Optionally set an error state
      } finally {
        setIsLoadingPhone(false);
      }
    };

    fetchContact();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Determine related object info for the form
  const modelName = isLand ? 'landplot' : 'property'; // Adjust 'property' if your generic model name is different
  const appLabel = 'catalog'; // Change 'listings' to 'catalog' to match backend expectation

  // --- Generate Breadcrumbs Data Here ---
  let categoryName = categorySlug; // Default to slug
  if ('property_type' in listing && listing.property_type) {
      categoryName = listing.property_type.name; 
  } else if ('land_category' in listing && listing.land_category) {
      // For land plots, maybe link back to the generic land-plots category?
      categoryName = "Земельные участки"; // Or get category name from API if needed
  }

  const breadcrumbsData = [
      { label: "Каталог", href: "/catalog" },
      { label: categoryName, href: `/catalog?category=${categorySlug}` }, 
      { label: listing.title, isCurrent: true },
  ];

  // --- Copy Cadastre Handler ---
  // Now accepts the specific number to copy
  const handleCopyCadastre = (numberToCopy: string) => {
    if (!numberToCopy) { 
      console.error('Attempted to copy an empty cadastral number string.');
      return;
    }
    navigator.clipboard.writeText(numberToCopy).then(() => {
      setCopyStatus('copied'); // Set global copy status
      setTimeout(() => setCopyStatus('idle'), 1500); // Reset after 1.5 seconds
    }).catch(err => {
      console.error(`Failed to copy cadastral number ${numberToCopy}:`, err);
      // Optionally show an error message
    });
  };

  // Prepare image URLs for Lightbox
  const imageSources = images.map(image => image.file_url || image.url).filter(Boolean) as string[];

  return (
    // Remove the top padding added previously
    <div>
      {/* --- Hero Banner with SVG Background --- */}
      {/* Hide on mobile (hidden), show on md and up (md:block) */}
      <div className="w-full h-[30vh] bg-gradient-to-b from-[#0e463e] to-[#0c3c34] relative overflow-hidden hidden md:block"> 
         {/* Copied SVG background from PageHero, with renamed IDs */}
         <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
            <defs>
              {/* Renamed IDs */}
              <linearGradient id="farMountainGradientListingHero" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#13564C"></stop>
                <stop offset="100%" stopColor="#0E433B"></stop>
              </linearGradient>
              <linearGradient id="nearMountainGradientListingHero" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0B3B33"></stop>
                <stop offset="100%" stopColor="#072F29"></stop>
              </linearGradient>
              <linearGradient id="treeGradientListingHero" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#062723"></stop>
                <stop offset="100%" stopColor="#041E1A"></stop>
              </linearGradient>
              <filter id="mountainShadowListingHero" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#000" floodOpacity="0.5"></feDropShadow>
              </filter>
            </defs>
            {/* Paths using renamed IDs */}
            <path d="M0,600 L200,500 L400,570 L600,490 L800,580 L1000,460 L1200,530 L1400,480 L1600,550 L1800,470 L1920,520 L1920,1080 L0,1080 Z" fill="url(#farMountainGradientListingHero)" filter="url(#mountainShadowListingHero)" opacity="1"></path>
            <path d="M0,750 L200,680 L300,720 L400,650 L600,750 L700,700 L850,780 L950,720 L1100,800 L1300,680 L1500,780 L1700,700 L1800,750 L1920,680 L1920,1080 L0,1080 Z" fill="url(#nearMountainGradientListingHero)" filter="url(#mountainShadowListingHero)" opacity="1"></path>
            <path d="M0,800 L50,780 L80,800 L120,760 L180,810 L220,780 L260,800 L300,770 L350,800 L400,760 L450,810 L500,780 L550,800 L600,770 L650,800 L700,760 L750,810 L800,780 L850,800 L900,770 L950,800 L1000,760 L1050,810 L1100,780 L1150,800 L1200,770 L1250,800 L1300,760 L1350,810 L1400,780 L1450,800 L1500,770 L1550,800 L1600,760 L1650,810 L1700,780 L1750,800 L1800,770 L1850,800 L1900,780 L1920,790 L1920,1080 L0,1080 Z" fill="#072F29" opacity="1"></path>
            <g opacity="1">
              {/* Tree paths using renamed gradient */}
              <path d="M155,900 L154,880.2 L162,880.2 L161,900 Z M124.4,883.5 C114.8,858.75 110,850.5 122,837.3 C117.2,820.8 126.8,809.25 134,792.75 C131.6,776.25 143.6,768 150.8,754.8 C155.6,743.25 158,735 160.4,743.25 C165.2,754.8 172.4,768 182,792.75 C189.2,809.25 198.8,820.8 194,837.3 C206,850.5 201.2,858.75 191.6,883.5 Z" fill="url(#treeGradientListingHero)" opacity="0.9"></path>
              <path d="M428,900 L427,873 L435,873 L434,900 Z M385.5,877.5 C372.5,843.75 366,832.5 382.25,814.5 C375.75,792 388.75,776.25 398.5,753.75 C395.25,731.25 411.5,720 421.25,702 C427.75,686.25 431,675 434.25,686.25 C440.75,702 450.5,720 463.5,753.75 C473.25,776.25 486.25,792 479.75,814.5 C496,832.5 489.5,843.75 476.5,877.5 Z" fill="url(#treeGradientListingHero)"></path>
              {/* TODO: Consider adding the other tree paths from PageHero.tsx if needed */}
            </g>
            <path d="M0,940 Q480,910 960,940 Q1440,970 1920,940" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="30" opacity="0.6"></path>
          </svg>
      </div>

      {/* --- Main Content Area Wrapper (Container) --- */}
      {/* Remove negative top margin on mobile (mt-0), keep for md+ */}
      <div className="container mx-auto md:px-0 mt-0 md:mt-[-6rem] relative z-10 mb-20"> 
        {/* --- Main Content Grid --- */}
        {/* Remove padding, rounding, shadow on mobile, add back for md+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 bg-background md:p-6 md:rounded-lg md:shadow-md">
         
           {/* --- Left Column (Placeholders) --- */}
           <div className="md:col-span-2 space-y-8"> {/* Added space-y for gaps */} 
             {/* --- Render Breadcrumbs Here --- */} 
             <div className="mb-4 px-4 md:px-0 hidden md:block"> {/* Add horizontal padding for breadcrumbs on mobile */} 
               <Breadcrumbs>
                 {breadcrumbsData.map((item, index) => (
                   <BreadcrumbItem 
                     key={index} 
                     href={item.href} 
                     isCurrent={item.isCurrent}
                   >
                     {item.label}
                   </BreadcrumbItem>
                 ))}
               </Breadcrumbs>
             </div>

             {/* --- Image Carousel --- */}
             <Carousel 
               opts={{ align: "start", loop: images.length > 1 }}
               className="w-full" // Full width is default
             >
               {/* Remove negative margin-left on mobile */}
               <CarouselContent className="md:-ml-4">
                 {(images && images.length > 0) ? images.map((image, index) => (
                   <CarouselItem 
                     key={image.id || index} 
                     // Remove md:pl-4 for now, apply padding based on context below?
                     className="basis-full cursor-pointer" 
                     onClick={() => {
                         setLightboxSlideIndex(index);
                         setLightboxToggler(!lightboxToggler);
                     }}
                   >
                     {/* Mobile view: Fixed height container */}
                     <div className="md:hidden relative h-[60vh] overflow-hidden"> {/* Mobile Height */}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"></div>
                        <Image
                           // Use getPublicImageUrl for Images!
                           src={getPublicImageUrl(image.file_url || image.url) || '/images/placeholder.jpg'} 
                           alt={image.description || `${listing.title} - фото ${index + 1}`}
                           fill
                           className="object-cover" 
                           priority={index === 0}
                           sizes="100vw" // Mobile takes full viewport width
                        />
                     </div>

                     {/* Desktop view: Card with AspectRatio */}
                     <div className="hidden md:block md:pl-4"> {/* Add padding back here */} 
                       <Card className="overflow-hidden rounded-lg shadow-sm"> {/* Desktop style */}
                         <AspectRatio ratio={16 / 9}> {/* Desktop ratio */}
                           <Image
                               // Use getPublicImageUrl for Images!
                               src={getPublicImageUrl(image.file_url || image.url) || '/images/placeholder.jpg'} 
                               alt={image.description || `${listing.title} - фото ${index + 1}`}
                               fill
                               className="object-cover" 
                               priority={index === 0}
                               sizes="(max-width: 1024px) 83vw, 66vw" // Desktop sizes
                           />
                         </AspectRatio>
                       </Card>
                     </div>
                   </CarouselItem>
                 )) : (
                   <CarouselItem className="basis-full md:pl-4"> {/* Apply padding to placeholder item too */} 
                      {/* Mobile Placeholder */}
                      <div className="md:hidden bg-muted flex items-center justify-center h-[50vh]"> 
                        {/* Add gradient here too? Maybe not necessary for placeholder */}
                        <p className="text-muted-foreground">Нет изображений</p>
                      </div>
                      {/* Desktop Placeholder */}
                      <div className="hidden md:block">
                        <Card className="overflow-hidden rounded-lg">
                          <AspectRatio ratio={16 / 9} className="bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">Нет изображений</p>
                          </AspectRatio>
                        </Card>
                      </div>
                    </CarouselItem>
                 )}
               </CarouselContent>
               {/* Show arrows only if there is more than one image */}
               {images.length > 1 && (
                <>
                  {/* Adjust arrow positioning for overlay */}
                  <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-4 z-10 h-8 w-8 md:left-2" /> 
                  <CarouselNext className="absolute top-1/2 -translate-y-1/2 right-4 z-10 h-8 w-8 md:right-2" /> 
                </>
               )}
             </Carousel>
 
             {/* --- Title & Price (Mobile) --- */}
             {/* Add bg, rounded-t, negative margin, relative, z-index */}
             <div className="md:hidden px-4 pt-4 pb-2 bg-background rounded-t-lg relative z-10 mt-[-3rem]">
               {/* Reduce mobile title size */}
               <h1 className="text-2xl font-bold mb-1">{listing.title}</h1> {/* Reduced margin */}
               {/* Display address if available (mobile) */}
               {formattedAddress && (
                 <p className="text-sm text-muted-foreground mb-2">{formattedAddress}</p>
               )}
               <p className="text-2xl font-semibold text-primary">
                 {formatPrice(price)}
               </p>
               {/* Display price per sotka if available (mobile) */}
               {pricePerSotkaFormatted && (
                 <p className="text-sm text-muted-foreground">
                   {pricePerSotkaFormatted} / сотка
                 </p>
               )}
             </div>

             {/* --- Description --- */}
             {listing.description && (
                 <div className="prose max-w-none px-4 md:px-0"> {/* Add padding for mobile content */} 
                    <h2 className="text-xl font-semibold mb-4">Описание</h2>
                    <p className="whitespace-pre-line">{listing.description}</p>
                 </div>
             )}

             {/* --- Cadastral Numbers (Conditional) --- */}
             {isLand && cadastralNumbersArray && cadastralNumbersArray.length > 0 && (
                 /* Add padding for mobile content */ 
                 <div className="space-y-4 px-4 md:px-0 mt-6 md:mt-0"> {/* Add padding and margin top */} 
                     <h2 className="text-xl font-semibold flex items-center gap-2"> 
                         Кадастровые номера
                         {/* Show copied message near the title */} 
                         {copyStatus === 'copied' && (
                            <span className="text-sm font-normal text-green-600 animate-pulse">(Скопировано!)</span>
                         )}
                     </h2>
                     <div className="border-t pt-4">
                        {/* Display each number with its own copy button */} 
                        <div className="flex flex-col gap-3"> {/* Column layout for each number+button */} 
                            {cadastralNumbersArray.map((number, index) => (
                                <div key={index} className="flex items-center justify-between gap-3 p-2 bg-muted rounded"> {/* BG for each row */} 
                                    <span className="font-mono text-sm whitespace-nowrap overflow-hidden text-ellipsis"> {/* Ensure number doesn't break layout */} 
                                        {number}
                                    </span>
                                    <Button 
                                        variant="ghost" // More subtle button
                                        size="icon"
                                        onClick={() => handleCopyCadastre(number)} // Pass specific number
                                        disabled={copyStatus === 'copied'} // Disable briefly after any copy
                                        aria-label={`Копировать номер ${number}`}
                                        className="h-7 w-7 flex-shrink-0" // Smaller button
                                    >
                                        {/* Simple copy icon, maybe change on success? For now, keep it simple */}
                                        <Copy className="h-4 w-4" /> 
                                    </Button>
                                </div>
                            ))}
                        </div>
                         {/* REMOVED the global copy button section */}
                     </div>
                 </div>
             )}

             {/* --- Attributes (Conditional Rendering) --- */}
             {/* Add padding for mobile content */}
             <div className="px-4 md:px-0 mt-6 md:mt-0"> {/* Add padding and margin top */}
                <h2 className="text-xl font-semibold mb-4">Характеристики</h2>
                <div className="text-base border-t pt-4">
                  {isLand ? (
                    // --- Land Plot Attributes ---
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                        {/* Corrected Fragments */}
                        {listing.area && <React.Fragment><div className="text-muted-foreground">Площадь:</div><div className="font-medium text-right">{listing.area} сот.</div></React.Fragment>}
                        {listing.land_category && <React.Fragment><div className="text-muted-foreground">Категория земель:</div><div className="font-medium text-right">{listing.land_category.name}</div></React.Fragment>}
                        {listing.plot_status_display && <React.Fragment><div className="text-muted-foreground">Статус участка:</div><div className="font-medium text-right">{listing.plot_status_display}</div></React.Fragment>}
                        {listing.land_type_display && <React.Fragment><div className="text-muted-foreground">Тип участка:</div><div className="font-medium text-right">{listing.land_type_display}</div></React.Fragment>}
                        {/* Land Use Types */}
                        {listing.land_use_types && listing.land_use_types.length > 0 && (
                            <React.Fragment>
                                <div className="text-muted-foreground sm:col-span-2 font-medium pt-2">Виды разрешенного использования:</div>
                                <div className="sm:col-span-2 flex flex-wrap gap-2">
                                    {listing.land_use_types.map(lut => (
                                        <span key={lut.id} className="bg-muted px-2.5 py-1 rounded text-sm">{lut.name}</span>
                                    ))}
                                </div>
                            </React.Fragment>
                        )}
                        {/* Communications Section */}
                        {communicationFeatures.length > 0 && (
                            <React.Fragment>
                                <div className="text-muted-foreground sm:col-span-2 font-medium pt-2">Коммуникации:</div>
                                <div className="sm:col-span-2 flex flex-wrap gap-2">
                                    {communicationFeatures.map(feat => (
                                        <span key={feat.id} className="bg-muted px-2.5 py-1 rounded text-sm">{feat.name}</span>
                                    ))}
                                </div>
                            </React.Fragment>
                        )}
                        {/* Other Features Section */}
                        {otherFeatures.length > 0 && (
                            <React.Fragment>
                                <div className="text-muted-foreground sm:col-span-2 font-medium pt-2">Особенности участка:</div>
                                <div className="sm:col-span-2 flex flex-wrap gap-2">
                                    {otherFeatures.map(feat => (
                                        <span key={feat.id} className="bg-muted px-2.5 py-1 rounded text-sm">{feat.name} ({feat.type_display})</span>
                                    ))}
                                </div>
                            </React.Fragment>
                        )}
                    </div>
                  ) : (
                    // --- Generic Property Attributes (Improved Labels & Formatting) ---
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                       {/* Display attributes dynamically using schema for labels and formatting */} 
                       {/* Make sure Object.entries is correctly mapped */} 
                        {listing.property_type?.attribute_schema && Object.entries(listing.attributes)
                            .map(([key, value]) => {
                                // Get label from schema, fallback to formatted key
                                const attributeSchema = listing.property_type?.attribute_schema?.[key];
                                // If schema doesn't define this key, skip? Or show raw? Let's show raw for now.
                                const label = attributeSchema?.label || key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1);
                                
                                // Format value based on type (especially boolean)
                                let displayValue = String(value);
                                if (attributeSchema?.type === 'boolean') {
                                    displayValue = value ? 'Да' : 'Нет';
                                }
                                // Add formatting for other types if needed (e.g., numbers with units)

                                // Skip rendering if value is null or empty string (optional)
                                // if (value === null || value === '') return null;

                                return (
                                    <React.Fragment key={key}>
                                        <div className="text-muted-foreground">{label}:</div>
                                        <div className="font-medium text-right">{displayValue}</div>
                                    </React.Fragment>
                                );
                         }) // Closing parenthesis for .map()
                        }
                    </div>
                  ) // Closing parenthesis for isLand ternary
                 } 
                </div>
             </div>

             {/* --- Documents --- */}
             {/* Add padding for mobile content */}
             <div className="px-4 md:px-0 mt-6 md:mt-0 pb-6 md:pb-0"> {/* Add padding and margin top/bottom */}
                <h2 className="text-xl font-semibold mb-4">Документы</h2>
                <div className="border-t pt-4 space-y-2">
                    {(documents && documents.length > 0) ? (
                        documents.map((doc, index) => (
                            <a
                                key={doc.id || index}
                                // Use getPublicAssetUrl for href links!
                                href={getPublicAssetUrl(doc.file_url || doc.url) || '#'} 
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="flex items-center gap-2 text-base text-primary hover:underline"
                            >
                                <FileText size={18} />
                                <span>{doc.description || doc.type_display || `Документ ${index + 1}`}</span>
                            </a>
                        ))
                    ) : (
                        <p className="text-base text-muted-foreground">Дополнительные материалы отсутствуют.</p>
                    )}
                </div>
             </div>
           </div>{/* Closing tag for md:col-span-2 */} 

           {/* --- Right Column (Revised) --- */}
           {/* Add padding for mobile content */}
           <div className="md:col-span-1 px-4 md:px-0"> {/* Add px-4 */}
               {/* Apply padding only on md+ screens */}
               <div className="sticky top-[calc(var(--header-height,4rem)+1rem)] space-y-6 md:border-l md:pl-6 md:pr-2">
                   {/* --- Title & Price (Desktop) --- */}
                   <div className="hidden md:block">
                     {/* Restore desktop title size to text-2xl */}
                     <h1 className="text-2xl font-bold mb-1">{listing.title}</h1>
                      {/* Display address if available (desktop) */}
                     {formattedAddress && (
                       <p className="text-sm text-muted-foreground mb-2">{formattedAddress}</p>
                     )}
                     <p className="text-xl font-semibold text-primary mb-1"> 
                       {formatPrice(price)}
                     </p>
                     {/* Display price per sotka if available (desktop) */}
                     {pricePerSotkaFormatted && (
                       <p className="text-sm text-muted-foreground mb-4"> {/* Added margin bottom */}
                         {pricePerSotkaFormatted} / сотка
                       </p>
                     )}
                   </div>
                   
                   {/* --- Call Link (Styled as Button) --- */}
                   {/* Show skeleton while loading, then button/link */} 
                   {isLoadingPhone ? (
                        <Button variant="default" className="w-full" disabled>
                            <Phone size={16} className="mr-2 animate-pulse"/> Загрузка...
                        </Button>
                   ) : contactPhone ? (
                     <a 
                       href={`tel:${contactPhone}`}
                       className={cn(buttonVariants({ variant: "default" }), "w-full")}
                     >
                       <Phone size={16} className="mr-2"/> 
                       Позвонить 
                     </a>
                   ) : null} {/* Optionally show something if phone fails to load */}

                   {/* --- Application Form --- */}
                   <ApplicationForm 
                     listingId={listing.id} 
                     listingTitle={listing.title} 
                     modelName={modelName}
                     appLabel={appLabel}
                   />

                   {/* Removed Contact Block and Action Buttons Block */}
                   
               </div>
           </div>{/* Closing tag for md:col-span-1 */} 

         </div>{/* Closing tag for grid */} 
       </div>{/* Closing tag for container */} 

       {/* --- FsLightbox Component --- */}
       <FsLightbox
        toggler={lightboxToggler}
        sources={imageSources}
        slide={lightboxSlideIndex + 1}
       />

       {/* --- Floating Back Button (Mobile Only) --- */}
       <Button 
         variant="default"
         size="lg"
         className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg md:hidden p-3" // Adjusted padding
         onClick={() => router.back()} // Go back
         aria-label="Назад к каталогу"
       >
         <ArrowLeft className="h-6 w-6" />
       </Button>

     </div>
   );
 };

export default ListingView; 