export type ProjectStatus =
  | 'EM_ANALISE'
  | 'APROVADO'
  | 'EM_ANDAMENTO'
  | 'ENCERRADO'
  | 'CANCELADO'

export type ProjectRisk = 'BAIXO' | 'MEDIO' | 'ALTO'

export interface Project {
  id: string
  nome: string
  dataInicio: string
  previsaoTermino: string
  orcamentoTotal: number
  descricao: string
  status: ProjectStatus
  risco: ProjectRisk
  createdAt: string
  updatedAt: string
}

export interface CreateProjectDto {
  nome: string
  dataInicio: string
  previsaoTermino: string
  orcamentoTotal: number
  descricao: string
}

export type UpdateProjectDto = Partial<CreateProjectDto>

export interface UpdateProjectStatusDto {
  status: ProjectStatus
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  EM_ANALISE: 'Em análise',
  APROVADO: 'Aprovado',
  EM_ANDAMENTO: 'Em andamento',
  ENCERRADO: 'Encerrado',
  CANCELADO: 'Cancelado',
}

export const PROJECT_RISK_LABELS: Record<ProjectRisk, string> = {
  BAIXO: 'Baixo',
  MEDIO: 'Médio',
  ALTO: 'Alto',
}

export const PROJECT_STATUS_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  EM_ANALISE: ['APROVADO', 'CANCELADO'],
  APROVADO: ['EM_ANDAMENTO', 'CANCELADO'],
  EM_ANDAMENTO: ['ENCERRADO', 'CANCELADO'],
  ENCERRADO: [],
  CANCELADO: [],
}

export function getNextStatus(status: ProjectStatus): ProjectStatus | null {
  const transitions = PROJECT_STATUS_TRANSITIONS[status]
  const next = transitions.find((transition) => transition !== 'CANCELADO')
  return next ?? null
}

export function canCancel(status: ProjectStatus): boolean {
  return PROJECT_STATUS_TRANSITIONS[status].includes('CANCELADO')
}

export function canDelete(status: ProjectStatus): boolean {
  return status !== 'EM_ANDAMENTO' && status !== 'ENCERRADO'
}
