import React, { useEffect, useState } from "react";

interface CustomNumberInputProps {
  value: number;
  onChange: (newValue: number) => void;
  min: number;
  max: number;
}

const CustomNumberInput: React.FC<CustomNumberInputProps> = ({ value, onChange, min, max }) => {
  return (
    <div className="custom-input">
      <input
        min={min}
        max={max}
        type="number"
        value={value}
        onChange={(e) => {
          const targetValue = Number(e.target.value)
          if (targetValue > max || targetValue < min) return
          onChange(targetValue)
        }}
      />
    </div>
  );
};

export default CustomNumberInput;
