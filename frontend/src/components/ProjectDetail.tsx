import { useEffect, useState } from 'react'
import { useAiAnalysis } from '../hooks/useAiAnalysis'
import {
  PROJECT_STATUS_LABELS,
  canCancel,
  getNextStatus,
  type Project,
} from '../types/project'
import { formatCurrencyBRL, formatDateBR } from '../utils/format'
import { AiAnalysisPanel } from './AiAnalysisPanel'
import { Modal } from './Modal'
import { RiskBadge } from './RiskBadge'
import { StatusBadge } from './StatusBadge'

interface ProjectDetailProps {
  project: Project
  onClose: () => void
  onAdvanceStatus: (nextStatus: Project['status']) => Promise<void>
  onCancelProject: () => Promise<void>
  isUpdatingStatus: boolean
  autoGenerateAnalysis?: boolean
}

export function ProjectDetail({
  project,
  onClose,
  onAdvanceStatus,
  onCancelProject,
  isUpdatingStatus,
  autoGenerateAnalysis = false,
}: ProjectDetailProps) {
  const [pendingAction, setPendingAction] = useState<'advance' | 'cancel' | null>(null)
  const { analysis, isLoading, error, generate } = useAiAnalysis()

  useEffect(() => {
    if (autoGenerateAnalysis) {
      generate(project.id)
    }
  }, [autoGenerateAnalysis, project.id, generate])

  const nextStatus = getNextStatus(project.status)
  const showCancel = canCancel(project.status)

  async function handleAdvance() {
    if (!nextStatus) return
    setPendingAction('advance')
    await onAdvanceStatus(nextStatus)
    setPendingAction(null)
  }

  async function handleCancel() {
    setPendingAction('cancel')
    await onCancelProject()
    setPendingAction(null)
  }

  return (
    <Modal title={project.nome} onClose={onClose} widthClassName="max-w-2xl">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={project.status} />
          <RiskBadge risk={project.risco} />
        </div>

        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-medium text-gray-500">Data de início</dt>
            <dd className="text-gray-900">{formatDateBR(project.dataInicio)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Previsão de término</dt>
            <dd className="text-gray-900">{formatDateBR(project.previsaoTermino)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Orçamento total</dt>
            <dd className="text-gray-900">{formatCurrencyBRL(project.orcamentoTotal)}</dd>
          </div>
        </dl>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
          <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">{project.descricao}</p>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-4">
          {nextStatus && (
            <button
              type="button"
              onClick={handleAdvance}
              disabled={isUpdatingStatus}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pendingAction === 'advance' && isUpdatingStatus
                ? 'Avançando...'
                : `Avançar para "${PROJECT_STATUS_LABELS[nextStatus]}"`}
            </button>
          )}

          {showCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUpdatingStatus}
              className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pendingAction === 'cancel' && isUpdatingStatus
                ? 'Cancelando...'
                : 'Cancelar projeto'}
            </button>
          )}

          <button
            type="button"
            onClick={() => generate(project.id)}
            disabled={isLoading}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Gerando...' : 'Gerar análise com IA'}
          </button>
        </div>

        <AiAnalysisPanel analysis={analysis} isLoading={isLoading} error={error} />
      </div>
    </Modal>
  )
}
