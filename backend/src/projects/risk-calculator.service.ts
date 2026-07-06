import { Injectable } from '@nestjs/common';
import { ProjectRisk } from './enums/project-risk.enum';

const RISK_SEVERITY: Record<ProjectRisk, number> = {
  [ProjectRisk.BAIXO]: 0,
  [ProjectRisk.MEDIO]: 1,
  [ProjectRisk.ALTO]: 2,
};

const LOW_RISK_MAX_BUDGET = 100000;
const MEDIUM_RISK_MAX_BUDGET = 500000;
const LOW_RISK_MAX_DEADLINE_MONTHS = 3;
const MEDIUM_RISK_MAX_DEADLINE_MONTHS = 6;

@Injectable()
export class RiskCalculatorService {
  calculate(
    dataInicio: string,
    previsaoTermino: string,
    orcamentoTotal: number,
  ): ProjectRisk {
    const deadlineInMonths = this.calculateDeadlineInMonths(
      dataInicio,
      previsaoTermino,
    );
    const riskByBudget = this.calculateRiskByBudget(orcamentoTotal);
    const riskByDeadline = this.calculateRiskByDeadline(deadlineInMonths);

    return this.pickHigherRisk(riskByBudget, riskByDeadline);
  }

  private calculateDeadlineInMonths(
    dataInicio: string,
    previsaoTermino: string,
  ): number {
    const startDate = new Date(dataInicio);
    const endDate = new Date(previsaoTermino);

    const yearsDifference =
      endDate.getUTCFullYear() - startDate.getUTCFullYear();
    const monthsDifference = endDate.getUTCMonth() - startDate.getUTCMonth();
    const daysDifference = endDate.getUTCDate() - startDate.getUTCDate();
    const daysInStartMonth = new Date(
      Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth() + 1, 0),
    ).getUTCDate();

    const wholeMonthsBetweenDates = yearsDifference * 12 + monthsDifference;
    const fractionalMonthFromRemainingDays = daysDifference / daysInStartMonth;

    return wholeMonthsBetweenDates + fractionalMonthFromRemainingDays;
  }

  private calculateRiskByBudget(orcamentoTotal: number): ProjectRisk {
    if (orcamentoTotal <= LOW_RISK_MAX_BUDGET) {
      return ProjectRisk.BAIXO;
    }

    if (orcamentoTotal <= MEDIUM_RISK_MAX_BUDGET) {
      return ProjectRisk.MEDIO;
    }

    return ProjectRisk.ALTO;
  }

  private calculateRiskByDeadline(deadlineInMonths: number): ProjectRisk {
    if (deadlineInMonths <= LOW_RISK_MAX_DEADLINE_MONTHS) {
      return ProjectRisk.BAIXO;
    }

    if (deadlineInMonths <= MEDIUM_RISK_MAX_DEADLINE_MONTHS) {
      return ProjectRisk.MEDIO;
    }

    return ProjectRisk.ALTO;
  }

  private pickHigherRisk(a: ProjectRisk, b: ProjectRisk): ProjectRisk {
    return RISK_SEVERITY[a] >= RISK_SEVERITY[b] ? a : b;
  }
}
