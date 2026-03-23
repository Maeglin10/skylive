import { Module } from '@nestjs/common';
import { LiveService } from './live.service';
import { LiveController } from './live.controller';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [JobsModule],
  providers: [LiveService],
  controllers: [LiveController],
  exports: [LiveService],
})
export class LiveModule {}
