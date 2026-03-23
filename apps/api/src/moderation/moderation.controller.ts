import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ModerationService } from './moderation.service';
import { BlockUserDto } from './dto/block-user.dto';
import { CreateBanDto } from './dto/create-ban.dto';

@Controller()
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('blocks')
  listBlocks(@CurrentUser() user: { id: string }) {
    return this.moderationService.listBlocks(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('blocks/:userId')
  blockUser(
    @CurrentUser() user: { id: string },
    @Param('userId') blockedUserId: string,
    @Body() dto: BlockUserDto,
  ) {
    return this.moderationService.blockUser(user.id, blockedUserId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('blocks/:userId')
  unblockUser(@CurrentUser() user: { id: string }, @Param('userId') blockedUserId: string) {
    return this.moderationService.unblockUser(user.id, blockedUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/bans')
  listBans(@CurrentUser() user: { id: string; role: string }) {
    if (user.role !== 'ADMIN') throw new ForbiddenException('Admin access required');
    return this.moderationService.listBans();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/bans')
  createBan(@CurrentUser() user: { id: string; role: string }, @Body() dto: CreateBanDto) {
    if (user.role !== 'ADMIN') throw new ForbiddenException('Admin access required');
    return this.moderationService.createBan(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/bans/:id')
  revokeBan(@CurrentUser() user: { id: string; role: string }, @Param('id') id: string) {
    if (user.role !== 'ADMIN') throw new ForbiddenException('Admin access required');
    return this.moderationService.revokeBan(id);
  }
}
