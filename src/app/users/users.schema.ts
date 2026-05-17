import { z } from 'zod';

import { validateEnum, validateString } from '../../core/validators/common.schema';
import { baseQuerySchema, type SortableField } from '../../core/validators/base-query.schema';
import { roleTypeEnum } from '../../models/drizzle/enum.model';

export const userRoleValues = roleTypeEnum.enumValues;

const USER_SORTABLE_FIELDS: readonly SortableField[] = [
	{ name: 'name', queryName: 'name' },
	{ name: 'email', queryName: 'email' },
	{ name: 'emailVerified', queryName: 'emailVerified' },
	{ name: 'is2faEnabled', queryName: 'is2faEnabled' },
	{ name: 'role', queryName: 'role' },
	{ name: 'activeSessionCount', queryName: 'activeSessionCount' },
	{ name: 'createdAt', queryName: 'createdAt' },
	{ name: 'updatedAt', queryName: 'updatedAt' },
] as const;

const roleQuerySchema = validateString('Role')
	.transform(value =>
		value
			.split(',')
			.map(role => role.trim())
			.filter(Boolean),
	)
	.refine(
		values => values.every(role => userRoleValues.includes(role as (typeof userRoleValues)[number])),
		{ error: 'Role is invalid' },
	)
	.transform(values => values as (typeof userRoleValues)[number][])
	.optional();

const emailVerifiedQuerySchema = z
	.preprocess(value => {
		const rawValue = Array.isArray(value) ? value[0] : value;
		if (typeof rawValue !== 'string') return undefined;

		const normalized = rawValue.trim().toLowerCase();
		return normalized || undefined;
	}, z.enum(['true', 'false'], { error: 'Email Verified must be true or false' }).optional())
	.transform(value => (value === undefined ? undefined : value === 'true'));

export const usersListQuerySchema = baseQuerySchema(USER_SORTABLE_FIELDS).safeExtend({
	role: roleQuerySchema,
	emailVerified: emailVerifiedQuerySchema,
});

export const updateUserRoleSchema = z
	.object({
		role: validateEnum('Role', userRoleValues),
	})
	.strict();

export type UsersListQueryDto = z.infer<typeof usersListQuerySchema>;
export type UpdateUserRoleDto = z.infer<typeof updateUserRoleSchema>;
