import type { ReactNode } from 'react'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: ReactNode
}

export function EmptyState({
  title = 'Nenhum projeto encontrado',
  description = 'Comece criando o primeiro projeto.',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
      <p className="text-base font-medium text-gray-900">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
      {action}
    </div>
  )
}
