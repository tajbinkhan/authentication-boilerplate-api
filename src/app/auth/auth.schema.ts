import z from 'zod';
import {
	validateBoolean,
	validateEmail,
	validatePassword,
	validatePhoneNumber,
	validateString,
} from '../../core/validators/common.schema';

export const loginSchema = z
	.object({
		email: validateEmail,
		password: validateString('Password'),
	})
	.strict();

export const googleLoginSchema = z
	.object({
		credential: validateString('Google credential'),
	})
	.strict();

export const magicLinkRequestSchema = z
	.object({
		email: validateEmail,
	})
	.strict();

export const magicLinkVerifySchema = z
	.object({
		email: validateEmail,
		token: validateString('Magic link token'),
	})
	.strict();

export const registerSchema = z
	.object({
		name: validateString('Name').optional(),
		email: validateEmail,
		password: validatePassword,
		image: validateString('Image').optional(),
		phone: validatePhoneNumber('Phone').optional(),
	})
	.strict();

export const updateProfileSchema = z
	.object({
		name: validateString('Name').optional(),
		image: validateString('Image').optional(),
		phone: validatePhoneNumber('Phone').optional(),
		is2faEnabled: validateBoolean('is2faEnabled').optional(),
	})
	.strict();

export type LoginDto = z.infer<typeof loginSchema>;
export type GoogleLoginDto = z.infer<typeof googleLoginSchema>;
export type MagicLinkRequestDto = z.infer<typeof magicLinkRequestSchema>;
export type MagicLinkVerifyDto = z.infer<typeof magicLinkVerifySchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
