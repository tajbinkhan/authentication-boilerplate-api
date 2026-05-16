import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { badGatewayError } from '../../core/errors/domain-error';
import type { EnvType } from '../../core/validators/env';
import { TemplateService } from '../template/template.service';
import {
	buildBrevoEmailPayload,
	buildBrevoHttpHeaders,
	type BrevoEmailPayload,
	type BrevoRawEmailDto,
	type BrevoSender,
	type BrevoTemplateEmailDto,
} from './brevo.mapper';

const brevoTransactionalEmailUrl = 'https://api.brevo.com/v3/smtp/email';
const brevoRequestTimeoutMs = 10000;

@Injectable()
export class BrevoService {
	constructor(
		private readonly templates: TemplateService,
		private readonly configService: ConfigService<EnvType, true>,
	) {}

	async sendEmail(params: BrevoRawEmailDto): Promise<void> {
		await this.postEmail(buildBrevoEmailPayload(params, this.getSender()));
	}

	async sendFromTemplate(params: BrevoTemplateEmailDto): Promise<void> {
		const rendered = await this.templates.render(params.templateKey, params.params);

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

	private async postEmail(payload: BrevoEmailPayload): Promise<void> {
		try {
			await axios.post(brevoTransactionalEmailUrl, payload, {
				headers: buildBrevoHttpHeaders(
					this.configService.get('BREVO_API_KEY', { infer: true }),
				),
				timeout: brevoRequestTimeoutMs,
			});
		} catch {
			throw badGatewayError('brevo_email_failed', 'Failed to send email');
		}
	}
}
