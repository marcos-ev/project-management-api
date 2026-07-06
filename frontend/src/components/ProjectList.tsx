import { canDelete, type Project } from '../types/project'
import { formatCurrencyBRL, formatDateBR } from '../utils/format'
import { RiskBadge } from './RiskBadge'
import { StatusBadge } from './StatusBadge'

interface ProjectListProps {
  projects: Project[]
  onView: (project: Project) => void
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
  onRequestAiAnalysis: (project: Project) => void
}

export function ProjectList({
  projects,
  onView,
  onEdit,
  onDelete,
  onRequestAiAnalysis,
}: ProjectListProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Nome</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Risco</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Orçamento</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Início</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500">Previsão de término</th>
            <th className="px-4 py-3 text-right font-medium text-gray-500">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {projects.map((project) => {
            const deletable = canDelete(project.status)
            return (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{project.nome}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-4 py-3">
                  <RiskBadge risk={project.risco} />
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {formatCurrencyBRL(project.orcamentoTotal)}
                </td>
                <td className="px-4 py-3 text-gray-700">{formatDateBR(project.dataInicio)}</td>
                <td className="px-4 py-3 text-gray-700">
                  {formatDateBR(project.previsaoTermino)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onView(project)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50"
                    >
                      Detalhes
                    </button>
                    <button
                      type="button"
                      onClick={() => onRequestAiAnalysis(project)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-purple-700 hover:bg-purple-50"
                    >
                      Análise IA
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(project)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => deletable && onDelete(project)}
                      disabled={!deletable}
                      title={
                        deletable
                          ? undefined
                          : 'Projetos em andamento ou encerrados não podem ser removidos'
                      }
                      className="rounded-md px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                    >
                      Remover
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
