import { cn } from '@/lib/utils'
import { Package } from 'lucide-react'

interface EmptyProps {
  title?: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
}

export default function Empty({ title, description, icon: Icon }: EmptyProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center')}>
      {Icon ? (
        <Icon className="w-16 h-16 text-slate-300 mb-4" />
      ) : (
        <Package className="w-16 h-16 text-slate-300 mb-4" />
      )}
      {title && (
        <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-slate-500 max-w-md">{description}</p>
      )}
      {!title && !description && (
        <span className="text-slate-400">Empty</span>
      )}
    </div>
  )
}
