import { Slider } from "@/components/ui/slider"

interface SliderControlProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  unit?: string
  decimals?: number
}

export function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit,
  decimals = 0,
}: SliderControlProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">{label}</span>
        <span className="font-mono text-xs tabular-nums text-text-tertiary">
          {value.toFixed(decimals)}
          {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  )
}
