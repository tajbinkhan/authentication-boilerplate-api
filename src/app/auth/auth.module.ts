import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { sessionTimeout } from '../../core/helpers/constant.helpers';
import { EnvType } from '../../core/validators/env';
import { BrevoModule } from '../brevo/brevo.module';
import { AuthController } from './auth.controller';
import { AUTH_CLOUDINARY_SERVICE, authCloudinaryProvider } from './auth.providers';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { AuthSessionRepository } from './auth-session.repository';
import { AuthSession } from './auth.session';
import { MagicLinkEmailService } from './services/magic-link-email.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	imports: [
		PassportModule,
		BrevoModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService<EnvType>) => ({
				secret: configService.get('AUTH_SECRET', { infer: true }),
				signOptions: { expiresIn: sessionTimeout / 1000 }, // Convert ms to seconds
			}),
		}),
	],
	providers: [
		AuthService,
		AuthRepository,
		JwtStrategy,
		AuthSession,
		AuthSessionRepository,
		MagicLinkEmailService,
		authCloudinaryProvider,
	],
	controllers: [AuthController],
	exports: [AuthService, AUTH_CLOUDINARY_SERVICE],
})
export class AuthModule {}
