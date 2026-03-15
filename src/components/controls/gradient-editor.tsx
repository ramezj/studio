import type { ColorStop } from "@/types/tools"
import { ColorControl } from "./color-control"
import { SliderControl } from "./slider-control"
import { Button } from "@/components/ui/button"

interface GradientEditorProps {
  stops: ColorStop[]
  onChange: (stops: ColorStop[]) => void
}

export function GradientEditor({ stops, onChange }: GradientEditorProps) {
  const updateStop = (index: number, patch: Partial<ColorStop>) => {
    const next = stops.map((s, i) => (i === index ? { ...s, ...patch } : s))
    onChange(next)
  }

  const removeStop = (index: number) => {
    if (stops.length <= 2) return
    onChange(stops.filter((_, i) => i !== index))
  }

  const addStop = () => {
    const sorted = [...stops].sort((a, b) => a.position - b.position)
    let maxGap = 0
    let gapIndex = 0
    for (let i = 0; i < sorted.length - 1; i++) {
      const gap = sorted[i + 1].position - sorted[i].position
      if (gap > maxGap) {
        maxGap = gap
        gapIndex = i
      }
    }
    const a = sorted[gapIndex]
    const b = sorted[gapIndex + 1]
    const position = Math.round((a.position + b.position) / 2)
    // Simple midpoint color — just use the first stop's color
    onChange([...stops, { color: a.color, position }])
  }

  return (
    <div className="flex flex-col gap-3">
      {stops.map((stop, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-md border border-border-control p-2">
          <ColorControl
            label="Color"
            value={stop.color}
            onChange={(color) => updateStop(i, { color })}
          />
          <SliderControl
            label="Position"
            value={stop.position}
            min={0}
            max={100}
            step={1}
            onChange={(position) => updateStop(i, { position })}
            unit="%"
          />
          {stops.length > 2 && (
            <button
              onClick={() => removeStop(i)}
              className="cursor-pointer self-end text-2xs text-text-tertiary hover:text-text-secondary"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <Button variant="secondary" size="sm" onClick={addStop}>
        Add stop
      </Button>
    </div>
  )
}
