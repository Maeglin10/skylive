import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('content')
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateContentDto) {
    return this.contentService.create(user.id, dto);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('content/:id')
  getById(@CurrentUser() user: { id: string } | null, @Param('id') id: string) {
    return this.contentService.getById(user?.id ?? null, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('content/:id')
  update(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdateContentDto,
  ) {
    return this.contentService.update(user.id, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('content/:id')
  remove(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.contentService.remove(user.id, id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('feed')
  feed(
    @CurrentUser() user: { id: string } | null,
    @Query() pagination: PaginationDto,
  ) {
    return this.contentService.getFeed(user?.id ?? null, pagination);
  }

  @Get('creators/:username/content')
  @UseGuards(OptionalJwtAuthGuard)
  getCreatorContent(
    @CurrentUser() user: { id: string } | null,
    @Param('username') username: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.contentService.getCreatorContent(user?.id ?? null, username, pagination);
  }
}
