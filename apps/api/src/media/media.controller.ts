import { BadRequestException, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MediaService } from './media.service';
import { ContentService } from '../content/content.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly contentService: ContentService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.upload(file);
  }

  @Get('content/:contentId/signed-url')
  async signedUrl(
    @CurrentUser() user: { id: string },
    @Param('contentId') contentId: string,
  ) {
    const content = await this.contentService.getById(user.id, contentId);
    if (!content.mediaKey) {
      throw new BadRequestException('Content does not have a media key');
    }
    return this.mediaService.getSignedUrl(content.mediaKey);
  }
}
