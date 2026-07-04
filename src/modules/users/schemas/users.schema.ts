import { z } from 'zod';

import { roleTypeEnum } from '../../../core/database/schema/enum.schema';
import { createApiResponseSchema } from '../../../core/validators/api-response.schema';
import { baseQuerySchema, type SortableField } from '../../../core/validators/base-query.schema';
import {
	validateArray,
	validateBoolean,
	validateDate,
	validateEmail,
	validateEnum,
	validateNumber,
	validatePassword,
	validatePhoneNumber,
	validateString,
	validateUUID,
} from '../../../core/validators/common.schema';

export const userRoleValues = roleTypeEnum.enumValues;

const USER_SORTABLE_FIELDS: readonly SortableField[] = [
	{ name: 'name', queryName: 'name' },
	{ name: 'email', queryName: 'email' },
	{ name: 'emailVerified', queryName: 'emailVerified' },
	{ name: 'is2faEnabled', queryName: 'is2faEnabled' },
	{ name: 'role', queryName: 'role' },
	{ name: 'isApproved', queryName: 'isApproved' },
	{ name: 'activeSessionCount', queryName: 'activeSessionCount' },
	{ name: 'createdAt', queryName: 'createdAt' },
	{ name: 'updatedAt', queryName: 'updatedAt' },
] as const;

const roleQuerySchema = validateString('Role')
	.transform(value => value.split(',').map(role => role.trim()).filter(Boolean))
	.refine(values => values.every(role => userRoleValues.includes(role as (typeof userRoleValues)[number])), {
		message: 'Role is invalid',
	})
	.transform(values => values as (typeof userRoleValues)[number][])
	.optional();

const booleanQuerySchema = (name: string) =>
	z.preprocess(value => {
		const rawValue = Array.isArray(value) ? (value[0] as unknown) : value;
		if (typeof rawValue !== 'string') return undefined;
		return rawValue.trim().toLowerCase() || undefined;
	}, validateEnum(name, ['true', 'false']).optional()).transform(value =>
		value === undefined ? undefined : value === 'true',
	);

export const usersListQuerySchema = baseQuerySchema(USER_SORTABLE_FIELDS).safeExtend({
	role: roleQuerySchema,
	emailVerified: booleanQuerySchema('Email Verified'),
	isApproved: booleanQuerySchema('Is Approved'),
});

export const updateUserRoleSchema = z.object({ role: validateEnum('Role', userRoleValues) }).strict();

const optionalNullableString = (name: string, max = 255) =>
	z.preprocess(value => {
		if (value === null) return null;
		if (typeof value !== 'string') return undefined;
		return value.trim() || null;
	}, validateString(name, { max }).nullable().optional());

const optionalNullablePhone = z.preprocess(value => {
	if (value === null) return null;
	if (typeof value !== 'string') return undefined;
	return value.trim() || null;
}, validatePhoneNumber('Phone').nullable().optional());

const optionalNullablePassword = z.preprocess(value => {
	if (value === null) return null;
	if (typeof value !== 'string') return undefined;
	return value.trim() || null;
}, validatePassword.nullable().optional());

export const createUserSchema = z.object({
	name: optionalNullableString('Name'),
	email: validateEmail.transform(value => value.toLowerCase()),
	password: optionalNullablePassword,
	phone: optionalNullablePhone,
	emailVerified: validateBoolean('Email Verified').optional(),
	role: validateEnum('Role', userRoleValues),
	isApproved: validateBoolean('Is Approved').optional(),
}).strict();

export const updateUserSchema = z.object({
	name: optionalNullableString('Name'),
	email: validateEmail.transform(value => value.toLowerCase()).optional(),
	phone: optionalNullablePhone,
	emailVerified: validateBoolean('Email Verified').optional(),
	isApproved: validateBoolean('Is Approved').optional(),
}).strict().refine(data => Object.keys(data).length > 0, {
	message: 'At least one user field must be provided',
});

export const userManagementResponseSchema = z.object({
	id: validateUUID('User ID'),
	name: validateString('Name').nullable(),
	email: validateEmail,
	image: validateString('Image').nullable(),
	phone: validateString('Phone').nullable(),
	emailVerified: validateBoolean('Email Verified'),
	is2faEnabled: validateBoolean('Two-Factor Enabled'),
	role: validateEnum('Role', userRoleValues),
	isApproved: validateBoolean('Is Approved'),
	activeSessionCount: validateNumber('Active Session Count', { min: 0, int: true }),
	createdAt: validateDate('Created At'),
	updatedAt: validateDate('Updated At'),
});

export const userListResponseSchema = z.object({
	rows: validateArray('Users', userManagementResponseSchema),
	total: validateNumber('Total', { min: 0, int: true }),
	page: validateNumber('Page', { min: 1, int: true }),
	pageSize: validateNumber('Page Size', { min: 1, int: true }),
});

const deleteUserResponseSchema = z.object({ deleted: validateBoolean('Deleted') });
const revokeUserSessionsResponseSchema = z.object({
	revokedCount: validateNumber('Revoked Count', { min: 0, int: true }),
});
const resetUserTwoFactorResponseSchema = z.object({
	reset: validateBoolean('Reset'),
	revokedCount: validateNumber('Revoked Count', { min: 0, int: true }),
});

export const userApiResponseSchema = createApiResponseSchema(userManagementResponseSchema);
export const userListApiResponseSchema = createApiResponseSchema(userListResponseSchema);
export const deleteUserApiResponseSchema = createApiResponseSchema(deleteUserResponseSchema);
export const revokeUserSessionsApiResponseSchema = createApiResponseSchema(revokeUserSessionsResponseSchema);
export const resetUserTwoFactorApiResponseSchema = createApiResponseSchema(resetUserTwoFactorResponseSchema);

export type UsersListQueryDto = z.infer<typeof usersListQuerySchema>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type UpdateUserRoleDto = z.infer<typeof updateUserRoleSchema>;
export type UserManagementResponse = z.infer<typeof userManagementResponseSchema>;
export type UserListResponse = z.infer<typeof userListResponseSchema>;
export type DeleteUserResponse = z.infer<typeof deleteUserResponseSchema>;
export type RevokeUserSessionsResponse = z.infer<typeof revokeUserSessionsResponseSchema>;
export type ResetUserTwoFactorResponse = z.infer<typeof resetUserTwoFactorResponseSchema>;
