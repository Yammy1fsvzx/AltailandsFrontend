'use client';

import React, { useState, useEffect, useCallback, useTransition, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PropertyType, LandPlot, GenericProperty, FilterParams, SortingOption, PaginatedResponse, Listing, AvailableFilter as BackendAvailableFilter, Feature, LandUseType } from '@/types/catalog';
import { getLandPlots, getGenericProperties } from '@/lib/api/catalog';
import { useDebounce } from '@/hooks/useDebounce'; // Assuming useDebounce hook exists

// Import UI Components
import PageHero from '@/components/common/PageHero';
import CategorySelector from '@/components/catalog/CategorySelector'; // Import CategorySelector again
// import FilterPanel from '@/components/catalog/FilterPanel'; // Will be rendered inside TopFilterBar's Sheet
import SortingDropdown from '@/components/catalog/SortingDropdown';
import ListingGrid from '@/components/catalog/ListingGrid';
import PaginationControls from '@/components/catalog/PaginationControls';
import { Skeleton } from "@/components/ui/skeleton";
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // Remove Sheet imports if mobile filters move elsewhere
// import { Button } from '@/components/ui/button'; // Keep Button if needed
// import { Filter } from 'lucide-react'; // Remove Filter icon import if trigger is removed
// import { Search } from 'lucide-react'; // Icon will be inside TopFilterBar
// import { Input } from '@/components/ui/input'; // Input will be inside TopFilterBar
import TopFilterBar from './TopFilterBar';

// Constants
const LAND_PLOT_SLUG = 'land-plots';
const PAGE_SIZE = 20;

// --- Frontend Filter Types --- 
// Define types for filters generated/used on the frontend
interface RangeFilterOption {
  type: 'range';
  param: string; // e.g., 'price', 'area'
  label: string;
  min: number;
  max: number;
  currentMin?: number;
  currentMax?: number;
}

interface MultiSelectFilterOption {
  type: 'multiselect';
  param: string; // e.g., 'features', 'land_use_types'
  label: string;
  options: { value: number; label: string }[];
  selected?: number[];
}

// Union type for filter options displayed in the panel
export type FrontendFilterOption = RangeFilterOption | MultiSelectFilterOption; 

// Type for the state holding current filter values
export interface CurrentFiltersState {
  [param: string]: number | number[] | undefined | null | string; // Allows range values (min/max combined later), multiselect arrays, or single values
  price_min?: number;
  price_max?: number;
  area_min?: number;
  area_max?: number;
  features?: number[];
  land_use_types?: number[];
  // Add others as needed based on generic properties
}

interface CatalogClientProps {
  allCategories: PropertyType[]; // Includes the pseudo land-plot type
  landPlotSortingOptions: SortingOption[];
  genericPropertySortingOptions: SortingOption[];
}

// Helper to create initial empty response
const createEmptyResponse = <T extends {}>(): PaginatedResponse<T> => ({
    count: 0, next: null, previous: null, results: [],
});

// Type guard for LandPlot (can be moved to utils)
function isLandPlot(listing: Listing): listing is LandPlot {
    return listing.hasOwnProperty('area');
}

const CatalogClient: React.FC<CatalogClientProps> = ({
  allCategories,
  landPlotSortingOptions,
  genericPropertySortingOptions,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // --- State --- 
  const [listingsResponse, setListingsResponse] = useState(createEmptyResponse<Listing>()); // Raw API response
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]); // Listings after frontend filtering
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<PropertyType | null>(null);
  const [currentSortingOptions, setCurrentSortingOptions] = useState<SortingOption[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentOrdering, setCurrentOrdering] = useState<string>('-created_at');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Use debounce hook

  // --- New Filter State --- 
  const [availableFilters, setAvailableFilters] = useState<FrontendFilterOption[]>([]);
  const [currentFilters, setCurrentFilters] = useState<CurrentFiltersState>({});
  const [haveFiltersBeenGenerated, setHaveFiltersBeenGenerated] = useState(false);

  // --- URL Update Callback --- 
  // Now handles ONLY category, page, ordering, search
  const updateUrlParams = useCallback((newParams: Record<string, string | undefined>) => { // Keep undefined for clearing
      const currentQuery = new URLSearchParams(searchParams.toString());
      // Only process specified keys
      Object.keys(newParams).forEach(key => {
          if (['category', 'page', 'ordering', 'search'].includes(key)) { 
              const value = newParams[key];
              if (value === undefined || value === null || value === '') {
                  currentQuery.delete(key);
              } else {
                  currentQuery.set(key, String(value));
              }
          }
      });
      startTransition(() => {
          router.push(`/catalog?${currentQuery.toString()}`, { scroll: false });
      });
  }, [router, searchParams, startTransition]);

  // --- Effect to Sync State from URL --- 
  // Parses ONLY category, page, ordering, search. DOES NOT touch filters.
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const categorySlug = params.get('category') || LAND_PLOT_SLUG;
    const category = allCategories.find(c => c.slug === categorySlug) || allCategories.find(c => c.slug === LAND_PLOT_SLUG) || allCategories[0];
    const parsedPage = parseInt(params.get('page') || '1') || 1;
    const parsedOrdering = params.get('ordering') || '-created_at';
    const parsedSearch = params.get('search') || '';
    const sortingOptions = category?.slug === LAND_PLOT_SLUG ? landPlotSortingOptions : genericPropertySortingOptions;

    // --- Removed parsing of filter values from URL --- 

    // Update state based on URL (excluding filters)
    if (category) setSelectedCategory(category);
    if (sortingOptions) setCurrentSortingOptions(sortingOptions);
    setCurrentPage(parsedPage); // Still set page from URL
    setCurrentOrdering(parsedOrdering); // Still set ordering from URL
    // setCurrentFilters(newFilters); // <-- REMOVED: Filters are not set from URL anymore
    if (parsedSearch !== searchQuery) {
        setSearchQuery(parsedSearch); // Still set search from URL
    }

    // Reset filter generation flag if category changes
    if (selectedCategory?.slug !== category?.slug) {
        // We still need to reset the *filter options* when category changes
        setHaveFiltersBeenGenerated(false); 
        // And clear the *filter state* when category changes
        setCurrentFilters({}); 
    }

  // We only want this effect to run when searchParams changes *externally* or critical props change
  // It NO LONGER sets filter state based on URL.
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [searchParams, allCategories, landPlotSortingOptions, genericPropertySortingOptions]); // searchQuery removed as dependency

  // --- Effect to Fetch Data --- 
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
        if (!selectedCategory) return;

        // *** Only use page, ordering, and search for API call ***
        const apiParams: FilterParams = { 
            page: currentPage, 
            ordering: currentOrdering, 
            search: debouncedSearchQuery || undefined // Use debounced search
        };

        console.log('[Client] Fetching API for:', selectedCategory.slug, apiParams);
        setIsLoading(true);
        let response;

        try {
            if (selectedCategory.slug === LAND_PLOT_SLUG) {
                response = await getLandPlots(apiParams);
            } else {
                apiParams.property_type = selectedCategory.slug;
                response = await getGenericProperties(apiParams);
            }
            if (isMounted) {
                 setListingsResponse(response); 
                 // --- Generate initial filters ONLY on first page load for a category --- 
                 if (currentPage === 1 && !haveFiltersBeenGenerated && response.results.length > 0) {
                     console.log("[Client] Generating initial filters from first page data...");
                     generateAndSetAvailableFilters(response.results, selectedCategory);
                     setHaveFiltersBeenGenerated(true);
                 }
            }
        } catch (error) {
            console.error("[Client] Fetch failed:", error);
            if (isMounted) setListingsResponse(createEmptyResponse());
        } finally {
             if (isMounted) setIsLoading(false);
        }
    };

    fetchData();
    return () => { isMounted = false; };

  // Depend on category, page, ordering, and DEBOUNCED search
  }, [selectedCategory, currentPage, currentOrdering, debouncedSearchQuery, haveFiltersBeenGenerated]); 

  // --- Function to Generate Available Filters --- 
  const generateAndSetAvailableFilters = (listings: Listing[], category: PropertyType) => {
      const generatedFilters: FrontendFilterOption[] = [];
      if (!listings || listings.length === 0) {
          setAvailableFilters([]);
          return;
      }

      // 1. Price Filter (Common)
      const prices = listings.map(l => parseFloat(l.price)).filter(p => !isNaN(p));
      if (prices.length > 0) {
          generatedFilters.push({
              type: 'range', param: 'price', label: 'Цена, ₽',
              min: Math.min(...prices), max: Math.max(...prices)
          });
      }

      if (category.slug === LAND_PLOT_SLUG) {
          // 2. Area Filter (Land Plots)
          const areas = listings.map(l => parseFloat((l as LandPlot).area)).filter(a => !isNaN(a));
          if (areas.length > 0) {
              generatedFilters.push({
                  type: 'range', param: 'area', label: 'Площадь, соток',
                  min: Math.min(...areas), max: Math.max(...areas)
              });
          }
          
          // 3. Features Filter (Land Plots - MultiSelect)
          const allFeatures: Feature[] = listings.flatMap(l => (l as LandPlot).features || []);
          const uniqueFeatures = Array.from(new Map(allFeatures.map(f => [f.id, f])).values());
          if (uniqueFeatures.length > 0) {
              generatedFilters.push({
                  type: 'multiselect', param: 'features', label: 'Особенности участка',
                  options: uniqueFeatures.map(f => ({ value: f.id, label: f.name }))
              });
          }

          // 4. Land Use Types Filter (Land Plots - MultiSelect)
          const allUseTypes: LandUseType[] = listings.flatMap(l => (l as LandPlot).land_use_types || []);
          const uniqueUseTypes = Array.from(new Map(allUseTypes.map(t => [t.id, t])).values());
           if (uniqueUseTypes.length > 0) {
              generatedFilters.push({
                  type: 'multiselect', param: 'land_use_types', label: 'Виды разрешенного использования',
                  options: uniqueUseTypes.map(t => ({ value: t.id, label: t.name }))
              });
          }
      
      } else {
          // --- Generate filters for Generic Properties --- 
          // Try using backend-provided available_filters first
          const backendFilters = category.available_filters;
          if (backendFilters && backendFilters.length > 0) {
             console.log("[Client] Using backend-provided filters for:", category.name);
             backendFilters.forEach(bf => {
                 if (bf.type === 'range') {
                     // Get min/max from *current* listings for this attribute using the base param name
                     const attributeName = bf.param; // Use the base param name (e.g., 'attr_area_sqm')
                     const values = listings
                         .map(l => (l as GenericProperty).attributes?.[attributeName])
                         .filter(v => typeof v === 'number' && !isNaN(v)) as number[];
                     if (values.length > 0) {
                         generatedFilters.push({
                             type: 'range', 
                             param: attributeName, // Store the base param name
                             label: bf.label,
                             min: Math.min(...values), 
                             max: Math.max(...values)
                         });
                     }
                 } // Add logic for other backend filter types (select, boolean) if needed
             });
          } else {
             console.warn("[Client] No backend filters found for:", category.name, "Might need fallback logic.");
             // Fallback: Could try deriving from attributes like area_sqm, rooms etc. manually
          }
      }

      console.log("[Client] Generated Filters:", generatedFilters);
      setAvailableFilters(generatedFilters);
  };

  // --- Effect to Perform Frontend Filtering --- 
  useEffect(() => {
    if (!listingsResponse.results) {
        setFilteredListings([]);
        return;
    }

    let listingsToFilter = [...listingsResponse.results];
    console.log("[Client] Filtering frontend data. Filters:", currentFilters, "Data points:", listingsToFilter.length);

    // Apply each active filter
    Object.entries(currentFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) return;

        if (key === 'price_min' && typeof value === 'number') {
            listingsToFilter = listingsToFilter.filter(l => parseFloat(l.price) >= value);
        }
        else if (key === 'price_max' && typeof value === 'number') {
            listingsToFilter = listingsToFilter.filter(l => parseFloat(l.price) <= value);
        }
        else if (isLandPlot(listingsToFilter[0])) { // Apply land-specific filters only if results are land plots
             if (key === 'area_min' && typeof value === 'number') {
                 listingsToFilter = listingsToFilter.filter(l => parseFloat((l as LandPlot).area) >= value);
             }
             else if (key === 'area_max' && typeof value === 'number') {
                 listingsToFilter = listingsToFilter.filter(l => parseFloat((l as LandPlot).area) <= value);
             }
             else if (key === 'features' && Array.isArray(value) && value.length > 0) {
                 listingsToFilter = listingsToFilter.filter(l => 
                    value.every(fid => (l as LandPlot).features?.some(f => f.id === fid))
                 );
             }
             else if (key === 'land_use_types' && Array.isArray(value) && value.length > 0) {
                 listingsToFilter = listingsToFilter.filter(l => 
                    value.every(tid => (l as LandPlot).land_use_types?.some(t => t.id === tid))
                 );
             }
        } else if (!isLandPlot(listingsToFilter[0]) && key.startsWith('attr_')) {
             // Apply generic attribute filters (assuming range for now)
             const attributeName = key.replace('_min', '').replace('_max', '');
             if (key.endsWith('_min') && typeof value === 'number') {
                 listingsToFilter = listingsToFilter.filter(l => (l as GenericProperty).attributes?.[attributeName] >= value);
             } else if (key.endsWith('_max') && typeof value === 'number') {
                 listingsToFilter = listingsToFilter.filter(l => (l as GenericProperty).attributes?.[attributeName] <= value);
             }
             // Add logic for other generic filter types (boolean, select) if needed
        }
    });

    console.log("[Client] Filtered data points:", listingsToFilter.length);
    setFilteredListings(listingsToFilter);

  }, [listingsResponse.results, currentFilters]); // Re-filter when data or filters change


  // --- Event Handlers --- 
  const handleCategoryChange = (slug: string) => {
    // Update URL for category, page, search 
    updateUrlParams({ category: slug, page: '1', search: '' });
    // Directly reset filter state and current page state
    setCurrentFilters({}); 
    setCurrentPage(1); 
    // Filter generation flag will be reset by the URL sync effect
  };

  const handleSortChange = (value: string) => {
    updateUrlParams({ ordering: value, page: '1' }); // Reset page on sort change
  };

  const handlePageChange = (page: number) => {
    updateUrlParams({ page: String(page) });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     setSearchQuery(event.target.value);
     // Debounced search query will trigger URL update via its own effect
  };

  // New handler for filter changes from FilterPanel
  const handleFilterChange = (newFilterValues: CurrentFiltersState) => {
      console.log("[Client] Filters changed:", newFilterValues);
      const mergedFilters = { ...currentFilters, ...newFilterValues };
      // Clean up undefined/null/empty values before updating state
      const cleanFilters: CurrentFiltersState = {};
      Object.entries(mergedFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0) && value !== '') {
              cleanFilters[key] = value;
          }
      });
      // Directly update filter state
      setCurrentFilters(cleanFilters);
      // Directly reset page to 1
      setCurrentPage(1);
      // Do NOT update URL with filters anymore
      // updateUrlParams({ ...cleanFilters, page: '1' }); <-- REMOVED
  };

  // Helper to generate params for clearing filters in URL (REMOVED as filters no longer in URL)
  /* 
  const clearFilters = () => {
      const cleared: Record<string, undefined> = {};
      Object.keys(currentFilters).forEach(key => cleared[key] = undefined);
      return cleared;
  };
  */


  // --- Render --- 
  return (
    <>
      <PageHero title="Каталог Недвижимости" />

      {/* Re-add Category Selector Here */}
      <div className="content-container pt-8 pb-6 px-2"> {/* Add border-b */} 
        <CategorySelector 
            categories={allCategories}
            selectedCategorySlug={selectedCategory?.slug ?? null}
            onSelectCategory={handleCategoryChange}
          />
      </div>

      {/* Render TopFilterBar (Search and Filter Button only) */}
      {/* Container is no longer sticky, positioning is handled inside TopFilterBar */} 
      <div className="content-container py-4 border-b px-2"> 
         <TopFilterBar 
            // REMOVED Category props
            // allCategories={allCategories}
            // selectedCategorySlug={selectedCategory?.slug ?? null}
            // onSelectCategory={handleCategoryChange}
            // Search props
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            // Filter props
            availableFilters={availableFilters}
            currentFilters={currentFilters}
            onFilterChange={handleFilterChange}
            isFilterLoading={isLoading && !haveFiltersBeenGenerated}
         />
      </div>

      {/* Main content area */}
      {/* Add bottom padding for mobile bottom bar */} 
      <div className="content-container pt-6 md:pt-8 pb-24 md:pb-16 px-2"> {/* Increased pb on mobile */} 
          {/* Main Content Area takes full width */}
          <main> 
            {/* Sorting and Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {/* Note: This count is from API, pre-frontend-filtering */} 
                  Найдено: {listingsResponse.count} объектов
                </p>
              )}
              {isLoading ? (
                <Skeleton className="h-10 w-48" />
              ) : (
                <SortingDropdown
                    options={currentSortingOptions}
                    currentValue={currentOrdering}
                    onValueChange={handleSortChange}
                />
              )}
            </div>

            {/* Listing Grid (Needs ListingCard redesign) */} 
            <ListingGrid
              listings={filteredListings} // *** Use filteredListings ***
              isLoading={isLoading || isPending} // Show loading on fetch or filter transition
              itemsPerPage={PAGE_SIZE}
            />

            {/* Pagination Controls */} 
            <div className="mt-6 md:mt-8 flex justify-center">
              {isLoading && listingsResponse.results.length === 0 ? ( // Show skeleton only if truly loading initial data
                <Skeleton className="h-10 w-64" />
              ) : (
                listingsResponse.count > PAGE_SIZE && (
                    <PaginationControls
                        currentPage={currentPage}
                        totalCount={listingsResponse.count} // Total count from API
                        pageSize={PAGE_SIZE}
                        hasNextPage={!!listingsResponse.next}
                        hasPrevPage={!!listingsResponse.previous}
                        onPageChange={handlePageChange}
                    />
                 )
              )}
            </div>
          </main>
      </div>
    </>
  );
};

export default CatalogClient; 