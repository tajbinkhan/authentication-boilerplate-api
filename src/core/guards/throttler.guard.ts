import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
	protected override async getTracker(req: Record<string, any>): Promise<string> {
		const rawIp =
			req.headers['x-forwarded-for'] ||
			req.headers['x-real-ip'] ||
			req.ip ||
			req.connection?.remoteAddress ||
			'';
		const ip = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : String(rawIp);
		// Avoid lint errors (require-await) by awaiting a Promise resolution
		return await Promise.resolve(ip);
	}
}
