import { InvalidStatusTransitionException } from '../common/exceptions/invalid-status-transition.exception';
import { ProjectStatus } from './enums/project-status.enum';
import { StatusTransitionService } from './status-transition.service';

describe('StatusTransitionService', () => {
  let statusTransitionService: StatusTransitionService;

  beforeEach(() => {
    statusTransitionService = new StatusTransitionService();
  });

  describe('transicoes validas', () => {
    it.each([
      [ProjectStatus.EM_ANALISE, ProjectStatus.APROVADO],
      [ProjectStatus.EM_ANALISE, ProjectStatus.CANCELADO],
      [ProjectStatus.APROVADO, ProjectStatus.EM_ANDAMENTO],
      [ProjectStatus.APROVADO, ProjectStatus.CANCELADO],
      [ProjectStatus.EM_ANDAMENTO, ProjectStatus.ENCERRADO],
      [ProjectStatus.EM_ANDAMENTO, ProjectStatus.CANCELADO],
    ])('permite a transicao de %s para %s', (from, to) => {
      expect(statusTransitionService.isAllowed(from, to)).toBe(true);
      expect(() =>
        statusTransitionService.assertAllowed(from, to),
      ).not.toThrow();
    });

    it.each([
      ProjectStatus.EM_ANALISE,
      ProjectStatus.APROVADO,
      ProjectStatus.EM_ANDAMENTO,
    ])('permite cancelar a partir de %s', (from) => {
      expect(
        statusTransitionService.isAllowed(from, ProjectStatus.CANCELADO),
      ).toBe(true);
    });
  });

  describe('transicoes invalidas', () => {
    it.each([
      [ProjectStatus.EM_ANALISE, ProjectStatus.EM_ANDAMENTO],
      [ProjectStatus.EM_ANALISE, ProjectStatus.ENCERRADO],
      [ProjectStatus.APROVADO, ProjectStatus.ENCERRADO],
      [ProjectStatus.ENCERRADO, ProjectStatus.EM_ANDAMENTO],
      [ProjectStatus.CANCELADO, ProjectStatus.EM_ANALISE],
    ])('bloqueia a transicao de %s para %s', (from, to) => {
      expect(statusTransitionService.isAllowed(from, to)).toBe(false);
      expect(() => statusTransitionService.assertAllowed(from, to)).toThrow(
        InvalidStatusTransitionException,
      );
    });

    it('nao permite nenhuma transicao a partir de ENCERRADO', () => {
      expect(
        statusTransitionService.isAllowed(
          ProjectStatus.ENCERRADO,
          ProjectStatus.CANCELADO,
        ),
      ).toBe(false);
    });

    it('nao permite nenhuma transicao a partir de CANCELADO', () => {
      expect(
        statusTransitionService.isAllowed(
          ProjectStatus.CANCELADO,
          ProjectStatus.APROVADO,
        ),
      ).toBe(false);
    });
  });
});
