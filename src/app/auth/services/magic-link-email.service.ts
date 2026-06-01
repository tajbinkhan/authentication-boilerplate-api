import { Injectable } from '@nestjs/common';

import { badGatewayError } from '../../../core/errors/domain-error';
import { magicLinkTimeout } from '../../../common/helpers/constant.helper';
import { TEMPLATE_KEYS } from '../../email-template/email-template.registry';
import { EmailDispatcherService } from '../../smtp/email-dispatcher.service';

interface SendMagicLinkEmailParams {
	email: string;
	verificationUrl: string;
	redirectUrl: string;
}

const minuteMs = 1000 * 60;

@Injectable()
export class MagicLinkEmailService {
	constructor(private readonly emailDispatcher: EmailDispatcherService) {}

	async sendMagicLinkEmail(params: SendMagicLinkEmailParams): Promise<void> {
		try {
			await this.emailDispatcher.sendFromTemplate({
				templateKey: TEMPLATE_KEYS.AUTH_MAGIC_LINK,
				to: [{ email: params.email }],
				params: {
					verificationUrl: params.verificationUrl,
					redirectUrl: params.redirectUrl,
					expiresInMinutes: Math.floor(magicLinkTimeout / minuteMs),
					year: new Date().getFullYear(),
				},
			});
		} catch {
			throw badGatewayError('magic_link_email_failed', 'Failed to send magic link email');
		}
	}
}
