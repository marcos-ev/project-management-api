export const AI_CLIENT = 'AI_CLIENT';

export interface AiAnalysisResult {
  resumo: string;
  pontosDeAtencao: string[];
  recomendacaoExecutiva: string;
}

export interface AiClient {
  analyze(prompt: string): Promise<AiAnalysisResult>;
}
