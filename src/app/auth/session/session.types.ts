import type { SessionSchemaType } from '../../../core/database/types';

export type SessionDataType = Omit<
	SessionSchemaType,
	| 'id'
	| 'publicId'
	| 'twoFactorVerified'
	| 'twoFactorFailedAttempts'
	| 'twoFactorLockedUntil'
	| 'isRevoked'
	| 'createdAt'
	| 'updatedAt'
>;

export type SessionStatus = 'active' | 'revoked' | 'expired';

export type SessionSortKey =
	| 'deviceName'
	| 'deviceType'
	| 'ipAddress'
	| 'userAgent'
	| 'status'
	| 'createdAt'
	| 'expiresAt';

export type SessionSortDirection = 'asc' | 'desc';
