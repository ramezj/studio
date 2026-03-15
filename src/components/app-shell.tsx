import { Outlet } from "react-router-dom"
import { ToolSwitcher } from "@/components/tool-switcher"

export function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden">
      <ToolSwitcher />
      <Outlet />
    </div>
  )
}
