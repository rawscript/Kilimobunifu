import { forwardRef } from 'react'

export const Button = forwardRef(({
  children,
  className = '',
  variant = 'primary', // 'primary', 'ghost', 'ghost-dark', 'icon'
  size = 'md', // 'sm', 'md', 'lg'
  isLoading = false,
  disabled = false,
  type = 'button',
  icon: Icon,
  ...props
}, ref) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'ghost': return 'btn-ghost'
      case 'ghost-dark': return 'btn-ghost-dark'
      case 'icon': return 'btn-icon'
      case 'primary':
      default: return 'btn-primary'
    }
  }

  const getSizeClass = () => {
    if (variant === 'icon') return '' // Fixed size via CSS
    switch (size) {
      case 'sm': return 'px-4 py-2 text-xs'
      case 'lg': return 'px-8 py-4 text-base'
      case 'md':
      default: return 'px-6 py-3 text-sm'
    }
  }

  const baseClasses = getVariantClass()
  const sizeClasses = getSizeClass()
  const disabledClasses = disabled || isLoading ? 'opacity-60 cursor-not-allowed transform-none hover:transform-none hover:box-shadow-none' : ''

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses} ${disabledClasses} ${className} outline-none focus:ring-2 focus:ring-sky-brand focus:ring-offset-2 focus:ring-offset-transparent`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className={variant === 'icon' ? 'w-5 h-5' : 'w-4 h-4'} />
      ) : null}
      
      {variant !== 'icon' && children}
    </button>
  )
})

Button.displayName = 'Button'
