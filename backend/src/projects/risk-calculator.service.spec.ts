import { ProjectRisk } from './enums/project-risk.enum';
import { RiskCalculatorService } from './risk-calculator.service';

describe('RiskCalculatorService', () => {
  let riskCalculatorService: RiskCalculatorService;

  beforeEach(() => {
    riskCalculatorService = new RiskCalculatorService();
  });

  describe('risco BAIXO', () => {
    it('classifica como BAIXO quando orcamento e prazo estao dentro dos limites', () => {
      const risco = riskCalculatorService.calculate(
        '2026-01-01',
        '2026-02-01',
        50000,
      );

      expect(risco).toBe(ProjectRisk.BAIXO);
    });

    it('classifica como BAIXO no limite exato de orcamento (100000) e prazo (3 meses)', () => {
      const risco = riskCalculatorService.calculate(
        '2026-01-01',
        '2026-04-01',
        100000,
      );

      expect(risco).toBe(ProjectRisk.BAIXO);
    });
  });

  describe('risco MEDIO', () => {
    it('classifica como MEDIO quando o orcamento esta logo acima do limite baixo', () => {
      const risco = riskCalculatorService.calculate(
        '2026-01-01',
        '2026-02-01',
        100001,
      );

      expect(risco).toBe(ProjectRisk.MEDIO);
    });

    it('classifica como MEDIO no limite exato de orcamento (500000)', () => {
      const risco = riskCalculatorService.calculate(
        '2026-01-01',
        '2026-02-01',
        500000,
      );

      expect(risco).toBe(ProjectRisk.MEDIO);
    });

    it('classifica como MEDIO quando o prazo esta logo acima de 3 meses', () => {
      const risco = riskCalculatorService.calculate(
        '2026-01-01',
        '2026-04-10',
        50000,
      );

      expect(risco).toBe(ProjectRisk.MEDIO);
    });

    it('classifica como MEDIO no limite exato de prazo (6 meses)', () => {
      const risco = riskCalculatorService.calculate(
        '2026-01-01',
        '2026-07-01',
        50000,
      );

      expect(risco).toBe(ProjectRisk.MEDIO);
    });
  });

  describe('risco ALTO', () => {
    it('classifica como ALTO quando o orcamento ultrapassa 500000', () => {
      const risco = riskCalculatorService.calculate(
        '2026-01-01',
        '2026-02-01',
        500001,
      );

      expect(risco).toBe(ProjectRisk.ALTO);
    });

    it('classifica como ALTO quando o prazo ultrapassa 6 meses', () => {
      const risco = riskCalculatorService.calculate(
        '2026-01-01',
        '2026-07-10',
        50000,
      );

      expect(risco).toBe(ProjectRisk.ALTO);
    });
  });

  describe('prevalencia do maior risco', () => {
    it('prevalece o risco ALTO do prazo mesmo com orcamento baixo', () => {
      const risco = riskCalculatorService.calculate(
        '2026-01-01',
        '2026-09-01',
        10000,
      );

      expect(risco).toBe(ProjectRisk.ALTO);
    });

    it('prevalece o risco ALTO do orcamento mesmo com prazo baixo', () => {
      const risco = riskCalculatorService.calculate(
        '2026-01-01',
        '2026-02-01',
        900000,
      );

      expect(risco).toBe(ProjectRisk.ALTO);
    });

    it('prevalece o risco MEDIO quando orcamento indica MEDIO e prazo indica BAIXO', () => {
      const risco = riskCalculatorService.calculate(
        '2026-01-01',
        '2026-01-20',
        200000,
      );

      expect(risco).toBe(ProjectRisk.MEDIO);
    });
  });
});
