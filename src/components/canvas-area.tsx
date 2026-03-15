import { forwardRef } from "react"

const CanvasArea = forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ children, ...props }, ref) => (
    <div
      ref={ref}
      className="flex flex-1 items-center justify-center bg-canvas"
      {...props}
    >
      {children}
    </div>
  )
)
CanvasArea.displayName = "CanvasArea"

export { CanvasArea }
