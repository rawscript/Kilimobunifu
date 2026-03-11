import { forwardRef } from 'react'

export const GlassCard = forwardRef(({
  children,
  className = '',
  variant = 'base', // 'base', 'subtle', 'heavy', 'dark', 'elevated'
  interactive = false,
  ...props
}, ref) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'subtle': return 'glass-subtle'
      case 'heavy': return 'glass-heavy'
      case 'dark': return 'glass-dark'
      case 'elevated': return 'glass-elevated'
      case 'base':
      default: return 'glass-card'
    }
  }

  const baseClasses = getVariantClass()
  const interactiveClass = interactive ? 'glass-interactive cursor-pointer' : ''

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${interactiveClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
})

GlassCard.displayName = 'GlassCard'
