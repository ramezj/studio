import type React from "react"

export interface ToolDefinition {
  id: string
  name: string
  icon: string
  component: React.LazyExoticComponent<React.ComponentType>
}

export interface ColorStop {
  color: string
  position: number
}

export interface PaletteColor {
  color: string
  weight: number
}
