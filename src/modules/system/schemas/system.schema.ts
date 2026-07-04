import { z } from 'zod';

import { accessModelEnum, roleTypeEnum } from '../../../core/database/schema/enum.schema';
import { createApiResponseSchema } from '../../../core/validators/api-response.schema';
import {
	validateArray,
	validateDate,
	validateEnum,
	validateNumber,
} from '../../../core/validators/common.schema';

export const updateSystemSettingsSchema = z.object({
	accessModel: validateEnum('Access Model', accessModelEnum.enumValues).optional(),
	allowedRoles: validateArray('Allowed Roles', validateEnum('Role', roleTypeEnum.enumValues)).optional(),
}).strict().refine(data => Object.keys(data).length > 0, {
	message: 'At least one field must be provided to update',
});

export const publicSystemSettingsResponseSchema = z.object({
	accessModel: validateEnum('Access Model', accessModelEnum.enumValues),
	allowedRoles: validateArray('Allowed Roles', validateEnum('Role', roleTypeEnum.enumValues)),
});

export const systemSettingsResponseSchema = publicSystemSettingsResponseSchema.extend({
	id: validateNumber('Settings ID', { min: 1, int: true }),
	createdAt: validateDate('Created At'),
	updatedAt: validateDate('Updated At'),
});

export const publicSystemSettingsApiResponseSchema = createApiResponseSchema(publicSystemSettingsResponseSchema);
export const systemSettingsApiResponseSchema = createApiResponseSchema(systemSettingsResponseSchema);

export type UpdateSystemSettingsDto = z.infer<typeof updateSystemSettingsSchema>;
