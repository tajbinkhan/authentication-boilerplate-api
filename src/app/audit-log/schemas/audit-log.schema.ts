import { z } from 'zod';

import { roleTypeEnum } from '../../../core/database/schema/enum.schema';
import { createApiResponseSchema } from '../../../core/validators/api-response.schema';
import { baseQuerySchema, type SortableField } from '../../../core/validators/base-query.schema';
import {
	validateArray,
	validateDate,
	validateEmail,
	validateEnum,
	validateNumber,
	validateString,
	validateUUID,
} from '../../../core/validators/common.schema';

const AUDIT_LOG_SORTABLE_FIELDS: readonly SortableField[] = [
	{ name: 'action', queryName: 'action' },
	{ name: 'actorRole', queryName: 'actorRole' },
	{ name: 'targetType', queryName: 'targetType' },
	{ name: 'targetId', queryName: 'targetId' },
	{ name: 'createdAt', queryName: 'createdAt' },
	{ name: 'updatedAt', queryName: 'updatedAt' },
] as const;

export const auditLogListQuerySchema = baseQuerySchema(AUDIT_LOG_SORTABLE_FIELDS).safeExtend({
	actorId: validateUUID('Actor ID').optional(),
	actor: validateString('Actor', { max: 255 }).optional(),
	action: validateString('Action', { max: 100 }).optional(),
	targetType: validateString('Target Type', { max: 50 }).optional(),
});

export const auditLogResponseSchema = z.object({
	id: validateUUID('Audit Log ID'),
	actorId: validateUUID('Actor ID').nullable(),
	actorRole: validateEnum('Actor Role', roleTypeEnum.enumValues).nullable(),
	actorName: validateString('Actor Name').nullable(),
	actorEmail: validateEmail.nullable(),
	action: validateString('Action', { max: 100 }),
	targetType: validateString('Target Type', { max: 50 }),
	targetId: validateString('Target ID', { max: 100 }),
	metadata: z.record(z.string(), z.unknown()),
	ipAddress: validateString('IP Address').nullable(),
	userAgent: validateString('User Agent').nullable(),
	createdAt: validateDate('Created At'),
	updatedAt: validateDate('Updated At'),
});

const auditLogListResponseSchema = z.object({
	rows: validateArray('Audit Logs', auditLogResponseSchema),
	total: validateNumber('Total', { min: 0, int: true }),
	page: validateNumber('Page', { min: 1, int: true }),
	pageSize: validateNumber('Page Size', { min: 1, int: true }),
});

const auditLogFilterOptionsResponseSchema = z.object({
	actions: validateArray('Actions', validateString('Action')),
	targetTypes: validateArray('Target Types', validateString('Target Type')),
});

export const auditLogListApiResponseSchema = createApiResponseSchema(auditLogListResponseSchema);
export const auditLogFilterOptionsApiResponseSchema = createApiResponseSchema(auditLogFilterOptionsResponseSchema);

export type AuditLogListQueryDto = z.infer<typeof auditLogListQuerySchema>;
export type AuditLogResponse = z.infer<typeof auditLogResponseSchema>;
export type AuditLogListResponse = z.infer<typeof auditLogListResponseSchema>;
export type AuditLogFilterOptionsResponse = z.infer<typeof auditLogFilterOptionsResponseSchema>;
