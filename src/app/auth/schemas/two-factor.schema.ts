import { z } from 'zod';

import { createApiResponseSchema } from '../../../core/validators/api-response.schema';
import {
	validateArray,
	validateBoolean,
	validateDate,
	validateNumber,
	validateString,
} from '../../../core/validators/common.schema';

export const twoFactorCodeSchema = z.object({
	code: validateString('Two-factor code', { min: 6, max: 32 }),
}).strict();

const twoFactorStatusResponseSchema = z.object({
	enabled: validateBoolean('Enabled'),
	recoveryCodeCount: validateNumber('Recovery Code Count', { min: 0, int: true }),
});
const twoFactorSetupStartResponseSchema = z.object({
	otpauthUrl: validateString('OTP Auth URL'),
	qrCodeDataUrl: validateString('QR Code Data URL'),
	manualEntryKey: validateString('Manual Entry Key'),
	expiresAt: validateDate('Expires At'),
});
const twoFactorRecoveryCodesResponseSchema = z.object({
	recoveryCodes: validateArray('Recovery Codes', validateString('Recovery Code')),
});
const twoFactorVerifyResponseSchema = z.object({ verified: validateBoolean('Verified') });
const twoFactorDisableResponseSchema = z.object({
	disabled: validateBoolean('Disabled'),
	revokedOtherSessionCount: validateNumber('Revoked Other Session Count', { min: 0, int: true }),
	passwordRemoved: validateBoolean('Password Removed'),
});

export const twoFactorStatusApiResponseSchema = createApiResponseSchema(twoFactorStatusResponseSchema);
export const twoFactorSetupStartApiResponseSchema = createApiResponseSchema(twoFactorSetupStartResponseSchema);
export const twoFactorRecoveryCodesApiResponseSchema = createApiResponseSchema(twoFactorRecoveryCodesResponseSchema);
export const twoFactorVerifyApiResponseSchema = createApiResponseSchema(twoFactorVerifyResponseSchema);
export const twoFactorDisableApiResponseSchema = createApiResponseSchema(twoFactorDisableResponseSchema);

export type TwoFactorCodeDto = z.infer<typeof twoFactorCodeSchema>;
export type TwoFactorStatusResponse = z.infer<typeof twoFactorStatusResponseSchema>;
export type TwoFactorSetupStartResponse = z.infer<typeof twoFactorSetupStartResponseSchema>;
export type TwoFactorRecoveryCodesResponse = z.infer<typeof twoFactorRecoveryCodesResponseSchema>;
export type TwoFactorVerifyResponse = z.infer<typeof twoFactorVerifyResponseSchema>;
export type TwoFactorDisableResponse = z.infer<typeof twoFactorDisableResponseSchema>;
