import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreatorsService } from './creators.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OnboardCreatorDto } from './dto/onboard-creator.dto';
import { UpdateCreatorDto } from './dto/update-creator.dto';

@Controller('creators')
export class CreatorsController {
  constructor(private readonly creatorsService: CreatorsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('onboard')
  onboard(@CurrentUser() user: { id: string }, @Body() dto: OnboardCreatorDto) {
    return this.creatorsService.onboard(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/stats')
  getStats(@CurrentUser() user: { id: string }) {
    return this.creatorsService.getStats(user.id);
  }

  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.creatorsService.getByUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@CurrentUser() user: { id: string }, @Body() dto: UpdateCreatorDto) {
    return this.creatorsService.updateProfile(user.id, dto);
  }
}
