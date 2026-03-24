import { Injectable, OnModuleInit } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Gauge, Histogram, Registry } from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly registry = new Registry();
  private initialized = false;

  private readonly appInfo = new Gauge({
    name: 'skylive_app_info',
    help: 'Skylive application info',
    labelNames: ['version'],
    registers: [this.registry],
  });

  private readonly httpRequests = new Counter({
    name: 'skylive_http_requests_total',
    help: 'HTTP request count',
    labelNames: ['method', 'route', 'status'],
    registers: [this.registry],
  });

  private readonly httpDuration = new Histogram({
    name: 'skylive_http_request_duration_ms',
    help: 'HTTP request duration in milliseconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2000],
    registers: [this.registry],
  });

  onModuleInit() {
    if (this.initialized) return;
    collectDefaultMetrics({ register: this.registry });
    this.appInfo.labels(process.env.APP_VERSION || 'dev').set(1);
    this.initialized = true;
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }

  recordHttp(method: string, route: string, status: number, durationMs: number) {
    const labels = { method, route, status: String(status) };
    this.httpRequests.inc(labels);
    this.httpDuration.observe(labels, durationMs);
  }
}
