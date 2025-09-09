// src/components/ui/button.tsx
import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "outline" | "ghost" | "link"
  size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", children, variant = "primary", size = "md", disabled, type = "button", ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case "primary":
          return "btn btn-primary"
        case "secondary":
          return "btn btn-default"
        case "success":
          return "btn btn-success"
        case "danger":
          return "btn btn-danger"
        case "warning":
          return "btn btn-warning"
        case "outline":
          return "btn btn-default"
        case "ghost":
          return "btn btn-link"
        case "link":
          return "btn btn-link"
        default:
          return "btn btn-primary"
      }
    }

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "btn-sm"
        case "lg":
          return "btn-lg"
        default:
          return ""
      }
    }

    return (
      <button
        className={`
          ${getVariantClasses()}
          ${getSizeClasses()}
          ${className}
        `.trim()}
        ref={ref}
        disabled={disabled}
        type={type}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }