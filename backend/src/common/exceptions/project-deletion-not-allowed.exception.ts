import { ConflictException } from '@nestjs/common';
import { ProjectStatus } from '../../projects/enums/project-status.enum';

export class ProjectDeletionNotAllowedException extends ConflictException {
  constructor(status: ProjectStatus) {
    super(`Projetos com status "${status}" nao podem ser removidos`);
  }
}
