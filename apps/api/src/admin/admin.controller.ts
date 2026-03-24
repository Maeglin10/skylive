import { Body, Controller, ForbiddenException, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AdminService } from './admin.service';
import { UpdateContentModerationDto } from './dto/update-content-moderation.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats(@CurrentUser() user: { id: string; role: string }) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }
    return this.adminService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('content/:id/moderation')
  updateContentModeration(
    @CurrentUser() user: { id: string; role: string },
    @Param('id') id: string,
    @Body() dto: UpdateContentModerationDto,
  ) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }
    return this.adminService.updateContentModeration(id, dto);
  }
}
