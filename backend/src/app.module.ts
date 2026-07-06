import { Module } from '@nestjs/common';
import { AiAnalysisModule } from './ai-analysis/ai-analysis.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [ProjectsModule, AiAnalysisModule],
})
export class AppModule {}
