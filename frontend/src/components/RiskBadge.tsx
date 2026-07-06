import { PROJECT_RISK_LABELS, type ProjectRisk } from '../types/project'

const RISK_STYLES: Record<ProjectRisk, string> = {
  BAIXO: 'bg-green-100 text-green-700 ring-green-300',
  MEDIO: 'bg-yellow-100 text-yellow-700 ring-yellow-300',
  ALTO: 'bg-red-100 text-red-700 ring-red-300',
}

interface RiskBadgeProps {
  risk: ProjectRisk
}

export function RiskBadge({ risk }: RiskBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${RISK_STYLES[risk]}`}
    >
      {PROJECT_RISK_LABELS[risk]}
    </span>
  )
}
