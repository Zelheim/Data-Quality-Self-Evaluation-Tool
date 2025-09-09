// src/components/ui/select.tsx
import * as React from "react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode
  onValueChange?: (value: string) => void
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (onValueChange) {
        onValueChange(event.target.value)
      }
      if (onChange) {
        onChange(event)
      }
    }

    return (
      <select
        ref={ref}
        className={`form-control ${className || ''}`}
        onChange={handleChange}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

interface SelectTriggerProps {
  className?: string
  children?: React.ReactNode
  'aria-labelledby'?: string
}

const SelectTrigger: React.FC<SelectTriggerProps> = ({ children }) => {
  // This is now handled by the Select component itself
  return <>{children}</>
}
SelectTrigger.displayName = "SelectTrigger"

interface SelectValueProps {
  placeholder?: string
  className?: string
}

const SelectValue: React.FC<SelectValueProps> = () => {
  // This is now handled by the Select component itself
  return null
}
SelectValue.displayName = "SelectValue"

interface SelectContentProps {
  children: React.ReactNode
}

const SelectContent: React.FC<SelectContentProps> = ({ children }) => {
  // This is now handled by the Select component itself
  return <>{children}</>
}
SelectContent.displayName = "SelectContent"

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

const SelectItem: React.FC<SelectItemProps> = ({ value, children, disabled }) => {
  return (
    <option value={value} disabled={disabled}>
      {children}
    </option>
  )
}
SelectItem.displayName = "SelectItem"

interface SelectGroupProps {
  children: React.ReactNode
}

const SelectGroup: React.FC<SelectGroupProps> = ({ children }) => {
  return <optgroup>{children}</optgroup>
}
SelectGroup.displayName = "SelectGroup"

interface SelectLabelProps {
  children: React.ReactNode
  className?: string
}

const SelectLabel: React.FC<SelectLabelProps> = ({ children }) => {
  return <option disabled>{children}</option>
}
SelectLabel.displayName = "SelectLabel"

interface SelectSeparatorProps {
  className?: string
}

const SelectSeparator: React.FC<SelectSeparatorProps> = () => {
  return <option disabled>─────────────</option>
}
SelectSeparator.displayName = "SelectSeparator"

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}