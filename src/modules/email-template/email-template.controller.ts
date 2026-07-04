import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';

import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApiResponse, createApiResponse } from '../../common/interceptors/api-response.interceptor';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
	type EmailTemplateListQueryDto,
	emailTemplateListQuerySchema,
} from './schemas/email-template-list.schema';
import {
	type EmailTemplateListResponse,
	emailTemplateApiResponseSchema,
	emailTemplateListApiResponseSchema,
	type EmailTemplateResponse,
	type UpdateEmailTemplateDto,
	updateEmailTemplateSchema,
} from './schemas/email-template.schema';
import { EmailTemplateService } from './email-template.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('email-templates')
export class EmailTemplatesController {
	constructor(private readonly emailTemplateService: EmailTemplateService) {}

	@Get()
	async listTemplates(
		@Query(new ZodValidationPipe(emailTemplateListQuerySchema)) query: EmailTemplateListQueryDto,
	): Promise<ApiResponse<EmailTemplateListResponse>> {
		const result = await this.emailTemplateService.getActiveTemplates(query);
		return emailTemplateListApiResponseSchema.parse(
			createApiResponse(200, 'Email templates fetched successfully', result),
		);
	}

	@Get(':publicId')
	async getTemplate(
		@Param('publicId') publicId: string,
	): Promise<ApiResponse<EmailTemplateResponse>> {
		const template = await this.emailTemplateService.getByPublicId(publicId);
		return emailTemplateApiResponseSchema.parse(
			createApiResponse(200, 'Email template fetched successfully', template),
		);
	}

	@Patch(':publicId')
	async updateTemplate(
		@Param('publicId') publicId: string,
		@Body(new ZodValidationPipe(updateEmailTemplateSchema)) body: UpdateEmailTemplateDto,
	): Promise<ApiResponse<EmailTemplateResponse>> {
		const template = await this.emailTemplateService.updateTemplate(publicId, body);
		return emailTemplateApiResponseSchema.parse(
			createApiResponse(200, 'Email template updated successfully', template),
		);
	}
}
