import { z } from 'zod';

import { createApiResponseSchema } from '../../../core/validators/api-response.schema';
import { baseQuerySchema, type SortableField } from '../../../core/validators/base-query.schema';
import {
	validateArray,
	validateBoolean,
	validateEnum,
	validateNumber,
	validateString,
} from '../../../core/validators/common.schema';

export const SMTP_PROVIDER_TYPES = ['brevo', 'resend', 'nodemailer', 'aws-ses'] as const;

const SMTP_SORTABLE_FIELDS: readonly SortableField[] = [
	{ name: 'name', queryName: 'name' },
	{ name: 'providerType', queryName: 'providerType' },
	{ name: 'isDefault', queryName: 'isDefault' },
	{ name: 'isActive', queryName: 'isActive' },
	{ name: 'lastTestStatus', queryName: 'lastTestStatus' },
	{ name: 'createdAt', queryName: 'createdAt' },
	{ name: 'updatedAt', queryName: 'updatedAt' },
] as const;

const providerTypeSchema = validateEnum('Provider Type', SMTP_PROVIDER_TYPES);

const senderSchema = {
	senderEmail: validateString('Sender Email').email('Sender Email must be a valid email'),
	senderName: validateString('Sender Name'),
};

const brevoConfigSchema = z.object({ apiKey: validateString('API Key'), ...senderSchema });
const resendConfigSchema = z.object({ apiKey: validateString('API Key'), ...senderSchema });
const nodemailerConfigSchema = z.object({
	host: validateString('Host'),
	port: validateNumber('Port', { min: 1, positive: true, int: true }),
	secure: z.preprocess(value => {
		if (typeof value === 'boolean') return value;
		if (typeof value === 'string') return value.toLowerCase() === 'true';
		return false;
	}, validateBoolean('Secure')),
	auth: z.object({ user: validateString('Username'), pass: validateString('Password') }),
	...senderSchema,
});
const awsSesConfigSchema = z.object({
	accessKeyId: validateString('Access Key ID'),
	secretAccessKey: validateString('Secret Access Key'),
	region: validateString('Region'),
	...senderSchema,
});

const configByTypeSchema: Record<string, z.ZodType> = {
	brevo: brevoConfigSchema,
	resend: resendConfigSchema,
	nodemailer: nodemailerConfigSchema,
	'aws-ses': awsSesConfigSchema,
};

export const createSmtpProviderSchema = z.object({
	name: validateString('Name', { max: 100 }),
	providerType: providerTypeSchema,
	config: z.unknown(),
}).strict().superRefine((data, context) => {
	const configSchema = configByTypeSchema[data.providerType];
	const result = configSchema.safeParse(data.config);
	if (result.success) return;

	for (const issue of result.error.issues) {
		context.addIssue({ ...issue, path: ['config', ...issue.path] });
	}
});

export const updateSmtpProviderSchema = z.object({
	name: validateString('Name', { max: 100 }).optional(),
	config: z.unknown().optional(),
}).strict().refine(data => Object.keys(data).length > 0, {
	message: 'At least one field must be provided',
});

export const smtpProvidersListQuerySchema = baseQuerySchema(SMTP_SORTABLE_FIELDS).safeExtend({
	providerType: providerTypeSchema.optional(),
	isActive: z.preprocess(value => {
		if (typeof value !== 'string') return undefined;
		const normalized = value.trim().toLowerCase();
		return normalized === 'true' ? true : normalized === 'false' ? false : undefined;
	}, validateBoolean('Is Active').optional()),
});

export const smtpProviderResponseSchema = z.object({
	id: validateString('SMTP Provider ID'),
	name: validateString('Name'),
	providerType: providerTypeSchema,
	config: z.record(z.string(), z.unknown()),
	isDefault: validateBoolean('Is Default'),
	isActive: validateBoolean('Is Active'),
	lastTestedAt: validateString('Last Tested At').nullable(),
	lastTestStatus: validateString('Last Test Status').nullable(),
	createdAt: validateString('Created At'),
	updatedAt: validateString('Updated At'),
});

const smtpProviderListResponseSchema = z.object({
	rows: validateArray('SMTP Providers', smtpProviderResponseSchema),
	total: validateNumber('Total', { min: 0, int: true }),
	page: validateNumber('Page', { min: 1, int: true }),
	pageSize: validateNumber('Page Size', { min: 1, int: true }),
});
const testConnectionResponseSchema = z.object({
	success: validateBoolean('Success'),
	message: validateString('Message'),
});
const deletedSmtpProviderResponseSchema = z.object({ deleted: validateBoolean('Deleted') });

export const smtpProviderApiResponseSchema = createApiResponseSchema(smtpProviderResponseSchema);
export const smtpProviderListApiResponseSchema = createApiResponseSchema(smtpProviderListResponseSchema);
export const testConnectionApiResponseSchema = createApiResponseSchema(testConnectionResponseSchema);
export const deletedSmtpProviderApiResponseSchema = createApiResponseSchema(deletedSmtpProviderResponseSchema);

export type CreateSmtpProviderDto = z.infer<typeof createSmtpProviderSchema>;
export type UpdateSmtpProviderDto = z.infer<typeof updateSmtpProviderSchema>;
export type SmtpProvidersListQueryDto = z.infer<typeof smtpProvidersListQuerySchema>;
export type SmtpProviderResponse = z.infer<typeof smtpProviderResponseSchema>;
export type SmtpProviderListResponse = z.infer<typeof smtpProviderListResponseSchema>;
export type TestConnectionResponse = z.infer<typeof testConnectionResponseSchema>;
