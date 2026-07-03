import type { UserSchemaType } from '../../core/database/types';
import type { RoleTypeEnum } from '../../core/database/types';

export type UserRole = RoleTypeEnum;

export type UserSortKey =
	| 'name'
	| 'email'
	| 'emailVerified'
	| 'is2faEnabled'
	| 'role'
	| 'activeSessionCount'
	| 'createdAt'
	| 'updatedAt';

export type UserSortDirection = 'asc' | 'desc';

export type UserManagementRow = Pick<
	UserSchemaType,
	| 'id'
	| 'publicId'
	| 'name'
	| 'email'
	| 'image'
	| 'phone'
	| 'emailVerified'
	| 'is2faEnabled'
	| 'role'
	| 'isApproved'
	| 'createdAt'
	| 'updatedAt'
> & {
	activeSessionCount: number;
};
