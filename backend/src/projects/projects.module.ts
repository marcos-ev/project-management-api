import { forwardRef, Module } from '@nestjs/common';
import { AiAnalysisModule } from '../ai-analysis/ai-analysis.module';
import { InMemoryProjectsRepository } from './in-memory-projects.repository';
import { PROJECTS_REPOSITORY } from './projects.repository';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { RiskCalculatorService } from './risk-calculator.service';
import { StatusTransitionService } from './status-transition.service';

@Module({
  imports: [forwardRef(() => AiAnalysisModule)],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    RiskCalculatorService,
    StatusTransitionService,
    {
      provide: PROJECTS_REPOSITORY,
      useClass: InMemoryProjectsRepository,
    },
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
