import { Injectable, Logger } from '@nestjs/common';

import { TEMPLATE_KEYS } from '../../email-template/email-template.registry';
import { EmailDispatcherService } from '../../smtp/email-dispatcher.service';

interface SendWelcomeEmailParams {
	email: string;
	name?: string | null;
}

@Injectable()
export class WelcomeEmailService {
	private readonly logger = new Logger(WelcomeEmailService.name);

	constructor(private readonly emailDispatcher: EmailDispatcherService) {}

	async sendWelcomeEmail(params: SendWelcomeEmailParams): Promise<void> {
		try {
			await this.emailDispatcher.sendFromTemplate({
				templateKey: TEMPLATE_KEYS.AUTH_WELCOME,
				to: [{ email: params.email, name: params.name ?? undefined }],
				params: {
					name: params.name ?? 'there',
					email: params.email,
					year: new Date().getFullYear(),
				},
			});
		} catch (error) {
			this.logger.warn(`Failed to send welcome email: ${this.getErrorMessage(error)}`);
		}
	}

	private getErrorMessage(error: unknown): string {
		return error instanceof Error ? error.message : 'Unknown error';
	}
}
