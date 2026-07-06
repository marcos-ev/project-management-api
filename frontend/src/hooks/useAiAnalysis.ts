import { useCallback, useState } from 'react'
import { getAiAnalysis } from '../api/ai-analysis.api'
import { ApiError } from '../api/http-client'
import type { AiAnalysisResult } from '../types/ai-analysis'

interface UseAiAnalysisResult {
  analysis: AiAnalysisResult | null
  isLoading: boolean
  error: string | null
  generate: (projectId: string) => Promise<void>
  reset: () => void
}

export function useAiAnalysis(): UseAiAnalysisResult {
  const [analysis, setAnalysis] = useState<AiAnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (projectId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAiAnalysis(projectId)
      setAnalysis(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Falha ao gerar a análise de IA.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setAnalysis(null)
    setError(null)
  }, [])

  return { analysis, isLoading, error, generate, reset }
}
