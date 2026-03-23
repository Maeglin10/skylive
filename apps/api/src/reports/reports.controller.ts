import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportStatus } from '@prisma/client';

@Controller()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('reports')
  createReport(@CurrentUser() user: { id: string }, @Body() dto: CreateReportDto) {
    return this.reportsService.createReport(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/reports')
  listReports(
    @CurrentUser() user: { id: string; role: string },
    @Query('status') status?: ReportStatus,
  ) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }
    return this.reportsService.listReports(status);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/reports/:id')
  updateReport(
    @CurrentUser() user: { id: string; role: string },
    @Param('id') id: string,
    @Body() dto: UpdateReportDto,
  ) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }
    return this.reportsService.updateReportStatus(id, dto.status);
  }
}
