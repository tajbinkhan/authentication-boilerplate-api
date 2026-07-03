import { z } from 'zod';

import { createApiResponseSchema } from '../../../core/validators/api-response.schema';
import { baseQuerySchema, type SortableField } from '../../../core/validators/base-query.schema';
import {
	validateArray,
	validateBoolean,
	validateDate,
	validateEnum,
	validateNumber,
	validateString,
	validateUUID,
} from '../../../core/validators/common.schema';

export const sessionStatusValues = ['active', 'revoked', 'expired'] as const;
const SESSION_SORTABLE_FIELDS: readonly SortableField[] = [
	{ name: 'deviceName', queryName: 'deviceName' },
	{ name: 'deviceType', queryName: 'deviceType' },
	{ name: 'ipAddress', queryName: 'ipAddress' },
	{ name: 'userAgent', queryName: 'userAgent' },
	{ name: 'status', queryName: 'status' },
	{ name: 'createdAt', queryName: 'createdAt' },
	{ name: 'expiresAt', queryName: 'expiresAt' },
] as const;

export const sessionListQuerySchema = baseQuerySchema(SESSION_SORTABLE_FIELDS).safeExtend({
	status: validateString('Status').transform(value => {
		if (!value.trim()) return [];
		return value.split(',').map(item => validateEnum('Status', sessionStatusValues).parse(item.trim()));
	}).optional(),
	deviceType: validateString('Device Type').transform(value =>
		value.trim() ? value.split(',').map(item => item.trim()).filter(Boolean) : [],
	).optional(),
});

export const sessionResponseSchema = z.object({
	id: validateUUID('Session ID'),
	deviceName: validateString('Device Name'),
	deviceType: validateString('Device Type'),
	ipAddress: validateString('IP Address'),
	userAgent: validateString('User Agent'),
	status: validateEnum('Status', sessionStatusValues),
	isCurrent: validateBoolean('Is Current'),
	isRevoked: validateBoolean('Is Revoked'),
	twoFactorVerified: validateBoolean('Two-Factor Verified'),
	createdAt: validateDate('Created At'),
	updatedAt: validateDate('Updated At'),
	expiresAt: validateDate('Expires At'),
});

const sessionListResponseSchema = z.object({
	rows: validateArray('Sessions', sessionResponseSchema),
	total: validateNumber('Total', { min: 0, int: true }),
	page: validateNumber('Page', { min: 1, int: true }),
	pageSize: validateNumber('Page Size', { min: 1, int: true }),
	activeOtherSessionCount: validateNumber('Active Other Session Count', { min: 0, int: true }),
});
const revokedSessionsResponseSchema = z.object({
	revokedCount: validateNumber('Revoked Count', { min: 0, int: true }),
});

export const sessionApiResponseSchema = createApiResponseSchema(sessionResponseSchema);
export const sessionListApiResponseSchema = createApiResponseSchema(sessionListResponseSchema);
export const revokedSessionsApiResponseSchema = createApiResponseSchema(revokedSessionsResponseSchema);

export type SessionListQueryDto = z.infer<typeof sessionListQuerySchema>;
export type SessionResponse = z.infer<typeof sessionResponseSchema>;
export type SessionListResponse = z.infer<typeof sessionListResponseSchema>;
