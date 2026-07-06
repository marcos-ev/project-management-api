import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ProjectNotFoundException } from '../common/exceptions/project-not-found.exception';
import { ProjectDeletionNotAllowedException } from '../common/exceptions/project-deletion-not-allowed.exception';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { ProjectStatus } from './enums/project-status.enum';
import { PROJECTS_REPOSITORY } from './projects.repository';
import type { ProjectsRepository } from './projects.repository';
import { RiskCalculatorService } from './risk-calculator.service';
import { StatusTransitionService } from './status-transition.service';

const NON_DELETABLE_STATUSES: ProjectStatus[] = [
  ProjectStatus.EM_ANDAMENTO,
  ProjectStatus.ENCERRADO,
];

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(PROJECTS_REPOSITORY)
    private readonly projectsRepository: ProjectsRepository,
    private readonly riskCalculatorService: RiskCalculatorService,
    private readonly statusTransitionService: StatusTransitionService,
  ) {}

  create(createProjectDto: CreateProjectDto): Project {
    const now = new Date().toISOString();
    const risco = this.riskCalculatorService.calculate(
      createProjectDto.dataInicio,
      createProjectDto.previsaoTermino,
      createProjectDto.orcamentoTotal,
    );

    const project: Project = {
      id: randomUUID(),
      nome: createProjectDto.nome,
      dataInicio: createProjectDto.dataInicio,
      previsaoTermino: createProjectDto.previsaoTermino,
      orcamentoTotal: createProjectDto.orcamentoTotal,
      descricao: createProjectDto.descricao,
      status: ProjectStatus.EM_ANALISE,
      risco,
      createdAt: now,
      updatedAt: now,
    };

    return this.projectsRepository.create(project);
  }

  findAll(): Project[] {
    return this.projectsRepository.findAll();
  }

  findOne(id: string): Project {
    const project = this.projectsRepository.findById(id);

    if (!project) {
      throw new ProjectNotFoundException(id);
    }

    return project;
  }

  update(id: string, updateProjectDto: UpdateProjectDto): Project {
    const existingProject = this.findOne(id);

    const dataInicio =
      updateProjectDto.dataInicio ?? existingProject.dataInicio;
    const previsaoTermino =
      updateProjectDto.previsaoTermino ?? existingProject.previsaoTermino;
    const orcamentoTotal =
      updateProjectDto.orcamentoTotal ?? existingProject.orcamentoTotal;

    const shouldRecalculateRisk =
      updateProjectDto.dataInicio !== undefined ||
      updateProjectDto.previsaoTermino !== undefined ||
      updateProjectDto.orcamentoTotal !== undefined;

    const updatedProject: Project = {
      ...existingProject,
      ...updateProjectDto,
      dataInicio,
      previsaoTermino,
      orcamentoTotal,
      risco: shouldRecalculateRisk
        ? this.riskCalculatorService.calculate(
            dataInicio,
            previsaoTermino,
            orcamentoTotal,
          )
        : existingProject.risco,
      updatedAt: new Date().toISOString(),
    };

    return this.projectsRepository.update(id, updatedProject);
  }

  remove(id: string): void {
    const project = this.findOne(id);

    if (NON_DELETABLE_STATUSES.includes(project.status)) {
      throw new ProjectDeletionNotAllowedException(project.status);
    }

    this.projectsRepository.delete(id);
  }

  updateStatus(id: string, status: ProjectStatus): Project {
    const project = this.findOne(id);

    this.statusTransitionService.assertAllowed(project.status, status);

    const updatedProject: Project = {
      ...project,
      status,
      updatedAt: new Date().toISOString(),
    };

    return this.projectsRepository.update(id, updatedProject);
  }
}
