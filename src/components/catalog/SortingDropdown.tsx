import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Using shadcn select
import { SortingOption } from '@/types/catalog';

interface SortingDropdownProps {
  options: SortingOption[];
  currentValue: string;
  onValueChange: (value: string) => void;
}

const SortingDropdown: React.FC<SortingDropdownProps> = ({
  options,
  currentValue,
  onValueChange,
}) => {
  return (
    <Select value={currentValue} onValueChange={onValueChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Сортировать по..." />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SortingDropdown; 