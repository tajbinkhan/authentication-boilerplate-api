import { z } from 'zod';

import { createApiResponseSchema } from '../../../core/validators/api-response.schema';
import {
	validateArray,
	validateBoolean,
	validateDate,
	validateEnum,
	validateNumber,
	validateString,
	validateUUID,
} from '../../../core/validators/common.schema';

export const updateEmailTemplateSchema = z
	.object({
		subject: validateString('Subject').optional(),
		html: validateString('HTML').optional(),
		text: validateString('Text').optional(),
		isActive: z.boolean().optional(),
	})
	.strict()
	.refine(data => Object.keys(data).length > 0, {
		message: 'At least one field must be provided',
	});

export type UpdateEmailTemplateDto = z.infer<typeof updateEmailTemplateSchema>;

const templateVariableDescriptorSchema = z.object({
	name: validateString('Variable Name'),
	type: validateEnum('Variable Type', ['string', 'number', 'boolean']),
	required: validateBoolean('Required'),
	description: validateString('Description'),
});

export const emailTemplateResponseSchema = z.object({
	publicId: validateUUID('Email Template ID'),
	key: validateString('Template Key'),
	subject: validateString('Subject'),
	html: z.string(),
	text: z.string().nullable(),
	variables: validateArray('Variables', templateVariableDescriptorSchema),
	version: validateNumber('Version', { min: 1, int: true }),
	isActive: validateBoolean('Is Active'),
	createdAt: validateDate('Created At').transform(value => value.toISOString()),
	updatedAt: validateDate('Updated At').transform(value => value.toISOString()),
});

const emailTemplateListResponseSchema = z.object({
	rows: validateArray('Email Templates', emailTemplateResponseSchema),
	total: validateNumber('Total', { min: 0, int: true }),
	page: validateNumber('Page', { min: 1, int: true }),
	pageSize: validateNumber('Page Size', { min: 1, int: true }),
});

export const emailTemplateApiResponseSchema = createApiResponseSchema(emailTemplateResponseSchema);
export const emailTemplateListApiResponseSchema = createApiResponseSchema(emailTemplateListResponseSchema);

export type EmailTemplateResponse = z.infer<typeof emailTemplateResponseSchema>;
export type EmailTemplateListResponse = z.infer<typeof emailTemplateListResponseSchema>;
