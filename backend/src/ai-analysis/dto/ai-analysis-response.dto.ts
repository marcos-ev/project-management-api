import { ApiProperty } from '@nestjs/swagger';

export class AiAnalysisResponseDto {
  @ApiProperty({
    example:
      'O projeto "Migracao de infraestrutura para nuvem" esta em andamento com risco medio.',
  })
  resumo: string;

  @ApiProperty({
    type: [String],
    example: [
      'Prazo restante inferior a 30 dias',
      'Orcamento acima de R$ 500.000',
    ],
  })
  pontosDeAtencao: string[];

  @ApiProperty({
    example:
      'Recomenda-se acompanhamento semanal do cronograma junto ao time executor.',
  })
  recomendacaoExecutiva: string;
}
