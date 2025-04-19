import React from 'react';
import { Button } from '@/components/ui/button'; // Using shadcn button

interface PaginationControlsProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalCount,
  pageSize,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  // TODO: Implement more sophisticated pagination (e.g., showing page numbers)
  return (
    <div className="flex items-center justify-between mt-6 py-4 border-t">
      <p className="text-sm text-muted-foreground">
        Показано {Math.min(currentPage * pageSize, totalCount)} из {totalCount} объявлений
      </p>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
        >
          Назад
        </Button>
        <span className='p-2 text-sm'>Стр. {currentPage} из {totalPages}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
        >
          Вперед
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls; 