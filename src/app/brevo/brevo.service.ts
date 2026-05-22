import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrevoClient } from '@getbrevo/brevo';

import { badGatewayError } from '../../core/errors/domain-error';
import type { EnvType } from '../../core/validators/env';
import { TemplateService } from '../template/template.service';
import {
	type BrevoRawEmailDto,
	type BrevoSender,
	type BrevoTemplateEmailDto,
} from './brevo.mapper';

@Injectable()
export class BrevoService implements OnModuleInit {
	private readonly logger = new Logger(BrevoService.name);
	private client!: BrevoClient;

	constructor(
		private readonly templates: TemplateService,
		private readonly configService: ConfigService<EnvType, true>,
	) {}

	onModuleInit(): void {
		if (this.configService.get('BREVO_ENABLED', { infer: true }) === 'true') {
			this.client = new BrevoClient({
				apiKey: this.configService.get('BREVO_API_KEY', { infer: true }),
			});
		}
	}

	async sendEmail(params: BrevoRawEmailDto): Promise<void> {
		if (this.configService.get('BREVO_ENABLED', { infer: true }) !== 'true') {
			this.logger.log(
				`[Brevo Disabled] Email to: ${JSON.stringify(params.to)}\nSubject: ${params.subject}\nContent:\n${params.htmlContent || params.textContent}`,
			);
			return;
		}

		const sender = this.getSender();

		try {
			await this.client.transactionalEmails.sendTransacEmail({
				sender,
				to: params.to,
				subject: params.subject,
				htmlContent: params.htmlContent,
				textContent: params.textContent,
				replyTo: params.replyTo,
				headers: params.headers,
			});
		} catch {
			throw badGatewayError('brevo_email_failed', 'Failed to send email');
		}
	}

	async sendFromTemplate(params: BrevoTemplateEmailDto): Promise<void> {
		const rendered = await this.templates.render(params.templateKey, params.params);

		if (this.configService.get('BREVO_ENABLED', { infer: true }) !== 'true') {
			this.logger.log(
				`[Brevo Disabled] Email (Template: ${params.templateKey}) to: ${JSON.stringify(params.to)}\nSubject: ${rendered.subject}\nHTML Content:\n${rendered.html}`,
			);
			return;
		}

		await this.sendEmail({
			to: params.to,
			subject: rendered.subject,
			htmlContent: rendered.html,
			textContent: rendered.text,
			replyTo: params.replyTo,
			headers: {
				...params.headers,
				'X-Template-Version': String(rendered.version),
			},
		});
	}

	private getSender(): BrevoSender {
		return {
			email: this.configService.get('BREVO_SENDER_EMAIL', { infer: true }),
			name: this.configService.get('BREVO_SENDER_NAME', { infer: true }),
		};
	}
}
