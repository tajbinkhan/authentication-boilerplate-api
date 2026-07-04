import { Injectable, PipeTransform } from '@nestjs/common';
import type { z } from 'zod';

import { validationFailed } from '../../core/errors/domain-error';

@Injectable()
export class ZodFileValidationPipe implements PipeTransform {
	constructor(private readonly schema: z.ZodTypeAny) {}

	transform(value: unknown) {
		const parsed = this.schema.safeParse(value);
		if (!parsed.success) {
			const msg = parsed.error.issues.map(i => i.message).join('; ');
			throw validationFailed(msg);
		}
		return parsed.data;
	}
}
