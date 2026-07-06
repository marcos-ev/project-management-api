import { Injectable } from '@nestjs/common';
import { InvalidStatusTransitionException } from '../common/exceptions/invalid-status-transition.exception';
import { ProjectStatus } from './enums/project-status.enum';

const ALLOWED_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  [ProjectStatus.EM_ANALISE]: [ProjectStatus.APROVADO, ProjectStatus.CANCELADO],
  [ProjectStatus.APROVADO]: [
    ProjectStatus.EM_ANDAMENTO,
    ProjectStatus.CANCELADO,
  ],
  [ProjectStatus.EM_ANDAMENTO]: [
    ProjectStatus.ENCERRADO,
    ProjectStatus.CANCELADO,
  ],
  [ProjectStatus.ENCERRADO]: [],
  [ProjectStatus.CANCELADO]: [],
};

@Injectable()
export class StatusTransitionService {
  isAllowed(from: ProjectStatus, to: ProjectStatus): boolean {
    return ALLOWED_TRANSITIONS[from].includes(to);
  }

  assertAllowed(from: ProjectStatus, to: ProjectStatus): void {
    if (!this.isAllowed(from, to)) {
      throw new InvalidStatusTransitionException(from, to);
    }
  }
}
