import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE, DiscoveryModule } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigurableThrottlerGuard } from './common/guards/configurable-throttler.guard';
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe';
import { CryptoModule } from './core/crypto/crypto.module';
import { DatabaseModule } from './core/database/database.module';
import { SecurityStoreModule } from './core/security-store/security-store.module';
import { validateEnv } from './core/validators/env';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { AuthModule } from './modules/auth/auth.module';
import { CsrfModule } from './modules/csrf/csrf.module';
import { HealthModule } from './modules/health/health.module';
import { MediaModule } from './modules/media/media.module';
import { SmtpModule } from './modules/smtp/smtp.module';
import { StatusModule } from './modules/status/status.module';
import { SystemModule } from './modules/system/system.module';
import { UsersModule } from './modules/users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: validateEnv,
		}),
		// ThrottlerModule is kept for @Throttle() and @SkipThrottle() decorator metadata.
		// The actual rate limiting logic is handled by ConfigurableThrottlerGuard using
		// the configurable security store (memory/postgres/redis).
		ThrottlerModule.forRoot([
			{
				name: 'short',
				ttl: 1000,
				limit: 10,
			},
			{
				name: 'long',
				ttl: 60000,
				limit: 100,
			},
		]),
		DiscoveryModule,
		CryptoModule,
		CsrfModule,
		DatabaseModule,
		SecurityStoreModule.forRoot(),
		AuditLogModule,
		AuthModule,
		MediaModule,
		UsersModule,
		SystemModule,
		SmtpModule,
		HealthModule,
		StatusModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ConfigurableThrottlerGuard,
		},
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},
	],
})
export class AppModule {}
