import { z } from 'zod';

import { createApiResponseSchema } from '../../../core/validators/api-response.schema';
import { validateEnum } from '../../../core/validators/common.schema';

const healthIndicatorCollectionSchema = z.record(z.string(), z.record(z.string(), z.unknown()));

export const healthResponseSchema = z.object({
	status: validateEnum('Health Status', ['ok', 'error', 'shutting_down']),
	info: healthIndicatorCollectionSchema.optional(),
	error: healthIndicatorCollectionSchema.optional(),
	details: healthIndicatorCollectionSchema,
});

export const healthApiResponseSchema = createApiResponseSchema(healthResponseSchema);
