import { Body, Controller, ForbiddenException, Get, Headers, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { LiveService } from './live.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateLiveSessionDto } from './dto/create-live-session.dto';

@Controller('live')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  @UseGuards(JwtAuthGuard)
  @Post('sessions')
  createSession(@CurrentUser() user: { id: string }, @Body() dto: CreateLiveSessionDto) {
    return this.liveService.createSession(user.id, dto);
  }

  @Get('sessions')
  listSessions(@Query('status') status?: string) {
    return this.liveService.listSessions(status);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('sessions/:id')
  getSession(@CurrentUser() user: { id: string } | null, @Param('id') id: string) {
    return this.liveService.getSession(user?.id ?? null, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('sessions/:id/start')
  start(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.liveService.startSession(user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('sessions/:id/end')
  end(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.liveService.endSession(user.id, id);
  }

  @Post('webhook/stream-start')
  @SkipThrottle()
  streamStart(
    @Body() body: { name: string },
    @Query('token') token?: string,
    @Headers('x-stream-secret') headerSecret?: string,
  ) {
    this.assertWebhookSecret(token, headerSecret);
    return this.liveService.handleStreamStart(body.name);
  }

  @Post('webhook/stream-end')
  @SkipThrottle()
  streamEnd(
    @Body() body: { name: string },
    @Query('token') token?: string,
    @Headers('x-stream-secret') headerSecret?: string,
  ) {
    this.assertWebhookSecret(token, headerSecret);
    return this.liveService.handleStreamEnd(body.name);
  }

  private assertWebhookSecret(token?: string, headerSecret?: string) {
    const expected = process.env.STREAM_WEBHOOK_SECRET;
    if (!expected) return;
    const provided = headerSecret || token;
    if (!provided || provided !== expected) {
      throw new ForbiddenException('Invalid stream webhook secret');
    }
  }
}
