import { ProjectRisk } from '../enums/project-risk.enum';
import { ProjectStatus } from '../enums/project-status.enum';

export class Project {
  id: string;
  nome: string;
  dataInicio: string;
  previsaoTermino: string;
  orcamentoTotal: number;
  descricao: string;
  status: ProjectStatus;
  risco: ProjectRisk;
  createdAt: string;
  updatedAt: string;
}
