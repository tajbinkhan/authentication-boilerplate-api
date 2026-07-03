import { z } from 'zod';

import { createApiResponseSchema } from '../../../core/validators/api-response.schema';
import { baseQuerySchema, type SortableField } from '../../../core/validators/base-query.schema';
import {
	validateArray,
	validateBoolean,
	validateEmail,
	validateEnum,
	validateNumber,
	validateString,
	validateUUID,
} from '../../../core/validators/common.schema';

const EMAIL_LOG_SORTABLE_FIELDS: readonly SortableField[] = [
	{ name: 'toEmail', queryName: 'toEmail' },
	{ name: 'status', queryName: 'status' },
	{ name: 'templateKey', queryName: 'templateKey' },
	{ name: 'createdAt', queryName: 'createdAt' },
] as const;

export const emailLogsListQuerySchema = baseQuerySchema(EMAIL_LOG_SORTABLE_FIELDS).safeExtend({
	providerId: validateString('Provider ID', { max: 100 }).optional(),
	toEmail: validateString('To Email', { max: 255 }).optional(),
	status: validateString('Status', { max: 20 }).optional(),
	templateKey: validateString('Template Key', { max: 100 }).optional(),
});

export const emailLogResponseSchema = z.object({
	id: validateUUID('Email Log ID'),
	smtpProviderId: validateString('SMTP Provider ID').nullable(),
	toEmail: validateEmail,
	toName: validateString('Recipient Name').nullable(),
	subject: validateString('Subject'),
	templateKey: validateString('Template Key').nullable(),
	status: validateEnum('Status', ['sent', 'failed']),
	errorMessage: validateString('Error Message').nullable(),
	metadata: z.record(z.string(), z.unknown()),
	createdAt: validateString('Created At'),
	updatedAt: validateString('Updated At'),
});

const emailLogListResponseSchema = z.object({
	rows: validateArray('Email Logs', emailLogResponseSchema),
	total: validateNumber('Total', { min: 0, int: true }),
	page: validateNumber('Page', { min: 1, int: true }),
	pageSize: validateNumber('Page Size', { min: 1, int: true }),
});

const deletedEmailLogResponseSchema = z.object({ deleted: validateBoolean('Deleted') });

export const emailLogApiResponseSchema = createApiResponseSchema(emailLogResponseSchema);
export const emailLogListApiResponseSchema = createApiResponseSchema(emailLogListResponseSchema);
export const deletedEmailLogApiResponseSchema = createApiResponseSchema(deletedEmailLogResponseSchema);

export type EmailLogsListQueryDto = z.infer<typeof emailLogsListQuerySchema>;
export type EmailLogResponse = z.infer<typeof emailLogResponseSchema>;
export type EmailLogListResponse = z.infer<typeof emailLogListResponseSchema>;
