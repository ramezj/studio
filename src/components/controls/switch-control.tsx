import { Switch } from "@/components/ui/switch"

interface SwitchControlProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function SwitchControl({
  label,
  checked,
  onChange,
}: SwitchControlProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-text-secondary">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
