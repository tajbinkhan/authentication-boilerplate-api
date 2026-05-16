import { Module } from '@nestjs/common';
import { TemplateRepository } from './template.repository';
import { TemplateService } from './template.service';

@Module({
	providers: [TemplateService, TemplateRepository],
	exports: [TemplateService],
})
export class TemplateModule {}
