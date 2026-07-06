import { NotFoundException } from '@nestjs/common';

export class ProjectNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Projeto com id "${id}" nao foi encontrado`);
  }
}
