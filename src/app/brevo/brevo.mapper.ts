export interface BrevoRecipient {
	email: string;
	name?: string;
}

export interface BrevoSender {
	email: string;
	name: string;
}

export interface BrevoReplyTo {
	email: string;
	name?: string;
}

export interface BrevoRawEmailDto {
	to: BrevoRecipient[];
	subject: string;
	htmlContent?: string;
	textContent?: string;
	replyTo?: BrevoReplyTo;
	headers?: Record<string, string>;
}

export interface BrevoTemplateEmailDto {
	templateKey: string;
	to: BrevoRecipient[];
	params: Record<string, unknown>;
	replyTo?: BrevoReplyTo;
	headers?: Record<string, string>;
}
