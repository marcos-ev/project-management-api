import { Injectable } from '@nestjs/common';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class ProjectAnalysisPromptBuilder {
  build(project: Project): string {
    return [
      'Analise o projeto abaixo e produza um resumo executivo, pontos de atencao e uma recomendacao.',
      `Nome: ${project.nome}`,
      `Descricao: ${project.descricao}`,
      `Status atual: ${project.status}`,
      `Nivel de risco: ${project.risco}`,
      `Data de inicio: ${project.dataInicio}`,
      `Previsao de termino: ${project.previsaoTermino}`,
      `Orcamento total: ${project.orcamentoTotal}`,
    ].join('\n');
  }
}
