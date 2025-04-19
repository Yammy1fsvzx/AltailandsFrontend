import React from 'react';
import { PropertyType } from '@/types/catalog';
import { Button } from '@/components/ui/button'; // Using shadcn button

interface CategorySelectorProps {
  categories: PropertyType[]; // Includes the manually added 'land-plots'
  selectedCategorySlug: string | null;
  onSelectCategory: (slug: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategorySlug,
  onSelectCategory,
}) => {
  return (
    // Outer container enables horizontal scroll
    <div className="overflow-x-auto pb-2 -mb-2"> {/* Add padding for scrollbar space */}
      {/* Inner container prevents wrapping */}
      <div className="flex whitespace-nowrap gap-3">
        {categories.map((category) => (
          <Button
            key={category.slug}
            variant={selectedCategorySlug === category.slug ? 'default' : 'outline'}
            size="lg"
            onClick={() => onSelectCategory(category.slug)}
            className="hover:text-white"
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector; 