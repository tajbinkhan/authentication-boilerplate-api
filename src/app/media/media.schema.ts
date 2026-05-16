import z from 'zod';
import { validateString } from '../../core/validators/common.schema';

export const mediaSchema = z
	.object({
		name: validateString('Media Name'),
		altText: validateString('Media Alt Text'),
	})
	.strict();

export type MediaDto = z.infer<typeof mediaSchema>;
