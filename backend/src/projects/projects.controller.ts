import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiAnalysisService } from '../ai-analysis/ai-analysis.service';
import { AiAnalysisResponseDto } from '../ai-analysis/dto/ai-analysis-response.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    @Inject(forwardRef(() => AiAnalysisService))
    private readonly aiAnalysisService: AiAnalysisService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo projeto' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Projeto criado com sucesso',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados invalidos',
  })
  create(@Body() createProjectDto: CreateProjectDto): ProjectResponseDto {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os projetos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de projetos',
    type: [ProjectResponseDto],
  })
  findAll(): ProjectResponseDto[] {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um projeto pelo id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Projeto encontrado',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Projeto nao encontrado',
  })
  findOne(@Param('id') id: string): ProjectResponseDto {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza dados de um projeto (nao altera status)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Projeto atualizado',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Projeto nao encontrado',
  })
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): ProjectResponseDto {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove um projeto' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Projeto removido',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Projeto nao encontrado',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Projeto nao pode ser removido no status atual',
  })
  remove(@Param('id') id: string): void {
    this.projectsService.remove(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualiza o status de um projeto' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status atualizado',
    type: ProjectResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Projeto nao encontrado',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Transicao de status invalida',
  })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ): ProjectResponseDto {
    return this.projectsService.updateStatus(id, updateStatusDto.status);
  }

  @Get(':id/ai-analysis')
  @ApiOperation({ summary: 'Gera uma analise assistida por IA para o projeto' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analise gerada com sucesso',
    type: AiAnalysisResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Projeto nao encontrado',
  })
  getAiAnalysis(@Param('id') id: string): Promise<AiAnalysisResponseDto> {
    return this.aiAnalysisService.analyze(id);
  }
}
