import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

@Injectable()
export class MediaService {
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET || '';
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'eu-west-3',
      credentials: process.env.AWS_ACCESS_KEY_ID
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
          }
        : undefined,
    });
  }

  async upload(file: Express.Multer.File) {
    if (!this.bucket) {
      throw new Error('S3_BUCKET is not configured');
    }

    const key = `${randomUUID()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return { key };
  }

  async getSignedUrl(key: string) {
    if (!this.bucket) {
      throw new Error('S3_BUCKET is not configured');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const ttl = Number(process.env.SIGNED_URL_TTL_SEC ?? 900);
    const url = await getSignedUrl(this.s3, command, { expiresIn: ttl });
    return { url };
  }

  async presignUploadUrl(
    key: string,
    contentType: string,
  ): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
    if (!process.env.AWS_ACCESS_KEY_ID || !this.bucket) {
      return {
        uploadUrl: '/mock-upload',
        key: 'mock-key',
        publicUrl: '/placeholder.jpg',
      };
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const ttl = Number(process.env.SIGNED_URL_TTL_SEC ?? 900);
    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: ttl });

    const publicUrl = `https://${this.bucket}.s3.${process.env.AWS_REGION || 'eu-west-3'}.amazonaws.com/${key}`;

    return { uploadUrl, key, publicUrl };
  }
}
