import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';

import { DrizzleHealthIndicator } from './drizzle-health.indicator';

@SkipThrottle()
@Controller('health')
export class HealthController {
	constructor(
		private readonly health: HealthCheckService,
		private readonly drizzleHealth: DrizzleHealthIndicator,
		private readonly memory: MemoryHealthIndicator,
	) {}

	@Get()
	@HealthCheck()
	check() {
		return this.health.check([
			() => this.drizzleHealth.pingCheck('database'),
			// Heap limit: 150MB
			() => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
			// RSS limit: 300MB
			() => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
		]);
	}
}
