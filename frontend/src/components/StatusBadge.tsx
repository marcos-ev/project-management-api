import { PROJECT_STATUS_LABELS, type ProjectStatus } from '../types/project'

const STATUS_STYLES: Record<ProjectStatus, string> = {
  EM_ANALISE: 'bg-gray-100 text-gray-700 ring-gray-300',
  APROVADO: 'bg-blue-100 text-blue-700 ring-blue-300',
  EM_ANDAMENTO: 'bg-amber-100 text-amber-700 ring-amber-300',
  ENCERRADO: 'bg-emerald-100 text-emerald-700 ring-emerald-300',
  CANCELADO: 'bg-red-100 text-red-700 ring-red-300',
}

interface StatusBadgeProps {
  status: ProjectStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {PROJECT_STATUS_LABELS[status]}
    </span>
  )
}
