export const Badge = ({ status, children, className = '', showDot = false }) => {
  const getStatusClass = () => {
    switch (status) {
      case 'healthy': return 'badge-healthy'
      case 'warning': return 'badge-warning'
      case 'critical': return 'badge-critical'
      case 'offline': return 'badge-offline'
      default: return 'badge-offline'
    }
  }

  return (
    <span className={`${getStatusClass()} flex w-fit items-center ${className}`}>
      {showDot && (
        <span className={`w-2 h-2 rounded-full mr-1.5 ${status === 'healthy' ? 'bg-healthy animate-pulse' : status === 'warning' ? 'bg-warning' : status === 'critical' ? 'bg-critical' : 'bg-slate-brand'}`} />
      )}
      {children || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
