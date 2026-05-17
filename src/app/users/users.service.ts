import { Injectable } from '@nestjs/common';

import { notFoundError } from '../../core/errors/domain-error';
import type { UserWithoutPassword } from '../auth/@types/auth.types';
import type {
	RevokeUserSessionsResponse,
	UserListResponse,
	UserManagementResponse,
} from './@types/users.types';
import { mapUserManagementResponse } from './users.mapper';
import { UsersPolicy } from './users.policy';
import { UsersRepository } from './users.repository';
import type { UpdateUserRoleDto, UsersListQueryDto } from './users.schema';

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	async listUsers(query: UsersListQueryDto): Promise<UserListResponse> {
		const users = await this.usersRepository.listUsers(query);

		return {
			rows: users.rows.map(mapUserManagementResponse),
			total: users.total,
			page: users.page,
			pageSize: users.pageSize,
		};
	}

	async updateUserRole(
		currentUser: UserWithoutPassword,
		publicId: string,
		data: UpdateUserRoleDto,
	): Promise<UserManagementResponse> {
		const targetUser = await this.getTargetUser(publicId);

		UsersPolicy.assertCanManageUser(currentUser, targetUser);
		UsersPolicy.assertCanAssignRole(currentUser, data.role);

		if (targetUser.role !== data.role) {
			await this.usersRepository.updateUserRole(targetUser.id, data.role);
		}

		const updatedUser = await this.usersRepository.findUserManagementRowById(targetUser.id);
		if (!updatedUser) throw notFoundError('user_not_found', 'User not found');

		return mapUserManagementResponse(updatedUser);
	}

	async revokeUserSessions(
		currentUser: UserWithoutPassword,
		publicId: string,
	): Promise<RevokeUserSessionsResponse> {
		const targetUser = await this.getTargetUser(publicId);

		UsersPolicy.assertCanManageUser(currentUser, targetUser);

		const revokedCount = await this.usersRepository.revokeAllUserSessions(targetUser.id);

		return { revokedCount };
	}

	private async getTargetUser(publicId: string) {
		const targetUser = await this.usersRepository.findUserByPublicId(publicId);

		if (!targetUser) throw notFoundError('user_not_found', 'User not found');

		return targetUser;
	}
}
