import { forwardRef, Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { AI_CLIENT } from './ai-client.interface';
import { AiAnalysisService } from './ai-analysis.service';
import { MockAiClient } from './mock-ai-client';
import { ProjectAnalysisPromptBuilder } from './project-analysis-prompt-builder';

@Module({
  imports: [forwardRef(() => ProjectsModule)],
  providers: [
    AiAnalysisService,
    ProjectAnalysisPromptBuilder,
    {
      provide: AI_CLIENT,
      useClass: MockAiClient,
    },
  ],
  exports: [AiAnalysisService],
})
export class AiAnalysisModule {}
