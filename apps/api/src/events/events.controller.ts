import { Controller, ForbiddenException, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { EventsService } from './events.service';

@Controller('admin/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  list(
    @CurrentUser() user: { id: string; role: string },
    @Query('type') type?: string,
    @Query('limit') limit?: string,
  ) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }
    const parsedLimit = limit ? Number(limit) : undefined;
    return this.eventsService.list(type, parsedLimit);
  }
}
