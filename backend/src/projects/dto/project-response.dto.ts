import { ApiProperty } from '@nestjs/swagger';
import { ProjectRisk } from '../enums/project-risk.enum';
import { ProjectStatus } from '../enums/project-status.enum';

export class ProjectResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty({ example: '2026-01-15' })
  dataInicio: string;

  @ApiProperty({ example: '2026-07-15' })
  previsaoTermino: string;

  @ApiProperty()
  orcamentoTotal: number;

  @ApiProperty()
  descricao: string;

  @ApiProperty({ enum: ProjectStatus })
  status: ProjectStatus;

  @ApiProperty({ enum: ProjectRisk })
  risco: ProjectRisk;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
