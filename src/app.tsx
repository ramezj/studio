import { Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { AppShell } from "@/components/app-shell"
import { tools } from "@/tools/registry"

function getDefaultTool(): string {
  const stored = localStorage.getItem("studio:last-tool")
  if (stored && tools.some((t) => t.id === stored)) {
    return stored
  }
  return tools[0].id
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {tools.map((tool) => (
          <Route
            key={tool.id}
            path={tool.id}
            element={
              <Suspense>
                <tool.component />
              </Suspense>
            }
          />
        ))}
        <Route path="*" element={<Navigate to={`/${getDefaultTool()}`} replace />} />
      </Route>
    </Routes>
  )
}
