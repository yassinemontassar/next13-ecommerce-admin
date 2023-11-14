// ColorPicker.js
import React from 'react';
import { HexColorPicker as ReactColorfulPicker } from 'react-colorful';

interface ColorPickerProps {
  onColorChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorChange }) => {
  const handleColorChange = (newColor: string) => {
    onColorChange(newColor);
  };

  return (
    <div className="flex r mt-4">
      <ReactColorfulPicker
        onChange={handleColorChange}
        className="w-32 h-32 p-3 border border-blue-500 rounded-3xl shadow-md"
      />
    </div>
  );
};

export default ColorPicker;
