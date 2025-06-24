import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const predefinedColors = [
  '#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF',
  '#5856D6', '#FF2D55', '#8E8E93', '#000000', '#FFFFFF', '#808080'
];

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColorInput, setCustomColorInput] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setCustomColorInput(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomColorInput(e.target.value);
  };

  const handleCustomColorBlur = () => {
    if (/^#([0-9A-F]{3}){1,2}$/i.test(customColorInput)) {
      onChange(customColorInput);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: value }}></div>
        <span>{value}</span>
        <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
      </Button>
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-md border bg-popover p-4 text-popover-foreground shadow-md">
          <div className="grid grid-cols-6 gap-2 mb-3">
            {predefinedColors.map((color, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full border-2 border-border cursor-pointer transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
              ></div>
            ))}
          </div>
          <Input
            type="text"
            value={customColorInput}
            onChange={handleCustomColorChange}
            onBlur={handleCustomColorBlur}
            placeholder="#000000"
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;