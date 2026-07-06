import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Migracao de infraestrutura para nuvem' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    example: '2026-01-15',
    description: 'Data no formato ISO (YYYY-MM-DD)',
  })
  @IsDateString()
  dataInicio: string;

  @ApiProperty({
    example: '2026-07-15',
    description: 'Data no formato ISO (YYYY-MM-DD)',
  })
  @IsDateString()
  previsaoTermino: string;

  @ApiProperty({ example: 250000 })
  @IsNumber()
  @IsPositive()
  orcamentoTotal: number;

  @ApiProperty({
    example: 'Projeto de migracao dos servidores on-premise para AWS',
  })
  @IsString()
  @IsNotEmpty()
  descricao: string;
}
