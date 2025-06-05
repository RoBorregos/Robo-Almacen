"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "src/components/ui/button";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const QuantitySelector = ({
  value,
  onChange,
  min = 1,
  max = Number.POSITIVE_INFINITY,
}: QuantitySelectorProps) => {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          if (canDecrease) onChange(value - 1);
        }}
        disabled={!canDecrease}
        className="h-10 w-10 rounded-full"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <span className="min-w-[3rem] text-center text-2xl font-semibold">
        {value}
      </span>

      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          if (canIncrease) onChange(value + 1);
        }}
        disabled={!canIncrease}
        className="h-10 w-10 rounded-full"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
