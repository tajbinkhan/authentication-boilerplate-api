import type { InferSelectModel } from 'drizzle-orm';
import { accounts, sessions, users } from '../models/drizzle/auth.model';
import { emailTemplates } from '../models/drizzle/email-template.model';
import { roleTypeEnum } from '../models/drizzle/enum.model';
import { media } from '../models/drizzle/media.model';

/**
 * Schema Types
 */
export type UserSchemaType = InferSelectModel<typeof users>;
export type AccountSchemaType = InferSelectModel<typeof accounts>;
export type SessionSchemaType = InferSelectModel<typeof sessions>;
export type MediaSchemaType = InferSelectModel<typeof media>;
export type EmailTemplateSchemaType = InferSelectModel<typeof emailTemplates>;

/**
 * Enum Schema Types
 */
export type RoleTypeEnum = (typeof roleTypeEnum.enumValues)[number];
