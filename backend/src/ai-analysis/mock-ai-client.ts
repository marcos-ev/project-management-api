import { Injectable } from '@nestjs/common';
import { ProjectRisk } from '../projects/enums/project-risk.enum';
import { ProjectStatus } from '../projects/enums/project-status.enum';
import { AiAnalysisResult, AiClient } from './ai-client.interface';

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
const REMAINING_DAYS_ATTENTION_THRESHOLD = 30;
const HIGH_BUDGET_ATTENTION_THRESHOLD = 500000;

interface ParsedPromptData {
  nome: string;
  status: ProjectStatus;
  risco: ProjectRisk;
  previsaoTermino: string;
  orcamentoTotal: number;
}

@Injectable()
export class MockAiClient implements AiClient {
  analyze(prompt: string): Promise<AiAnalysisResult> {
    const data = this.parsePrompt(prompt);
    const remainingDays = this.calculateRemainingDays(data.previsaoTermino);

    return Promise.resolve({
      resumo: this.buildResumo(data, remainingDays),
      pontosDeAtencao: this.buildPontosDeAtencao(data, remainingDays),
      recomendacaoExecutiva: this.buildRecomendacaoExecutiva(
        data,
        remainingDays,
      ),
    });
  }

  private parsePrompt(prompt: string): ParsedPromptData {
    return {
      nome: this.extractField(prompt, 'Nome'),
      status: this.extractField(prompt, 'Status atual') as ProjectStatus,
      risco: this.extractField(prompt, 'Nivel de risco') as ProjectRisk,
      previsaoTermino: this.extractField(prompt, 'Previsao de termino'),
      orcamentoTotal: Number(this.extractField(prompt, 'Orcamento total')),
    };
  }

  private extractField(prompt: string, label: string): string {
    const line = prompt
      .split('\n')
      .find((currentLine) => currentLine.startsWith(`${label}:`));

    return line ? line.slice(label.length + 1).trim() : '';
  }

  private calculateRemainingDays(previsaoTermino: string): number {
    const today = new Date();
    const deadline = new Date(previsaoTermino);
    const differenceInMs = deadline.getTime() - today.getTime();

    return Math.ceil(differenceInMs / MILLISECONDS_PER_DAY);
  }

  private buildResumo(data: ParsedPromptData, remainingDays: number): string {
    const remainingDaysDescription =
      remainingDays >= 0
        ? `${remainingDays} dia(s) restante(s) ate a previsao de termino`
        : `prazo de termino ja vencido ha ${Math.abs(remainingDays)} dia(s)`;

    return (
      `O projeto "${data.nome}" esta com status ${data.status} e risco ${data.risco}, ` +
      `com ${remainingDaysDescription} e orcamento total de ${data.orcamentoTotal}.`
    );
  }

  private buildPontosDeAtencao(
    data: ParsedPromptData,
    remainingDays: number,
  ): string[] {
    const pontosDeAtencao: string[] = [];

    if (data.risco === ProjectRisk.ALTO) {
      pontosDeAtencao.push(
        'Projeto classificado com risco ALTO, requer atencao redobrada',
      );
    }

    if (remainingDays < 0) {
      pontosDeAtencao.push('Prazo de termino ja foi ultrapassado');
    } else if (remainingDays <= REMAINING_DAYS_ATTENTION_THRESHOLD) {
      pontosDeAtencao.push(
        `Prazo restante curto: apenas ${remainingDays} dia(s) ate a previsao de termino`,
      );
    }

    if (data.orcamentoTotal > HIGH_BUDGET_ATTENTION_THRESHOLD) {
      pontosDeAtencao.push('Orcamento total elevado, acima de 500.000');
    }

    if (data.status === ProjectStatus.CANCELADO) {
      pontosDeAtencao.push(
        'Projeto cancelado, nao ha mais acompanhamento necessario',
      );
    }

    if (pontosDeAtencao.length === 0) {
      pontosDeAtencao.push('Nenhum ponto critico identificado no momento');
    }

    return pontosDeAtencao;
  }

  private buildRecomendacaoExecutiva(
    data: ParsedPromptData,
    remainingDays: number,
  ): string {
    if (
      data.status === ProjectStatus.CANCELADO ||
      data.status === ProjectStatus.ENCERRADO
    ) {
      return 'Nenhuma acao executiva necessaria, projeto ja finalizado.';
    }

    if (data.risco === ProjectRisk.ALTO || remainingDays < 0) {
      return 'Recomenda-se revisao executiva imediata do escopo, prazo e orcamento do projeto.';
    }

    if (data.risco === ProjectRisk.MEDIO) {
      return 'Recomenda-se acompanhamento periodico do cronograma e do orcamento.';
    }

    return 'Projeto dentro dos parametros esperados, manter acompanhamento de rotina.';
  }
}
