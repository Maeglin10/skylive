import { Injectable, OnModuleInit } from '@nestjs/common';
import { collectDefaultMetrics, Gauge, Registry } from 'prom-client';

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
}
