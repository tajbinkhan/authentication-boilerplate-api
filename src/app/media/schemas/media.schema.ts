import { z } from 'zod';

import { createApiResponseSchema } from '../../../core/validators/api-response.schema';
import { baseQuerySchema, type SortableField } from '../../../core/validators/base-query.schema';
import {
	validateArray,
	validateBoolean,
	validateDate,
	validateNumber,
	validateString,
	validateUUID,
} from '../../../core/validators/common.schema';

export const mediaSchema = z.object({
	name: validateString('Media Name'),
	altText: validateString('Media Alt Text'),
}).strict();

export const MEDIA_SORTABLE_FIELDS: readonly SortableField[] = [
	{ name: 'filename', queryName: 'filename' },
	{ name: 'fileSize', queryName: 'fileSize' },
	{ name: 'createdAt', queryName: 'createdAt' },
	{ name: 'updatedAt', queryName: 'updatedAt' },
] as const;

export const mediaListQuerySchema = baseQuerySchema(MEDIA_SORTABLE_FIELDS).safeExtend({
	mediaType: validateString('Media Type').optional(),
});

export const mediaResponseSchema = z.object({
	publicId: validateUUID('Media ID'),
	filename: validateString('Filename'),
	mimeType: validateString('MIME Type'),
	fileSize: validateNumber('File Size', { min: 0, int: true }),
	secureUrl: validateString('Secure URL').nullable(),
	mediaType: validateString('Media Type'),
	altText: validateString('Alt Text').nullable(),
	width: validateNumber('Width', { min: 0, int: true }).nullable(),
	height: validateNumber('Height', { min: 0, int: true }).nullable(),
	tags: validateArray('Tags', validateString('Tag')).nullable(),
	createdAt: validateDate('Created At'),
	updatedAt: validateDate('Updated At'),
});

const booleanResponseSchema = createApiResponseSchema(validateBoolean('Result'));
export const mediaMutationApiResponseSchema = booleanResponseSchema;
export const mediaListApiResponseSchema = createApiResponseSchema(validateArray('Media', mediaResponseSchema));

export type MediaDto = z.infer<typeof mediaSchema>;
export type MediaListQueryDto = z.infer<typeof mediaListQuerySchema>;
export type MediaResponseType = z.infer<typeof mediaResponseSchema>;
