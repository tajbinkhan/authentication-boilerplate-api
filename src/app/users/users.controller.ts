import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { ApiResponse, createApiResponse } from '../../core/interceptors/api-response.interceptor';
import { ZodValidationPipe } from '../../core/pipes/zod-validation.pipe';
import type { UserWithoutPassword } from '../auth/@types/auth.types';
import { JwtAuthGuard } from '../auth/auth.guard';
import type {
	RevokeUserSessionsResponse,
	UserListResponse,
	UserManagementResponse,
} from './@types/users.types';
import {
	type UpdateUserRoleDto,
	updateUserRoleSchema,
	type UsersListQueryDto,
	usersListQuerySchema,
} from './users.schema';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	async listUsers(
		@Query(new ZodValidationPipe(usersListQuerySchema)) query: UsersListQueryDto,
	): Promise<ApiResponse<UserListResponse>> {
		const users = await this.usersService.listUsers(query);

		return createApiResponse(HttpStatus.OK, 'Users fetched successfully', users);
	}

	@Patch(':id/role')
	async updateUserRole(
		@CurrentUser() currentUser: UserWithoutPassword,
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new ZodValidationPipe(updateUserRoleSchema)) body: UpdateUserRoleDto,
	): Promise<ApiResponse<UserManagementResponse>> {
		const user = await this.usersService.updateUserRole(currentUser, id, body);

		return createApiResponse(HttpStatus.OK, 'User role updated successfully', user);
	}

	@Post(':id/sessions/revoke')
	@HttpCode(HttpStatus.OK)
	async revokeUserSessions(
		@CurrentUser() currentUser: UserWithoutPassword,
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<ApiResponse<RevokeUserSessionsResponse>> {
		const result = await this.usersService.revokeUserSessions(currentUser, id);

		return createApiResponse(HttpStatus.OK, 'User sessions revoked successfully', result);
	}
}
