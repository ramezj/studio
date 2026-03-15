interface ButtonRowProps {
  children: React.ReactNode
}

export function ButtonRow({ children }: ButtonRowProps) {
  return (
    <div className="mt-2 flex flex-col gap-1 border-t border-border-control pt-3">
      {children}
    </div>
  )
}
