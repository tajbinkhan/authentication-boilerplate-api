import { Module } from '@nestjs/common';
import { TemplateModule } from '../template/template.module';
import { BrevoService } from './brevo.service';

@Module({
	imports: [TemplateModule],
	providers: [BrevoService],
	exports: [BrevoService],
})
export class BrevoModule {}
