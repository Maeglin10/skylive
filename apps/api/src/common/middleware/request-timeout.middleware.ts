import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestTimeoutMiddleware implements NestMiddleware {
  use(_req: Request, res: Response, next: NextFunction) {
    const timeoutMs = Number(process.env.REQUEST_TIMEOUT_MS ?? 15000);

    res.setTimeout(timeoutMs, () => {
      if (!res.headersSent) {
        res.status(504).json({
          code: 'REQUEST_TIMEOUT',
          error: 'Request timed out',
        });
      }
    });

    next();
  }
}
