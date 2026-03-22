import { cn } from '@/lib/utils'
export function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-primary/15 text-primary border-primary/25',
    secondary: 'bg-secondary text-secondary-foreground border-border',
    outline: 'border-border text-muted-foreground',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium font-mono',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
