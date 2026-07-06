import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ProjectStatus } from '../enums/project-status.enum';

export class UpdateStatusDto {
  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.APROVADO })
  @IsEnum(ProjectStatus)
  status: ProjectStatus;
}
