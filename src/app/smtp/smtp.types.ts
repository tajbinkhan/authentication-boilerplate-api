export interface BrevoConfig {
	apiKey: string;
	senderEmail: string;
	senderName: string;
}

export interface ResendConfig {
	apiKey: string;
	senderEmail: string;
	senderName: string;
}

export interface NodemailerConfig {
	host: string;
	port: number;
	secure: boolean;
	auth: {
		user: string;
		pass: string;
	};
	senderEmail: string;
	senderName: string;
}

export interface AwsSesConfig {
	accessKeyId: string;
	secretAccessKey: string;
	region: string;
	senderEmail: string;
	senderName: string;
}
