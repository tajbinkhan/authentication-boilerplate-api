import { Inject, Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { sql } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DATABASE_CONNECTION } from '../../database/connection';
import schema from '../../database/schema';

@Injectable()
export class DrizzleHealthIndicator extends HealthIndicator {
	constructor(
		@Inject(DATABASE_CONNECTION)
		private readonly db: NodePgDatabase<typeof schema>,
	) {
		super();
	}

	async pingCheck(key: string): Promise<HealthIndicatorResult> {
		try {
			await this.db.execute(sql`SELECT 1`);
			return this.getStatus(key, true);
		} catch (error: any) {
			throw new HealthCheckError(
				'Database connection failed',
				this.getStatus(key, false, { message: error.message }),
			);
		}
	}
}
