import { BadRequestException, Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MediaService } from './media.service';
import { ContentService } from '../content/content.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Throttle } from '@nestjs/throttler';
import { PresignDto } from './presign.dto';
import { randomUUID } from 'crypto';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly contentService: ContentService,
  ) {}

  @Post('upload')
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: Number(process.env.MEDIA_MAX_SIZE_MB ?? 50) * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowed = ['image/', 'video/'];
        if (allowed.some((prefix) => file.mimetype.startsWith(prefix))) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Unsupported file type'), false);
        }
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.upload(file);
  }

  @Post('presign')
  async presign(@Body() dto: PresignDto) {
    const folder = dto.folder || 'uploads';
    const key = `${folder}/${randomUUID()}-${dto.fileName}`;
    return this.mediaService.presignUploadUrl(key, dto.contentType);
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
