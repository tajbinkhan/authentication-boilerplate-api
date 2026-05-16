import { Injectable } from '@nestjs/common';

import { notFoundError } from '../../core/errors/domain-error';
import {
	compileEmailTemplate,
	type CompiledEmailTemplate,
	renderEmailTemplate,
	type RenderedEmailTemplate,
} from './template.mapper';
import { TemplateRepository } from './template.repository';

@Injectable()
export class TemplateService {
	private readonly cache = new Map<string, CompiledEmailTemplate>();

	constructor(private readonly templateRepository: TemplateRepository) {}

	async getActiveTemplateCompiled(templateKey: string): Promise<CompiledEmailTemplate> {
		const cached = this.cache.get(templateKey);
		if (cached) return cached;

		const template = await this.templateRepository.findActiveByKey(templateKey);

		if (!template) {
			throw notFoundError(
				'email_template_not_found',
				`No active email template found for key="${templateKey}"`,
			);
		}

		const compiled = compileEmailTemplate(template);
		this.cache.set(templateKey, compiled);

		return compiled;
	}

	invalidate(templateKey: string): boolean {
		return this.cache.delete(templateKey);
	}

	async render(
		templateKey: string,
		params: Record<string, unknown>,
	): Promise<RenderedEmailTemplate> {
		const template = await this.getActiveTemplateCompiled(templateKey);

		return renderEmailTemplate(template, params);
	}
}
