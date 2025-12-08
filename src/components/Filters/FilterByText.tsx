import React from "react";
import Input from "../DesignSystem/Input";

interface FilterByTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const FilterByText: React.FC<FilterByTextProps> = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="relative w-full md:w-64">
      <Input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default FilterByText;
