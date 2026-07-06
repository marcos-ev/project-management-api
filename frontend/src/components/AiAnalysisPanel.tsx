import type { AiAnalysisResult } from '../types/ai-analysis'
import { LoadingState } from './LoadingState'

interface AiAnalysisPanelProps {
  analysis: AiAnalysisResult | null
  isLoading: boolean
  error: string | null
}

export function AiAnalysisPanel({ analysis, isLoading, error }: AiAnalysisPanelProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <LoadingState label="Gerando análise com IA..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    )
  }

  if (!analysis) return null

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div>
        <h4 className="text-sm font-semibold text-blue-900">Resumo</h4>
        <p className="mt-1 text-sm text-blue-800">{analysis.resumo}</p>
      </div>

      {analysis.pontosDeAtencao.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-blue-900">Pontos de atenção</h4>
          <ul className="mt-1 list-inside list-disc text-sm text-blue-800">
            {analysis.pontosDeAtencao.map((ponto) => (
              <li key={ponto}>{ponto}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold text-blue-900">Recomendação executiva</h4>
        <p className="mt-1 text-sm text-blue-800">{analysis.recomendacaoExecutiva}</p>
      </div>
    </div>
  )
}
