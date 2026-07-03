import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

import { createApiResponse } from '../../common/interceptors/api-response.interceptor';
import { CsrfService } from './csrf.service';
import { csrfTokenApiResponseSchema } from './schemas/csrf.schema';

@Controller('csrf')
export class CsrfController {
	constructor(private readonly csrfService: CsrfService) {}

	@Get('')
	getCsrfToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const token = this.csrfService.generateCsrfToken(req, res);
		return csrfTokenApiResponseSchema.parse(
			createApiResponse(HttpStatus.OK, 'Success', token),
		);
	}
}
