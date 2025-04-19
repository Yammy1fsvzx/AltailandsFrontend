import React, { useState, useEffect, useCallback } from 'react';
import { FrontendFilterOption, CurrentFiltersState } from './CatalogClient'; // Import types from CatalogClient
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatPrice } from '@/utils/formatting'; // Assuming formatPrice exists
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Import Accordion components

// Re-define RangeFilterOption locally for type assertion
interface RangeFilterOption {
    type: 'range';
    param: string;
    label: string;
    min: number;
    max: number;
    currentMin?: number;
    currentMax?: number;
}

interface FilterPanelProps {
  availableFilters: FrontendFilterOption[];
  currentFilters: CurrentFiltersState;
  onFilterChange: (newFilters: CurrentFiltersState) => void;
  isLoading: boolean;
}

// Debounce helper (or use a library/hook)
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => resolve(func(...args)), waitFor);
    });
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
    availableFilters, 
    currentFilters, 
    onFilterChange,
    isLoading 
}) => {

  // --- State for Range Sliders (to handle intermediate values) ---
  // Initialize with values from currentFilters or defaults
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 1000]);
  // Add state for other potential range filters if needed

  useEffect(() => {
      const priceFilter = availableFilters.find(f => f.param === 'price' && f.type === 'range') as RangeFilterOption | undefined;
      const initialMinPrice = currentFilters.price_min ?? priceFilter?.min ?? 0;
      const initialMaxPrice = currentFilters.price_max ?? priceFilter?.max ?? 100000000;
      // Only update if bounds actually changed to avoid infinite loops with slider updates
      if (priceRange[0] !== initialMinPrice || priceRange[1] !== initialMaxPrice) {
          setPriceRange([initialMinPrice, initialMaxPrice]);
      }

      const areaFilter = availableFilters.find(f => f.param === 'area' && f.type === 'range') as RangeFilterOption | undefined;
      const initialMinArea = currentFilters.area_min ?? areaFilter?.min ?? 0;
      const initialMaxArea = currentFilters.area_max ?? areaFilter?.max ?? 1000;
       if (areaRange[0] !== initialMinArea || areaRange[1] !== initialMaxArea) {
            setAreaRange([initialMinArea, initialMaxArea]);
       }

  }, [availableFilters, currentFilters, priceRange, areaRange]); // Added slider states to dependencies with care

  // --- Debounced Handlers for Range Sliders ---
  const debouncedPriceChange = useCallback(
    debounce((value: [number, number]) => {
      const priceFilter = availableFilters.find(f => f.param === 'price' && f.type === 'range') as RangeFilterOption | undefined;
      // Only trigger update if value differs from initial bounds
      const changedMin = value[0] !== (priceFilter?.min ?? 0);
      const changedMax = value[1] !== (priceFilter?.max ?? 100000000);
      onFilterChange({ 
          price_min: changedMin ? value[0] : undefined, 
          price_max: changedMax ? value[1] : undefined 
      });
    }, 500),
    [onFilterChange, availableFilters] // Added availableFilters dependency
  );

  const handlePriceSliderChange = (value: [number, number]) => {
    setPriceRange(value); 
    debouncedPriceChange(value);
  };

   const debouncedAreaChange = useCallback(
    debounce((value: [number, number]) => {
       const areaFilter = availableFilters.find(f => f.param === 'area' && f.type === 'range') as RangeFilterOption | undefined;
       const changedMin = value[0] !== (areaFilter?.min ?? 0);
       const changedMax = value[1] !== (areaFilter?.max ?? 1000);
      onFilterChange({ 
          area_min: changedMin ? value[0] : undefined, 
          area_max: changedMax ? value[1] : undefined 
      });
    }, 500),
    [onFilterChange, availableFilters] // Added availableFilters dependency
  );

   const handleAreaSliderChange = (value: [number, number]) => {
     setAreaRange(value);
     debouncedAreaChange(value);
   };
   
   // Add similar handlers for other range filters

  // --- Handler for MultiSelect Checkboxes --- 
  const handleMultiSelectChange = (param: string, value: number, isChecked: boolean) => {
      const currentSelection = (currentFilters[param] as number[] | undefined) || [];
      let newSelection: number[];
      if (isChecked) {
          newSelection = [...currentSelection, value];
      } else {
          newSelection = currentSelection.filter(id => id !== value);
      }
      onFilterChange({ [param]: newSelection.length > 0 ? newSelection : undefined }); // Send undefined if empty
  };

  // --- Render Logic without Card wrapper ---
  if (isLoading) {
    // Return Skeletons directly
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    );
  }

  if (availableFilters.length === 0) {
    // Return placeholder message directly
    return <p className="text-sm text-muted-foreground">Доступные фильтры не определены.</p>;
  }

  // Return Accordion directly
  return (
    <Accordion type="multiple" defaultValue={['price']} className="w-full">
        {availableFilters.map((filter) => (
            <AccordionItem key={filter.param} value={filter.param}>
                <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
                    {filter.label}
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-2 space-y-4"> {/* Added padding/spacing */} 
                    
                    {/* Render Range Slider */} 
                    {filter.type === 'range' && (
                        <div>
                            <Slider
                                min={filter.min}
                                max={filter.max}
                                step={filter.param === 'price' ? 10000 : (filter.param === 'area' ? 1 : 1)}
                                value={filter.param === 'price' ? priceRange : (filter.param === 'area' ? areaRange : [filter.min, filter.max])}
                                onValueChange={filter.param === 'price' ? handlePriceSliderChange : (filter.param === 'area' ? handleAreaSliderChange : undefined)}
                                minStepsBetweenThumbs={1}
                                className="mb-2"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground px-1"> {/* Added horizontal padding */} 
                                {/* Use non-breaking space for better alignment */} 
                                <span>{filter.param === 'price' ? formatPrice(priceRange[0]) : `${areaRange[0]}\u00A0сот.`}</span> 
                                <span>{filter.param === 'price' ? formatPrice(priceRange[1]) : `${areaRange[1]}\u00A0сот.`}</span> 
                            </div>
                        </div>
                    )}

                    {/* Render MultiSelect Checkboxes */} 
                    {filter.type === 'multiselect' && (
                        // Removed max-height, keep scroll if needed, but let Accordion handle collapse
                        <div className="space-y-2.5"> 
                            {filter.options.map(option => (
                                <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`${filter.param}-${option.value}`}
                                        checked={((currentFilters[filter.param] as number[] | undefined) || []).includes(option.value)}
                                        onCheckedChange={(checked) => handleMultiSelectChange(filter.param, option.value, !!checked)}
                                    />
                                    <Label htmlFor={`${filter.param}-${option.value}`} className="text-sm font-normal cursor-pointer">
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Add rendering for other filter types here */}

                </AccordionContent>
            </AccordionItem>
        ))}
    </Accordion>
  );
};

export default FilterPanel; 