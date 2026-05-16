import { Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

import { validationFailed } from '../errors/domain-error';

@Injectable()
export class ZodValidationPipe<TSchema extends z.ZodTypeAny> implements PipeTransform {
	constructor(private readonly schema: TSchema) {}

	transform(value: unknown): z.infer<TSchema> {
		const parsed = this.schema.safeParse(value);

		if (!parsed.success) {
			const message =
				parsed.error.issues.map(issue => issue.message).join(', ') || 'Validation failed';

			throw validationFailed(message);
		}

		return parsed.data;
	}
}
