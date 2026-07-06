import { httpClient } from './http-client'
import type { AiAnalysisResult } from '../types/ai-analysis'

export function getAiAnalysis(projectId: string): Promise<AiAnalysisResult> {
  return httpClient.get<AiAnalysisResult>(`/projects/${projectId}/ai-analysis`)
}
