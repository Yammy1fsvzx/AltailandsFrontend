import React from 'react';
// import CategorySelector from './CategorySelector'; // Removed import
import FilterPanel from './FilterPanel';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, Filter } from 'lucide-react';
import { PropertyType } from '@/types/catalog'; // Keep PropertyType if needed elsewhere, otherwise remove
import { FrontendFilterOption, CurrentFiltersState } from './CatalogClient';

// Define Props Interface (Removed Category props)
interface TopFilterBarProps {
  // REMOVED Category props
  // allCategories: PropertyType[];
  // selectedCategorySlug: string | null;
  // onSelectCategory: (slug: string) => void;
  // Search props
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // Filter props
  availableFilters: FrontendFilterOption[];
  currentFilters: CurrentFiltersState;
  onFilterChange: (newFilters: CurrentFiltersState) => void;
  isFilterLoading: boolean;
}

const TopFilterBar: React.FC<TopFilterBarProps> = ({
  // REMOVED Category props destructuring
  // allCategories,
  // selectedCategorySlug,
  // onSelectCategory,
  searchQuery,
  onSearchChange,
  availableFilters,
  currentFilters,
  onFilterChange,
  isFilterLoading
}) => {
  return (
    // Conditional positioning: fixed bottom on mobile, relative in flow on desktop
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t p-3 flex gap-3 items-center 
                    md:relative md:bottom-auto md:left-auto md:right-auto md:z-auto md:border-t-0 md:p-0 md:items-end md:justify-between"> 
      
      {/* Search Input - Stays mostly the same, width adjusted by parent */}
      <div className="relative w-full flex-grow"> 
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={onSearchChange}
          className="pl-10 w-full h-10 md:h-9" // Adjusted height for consistency on mobile
        />
      </div>

      {/* Filters Button with Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          {/* Remove text on mobile */} 
          <Button variant="outline" className="flex-shrink-0 h-10 w-10 md:h-auto md:w-auto p-0 md:px-4 md:py-2"> 
            <Filter size={18} className="md:mr-2" /> {/* Slightly larger icon, remove margin on mobile */} 
            <span className="hidden md:inline">Фильтры</span> {/* Hide text on mobile */} 
          </Button>
        </SheetTrigger>
        {/* Increase width on medium screens */}
        <SheetContent side="right" className="w-[300px] sm:w-[400px] md:w-[600px] p-0 flex flex-col">
           {/* Make SheetHeader visible again with padding and border */}
           <SheetHeader className="p-6 pb-4 border-b"> 
                {/* Remove sr-only to make title visible */}
                <SheetTitle>Фильтры</SheetTitle>
           </SheetHeader>
           {/* Make the content area scrollable */}
           <div className="flex-1 overflow-y-auto p-6">
               <FilterPanel 
                  availableFilters={availableFilters}
                  currentFilters={currentFilters}
                  onFilterChange={onFilterChange}
                  isLoading={isFilterLoading}
               />
           </div>
        </SheetContent>
      </Sheet>

      {/* Placeholder for other potential buttons like 'Save Search' */}

    </div>
  );
};

export default TopFilterBar; 