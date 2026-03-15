import { NavLink } from "react-router-dom"
import { tools } from "@/tools/registry"
import { ToolIcon } from "@/components/icons"

export function ToolSwitcher() {
  return (
    <nav className="scrollbar-thin flex w-toolbar shrink-0 flex-col items-center gap-3 overflow-y-auto border-r border-border-control bg-sidebar py-3">
      {tools.map((tool) => (
        <NavLink
          key={tool.id}
          to={`/${tool.id}`}
          onClick={() =>
            localStorage.setItem("studio:last-tool", tool.id)
          }
          className="relative flex flex-col items-center gap-1.5"
        >
          {({ isActive }) => (
            <>
              <div
                className={`rounded-lg p-0.5 transition-all duration-150 ${
                  isActive
                    ? "bg-white/10 ring-1 ring-white/20"
                    : "grayscale brightness-50 hover:brightness-75 hover:grayscale-50"
                }`}
              >
                <ToolIcon tool={tool.id} />
              </div>
              <span
                className={`text-[9px] leading-none transition-colors duration-150 ${
                  isActive ? "text-white" : "text-text-muted"
                }`}
              >
                {tool.name}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
