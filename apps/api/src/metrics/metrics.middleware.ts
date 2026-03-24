import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly metricsService: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/api/metrics' || req.path === '/metrics') {
      return next();
    }

    const start = process.hrtime.bigint();
    res.on('finish', () => {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1_000_000;
      const route = req.route?.path || req.path || 'unknown';
      this.metricsService.recordHttp(req.method, route, res.statusCode, durationMs);
    });

    next();
  }
}
