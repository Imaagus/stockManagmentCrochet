import { Loader2 } from 'lucide-react'

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
}

export function Spinner({ size = "md" }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  }

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
  )
}

