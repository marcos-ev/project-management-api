import { ConflictException } from '@nestjs/common';
import { ProjectStatus } from '../../projects/enums/project-status.enum';

export class InvalidStatusTransitionException extends ConflictException {
  constructor(from: ProjectStatus, to: ProjectStatus) {
    super(`Transicao de status invalida: "${from}" -> "${to}"`);
  }
}
