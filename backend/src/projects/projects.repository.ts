import { Project } from './entities/project.entity';

export const PROJECTS_REPOSITORY = 'PROJECTS_REPOSITORY';

export interface ProjectsRepository {
  create(project: Project): Project;
  findAll(): Project[];
  findById(id: string): Project | undefined;
  update(id: string, project: Project): Project;
  delete(id: string): void;
}
