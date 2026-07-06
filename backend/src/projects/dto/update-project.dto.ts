import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'Migracao de infraestrutura para nuvem' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nome?: string;

  @ApiPropertyOptional({
    example: '2026-01-15',
    description: 'Data no formato ISO (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiPropertyOptional({
    example: '2026-07-15',
    description: 'Data no formato ISO (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  previsaoTermino?: string;

  @ApiPropertyOptional({ example: 250000 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  orcamentoTotal?: number;

  @ApiPropertyOptional({
    example: 'Projeto de migracao dos servidores on-premise para AWS',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  descricao?: string;
}
