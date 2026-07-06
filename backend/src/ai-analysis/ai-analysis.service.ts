import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { AI_CLIENT } from './ai-client.interface';
import type { AiClient } from './ai-client.interface';
import { AiAnalysisResponseDto } from './dto/ai-analysis-response.dto';
import { ProjectAnalysisPromptBuilder } from './project-analysis-prompt-builder';

@Injectable()
export class AiAnalysisService {
  constructor(
    @Inject(forwardRef(() => ProjectsService))
    private readonly projectsService: ProjectsService,
    @Inject(AI_CLIENT)
    private readonly aiClient: AiClient,
    private readonly promptBuilder: ProjectAnalysisPromptBuilder,
  ) {}

  async analyze(projectId: string): Promise<AiAnalysisResponseDto> {
    const project = this.projectsService.findOne(projectId);
    const prompt = this.promptBuilder.build(project);

    return this.aiClient.analyze(prompt);
  }
}
