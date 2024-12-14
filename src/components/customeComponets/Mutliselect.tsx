import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";

interface Option {
  readonly label: string;
  readonly value: string;
}

interface MultiSelectProps {
  field?: any; // For form integrations like react-hook-form
  isMulti?: boolean;
  options: Option[]; // Options to populate the dropdown
  className?: string;
  classNamePrefix?: string;
  onChange?: (selected: Option[]) => void;
  onCreateOption?: (inputValue: string) => void;
  isClearable?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  value?: Option[]; // Controlled value
}

const createOption = (label: string): Option => ({
  label,
  value: label.trim(), // Keep spaces and alphanumeric characters
});

const MultiSelect: React.FC<MultiSelectProps> = ({
  field,
  isMulti = true,
  options: initialOptions,
  className,
  classNamePrefix = "select",
  onChange,
  onCreateOption,
  isClearable = true,
  isDisabled = false,
  isLoading = false,
  value,
}) => {
  const [options, setOptions] = useState<Option[]>(initialOptions);

  const handleCreate = (inputValue: string) => {
    const newOption = createOption(inputValue);
    setOptions((prev) => [...prev, newOption]);
    onCreateOption?.(inputValue); // Call parent's create handler if provided
    onChange?.(isMulti ? [...(value || []), newOption] : [newOption]); // Update selection
  };

  const handleChange = (selected: Option[]) => {
    onChange?.(selected);
  };

  return (
    <div className={className}>
      <CreatableSelect
        {...field} // To support form libraries like react-hook-form
        isMulti={isMulti}
        options={options}
        classNamePrefix={classNamePrefix}
        isClearable={isClearable}
        isDisabled={isDisabled}
        isLoading={isLoading}
        value={value}
        onChange={handleChange}
        onCreateOption={handleCreate}
        placeholder="Select or create options..."
      />
    </div>
  );
};

export default MultiSelect;
