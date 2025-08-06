'use client';

import * as Slider from '@radix-ui/react-slider';

interface ProgressSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export default function ProgressSlider({
  value,
  onChange,
  disabled = false,
  className = '',
}: ProgressSliderProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm font-medium text-slate-600 min-w-[40px]">
        {value}%
      </span>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        max={100}
        step={5}
        disabled={disabled}
      >
        <Slider.Track className="bg-slate-200 relative grow rounded-full h-2">
          <Slider.Range className="absolute bg-gradient-to-r from-primary-400 to-primary-600 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white shadow-lg rounded-full hover:bg-slate-50 focus:outline-none focus:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-grab active:cursor-grabbing"
          aria-label="Progress"
        />
      </Slider.Root>
    </div>
  );
}