import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ApiThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const userId = req.user?.id || req.user?.sub;
    return userId ? `user:${userId}` : `ip:${req.ip}`;
  }

  protected generateKey(context: ExecutionContext, suffix: string): string {
    const req = context.switchToHttp().getRequest<Record<string, any>>();
    const path = req.route?.path || req.originalUrl || 'unknown';
    return `${this.getTracker(req)}:${path}:${suffix}`;
  }
}
