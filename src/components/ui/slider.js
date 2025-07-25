import React from 'react';

/**
 * Slider Component
 * Provides a UI element for selecting a value from a range
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - The ID of the slider
 * @param {string} props.name - The name of the slider input
 * @param {number} props.min - Minimum value
 * @param {number} props.max - Maximum value
 * @param {number} props.step - Step increment
 * @param {Array<number>} props.value - Current value as an array with one element
 * @param {Function} props.onValueChange - Handler called when value changes
 */
export const Slider = ({
  id,
  name,
  min = 0,
  max = 100,
  step = 1,
  value = [0],
  onValueChange,
  ...props
}) => {
  // Handle slider change
  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (onValueChange) {
      onValueChange([newValue]);
    }
  };

  return (
    <div className="w-full">
      <input
        id={id}
        name={name}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
        {...props}
      />
    </div>
  );
};

export default Slider;
