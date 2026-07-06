import { Injectable } from '@nestjs/common';
import { Project } from './entities/project.entity';
import { ProjectsRepository } from './projects.repository';

@Injectable()
export class InMemoryProjectsRepository implements ProjectsRepository {
  private readonly projects = new Map<string, Project>();

  create(project: Project): Project {
    this.projects.set(project.id, project);
    return project;
  }

  findAll(): Project[] {
    return Array.from(this.projects.values());
  }

  findById(id: string): Project | undefined {
    return this.projects.get(id);
  }

  update(id: string, project: Project): Project {
    this.projects.set(id, project);
    return project;
  }

  delete(id: string): void {
    this.projects.delete(id);
  }
}
