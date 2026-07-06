import { ProjectDeletionNotAllowedException } from '../common/exceptions/project-deletion-not-allowed.exception';
import { ProjectNotFoundException } from '../common/exceptions/project-not-found.exception';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectRisk } from './enums/project-risk.enum';
import { ProjectStatus } from './enums/project-status.enum';
import { InMemoryProjectsRepository } from './in-memory-projects.repository';
import { ProjectsService } from './projects.service';
import { RiskCalculatorService } from './risk-calculator.service';
import { StatusTransitionService } from './status-transition.service';

describe('ProjectsService', () => {
  let projectsService: ProjectsService;

  const createProjectDto: CreateProjectDto = {
    nome: 'Projeto de teste',
    dataInicio: '2026-01-01',
    previsaoTermino: '2026-02-01',
    orcamentoTotal: 50000,
    descricao: 'Descricao do projeto de teste',
  };

  beforeEach(() => {
    projectsService = new ProjectsService(
      new InMemoryProjectsRepository(),
      new RiskCalculatorService(),
      new StatusTransitionService(),
    );
  });

  describe('create', () => {
    it('cria um projeto com status EM_ANALISE', () => {
      const project = projectsService.create(createProjectDto);

      expect(project.status).toBe(ProjectStatus.EM_ANALISE);
    });

    it('calcula o risco do projeto na criacao', () => {
      const project = projectsService.create(createProjectDto);

      expect(project.risco).toBe(ProjectRisk.BAIXO);
    });

    it('gera um id e datas de criacao/atualizacao', () => {
      const project = projectsService.create(createProjectDto);

      expect(project.id).toBeDefined();
      expect(project.createdAt).toBeDefined();
      expect(project.updatedAt).toBe(project.createdAt);
    });

    it('persiste o projeto para ser encontrado depois', () => {
      const project = projectsService.create(createProjectDto);

      expect(projectsService.findOne(project.id)).toEqual(project);
    });
  });

  describe('findOne', () => {
    it('lanca ProjectNotFoundException quando o projeto nao existe', () => {
      expect(() => projectsService.findOne('id-inexistente')).toThrow(
        ProjectNotFoundException,
      );
    });
  });

  describe('update', () => {
    it('recalcula o risco quando o orcamento muda', () => {
      const project = projectsService.create(createProjectDto);

      const updatedProject = projectsService.update(project.id, {
        orcamentoTotal: 900000,
      });

      expect(updatedProject.risco).toBe(ProjectRisk.ALTO);
    });

    it('recalcula o risco quando as datas mudam', () => {
      const project = projectsService.create(createProjectDto);

      const updatedProject = projectsService.update(project.id, {
        previsaoTermino: '2027-06-01',
      });

      expect(updatedProject.risco).toBe(ProjectRisk.ALTO);
    });

    it('nao recalcula o risco quando apenas nome/descricao mudam', () => {
      const project = projectsService.create(createProjectDto);

      const updatedProject = projectsService.update(project.id, {
        nome: 'Novo nome',
      });

      expect(updatedProject.risco).toBe(project.risco);
      expect(updatedProject.nome).toBe('Novo nome');
    });
  });

  describe('remove', () => {
    it('remove um projeto com status EM_ANALISE', () => {
      const project = projectsService.create(createProjectDto);

      projectsService.remove(project.id);

      expect(() => projectsService.findOne(project.id)).toThrow(
        ProjectNotFoundException,
      );
    });

    it('bloqueia a remocao de um projeto EM_ANDAMENTO', () => {
      const project = projectsService.create(createProjectDto);
      projectsService.updateStatus(project.id, ProjectStatus.APROVADO);
      projectsService.updateStatus(project.id, ProjectStatus.EM_ANDAMENTO);

      expect(() => projectsService.remove(project.id)).toThrow(
        ProjectDeletionNotAllowedException,
      );
    });

    it('bloqueia a remocao de um projeto ENCERRADO', () => {
      const project = projectsService.create(createProjectDto);
      projectsService.updateStatus(project.id, ProjectStatus.APROVADO);
      projectsService.updateStatus(project.id, ProjectStatus.EM_ANDAMENTO);
      projectsService.updateStatus(project.id, ProjectStatus.ENCERRADO);

      expect(() => projectsService.remove(project.id)).toThrow(
        ProjectDeletionNotAllowedException,
      );
    });
  });

  describe('updateStatus', () => {
    it('atualiza o status quando a transicao e valida', () => {
      const project = projectsService.create(createProjectDto);

      const updatedProject = projectsService.updateStatus(
        project.id,
        ProjectStatus.APROVADO,
      );

      expect(updatedProject.status).toBe(ProjectStatus.APROVADO);
    });
  });
});
