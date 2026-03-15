import type { PaletteColor } from "@/types/tools"
import { ColorControl } from "./color-control"
import { SliderControl } from "./slider-control"
import { Button } from "@/components/ui/button"

interface PaletteEditorProps {
  colors: PaletteColor[]
  onChange: (colors: PaletteColor[]) => void
  presets?: { name: string; colors: PaletteColor[] }[]
}

export function PaletteEditor({
  colors,
  onChange,
  presets,
}: PaletteEditorProps) {
  const updateColor = (index: number, patch: Partial<PaletteColor>) => {
    const next = colors.map((c, i) => (i === index ? { ...c, ...patch } : c))
    onChange(next)
  }

  const removeColor = (index: number) => {
    if (colors.length <= 1) return
    onChange(colors.filter((_, i) => i !== index))
  }

  const addColor = () => {
    onChange([...colors, { color: "#ffffff", weight: 1 }])
  }

  return (
    <div className="flex flex-col gap-3">
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {presets.map((preset) => (
            <Button
              key={preset.name}
              variant="secondary"
              size="sm"
              onClick={() => onChange(preset.colors)}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      )}
      {colors.map((entry, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-md border border-border-control p-2">
          <ColorControl
            label="Color"
            value={entry.color}
            onChange={(color) => updateColor(i, { color })}
          />
          <SliderControl
            label="Weight"
            value={entry.weight}
            min={0}
            max={10}
            step={0.1}
            onChange={(weight) => updateColor(i, { weight })}
            decimals={1}
          />
          {colors.length > 1 && (
            <button
              onClick={() => removeColor(i)}
              className="cursor-pointer self-end text-2xs text-text-tertiary hover:text-text-secondary"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <Button variant="secondary" size="sm" onClick={addColor}>
        Add color
      </Button>
    </div>
  )
}
