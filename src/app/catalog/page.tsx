import React, { Suspense } from 'react';
import { getPropertyTypes } from '@/lib/api/catalog'; // Only fetch types on server now
import { PropertyType } from '@/types/catalog';
import CatalogClient from '@/components/catalog/CatalogClient';

// Constants
const LAND_PLOT_SLUG = 'land-plots';

const landPlotPseudoType: PropertyType = {
    id: 0,
    name: 'Земельные участки',
    slug: LAND_PLOT_SLUG,
    attribute_schema: null,
};

// Sorting options can now be defined directly in CatalogClient or passed if static
// We'll keep them here for now and pass them down
const landPlotSortingOptions = [
    { value: '-created_at', label: 'Сначала новые' },
    { value: 'created_at', label: 'Сначала старые' },
    { value: 'price', label: 'Сначала дешевые' },
    { value: '-price', label: 'Сначала дорогие' },
    { value: 'area', label: 'Площадь (по возрастанию)' },
    { value: '-area', label: 'Площадь (по убыванию)' },
];

const genericPropertySortingOptions = [
    { value: '-created_at', label: 'Сначала новые' },
    { value: 'created_at', label: 'Сначала старые' },
    { value: 'price', label: 'Сначала дешевые' },
    { value: '-price', label: 'Сначала дорогие' },
];

interface CatalogPageProps {
    // searchParams are implicitly available, but we don't need to declare or pass them
    // searchParams: { [key: string]: string | string[] | undefined };
}

// Server Component: Only fetches categories and renders the client component
export default async function CatalogPage({}: CatalogPageProps) {

    // 1. Fetch Property Types (Categories)
    let fetchedPropTypes: PropertyType[] = [];
    try {
        fetchedPropTypes = await getPropertyTypes();
    } catch (error) {
        console.error("Failed to fetch property types on server:", error);
        // Optionally return an error component or message
    }
    const allCategories = [landPlotPseudoType, ...fetchedPropTypes];

    // 2. NO Parsing of searchParams here
    // 3. NO Initial fetch of listings here

    // Render the client component directly, without wrapper div or h1
    return (
        <Suspense fallback={<div>Загрузка каталога...</div>}>
            <CatalogClient
                allCategories={allCategories}
                landPlotSortingOptions={landPlotSortingOptions}
                genericPropertySortingOptions={genericPropertySortingOptions}
            />
        </Suspense>
    );
} 