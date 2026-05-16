import type { UserSchemaType } from '../../database/types';
import type { UserWithoutPassword, UserWithoutPasswordResponse } from './@types/auth.types';

export function stripUserPassword(user: UserSchemaType): UserWithoutPassword {
	const { password, ...userWithoutPassword } = user;
	void password;

	return userWithoutPassword;
}

export function mapUserResponse(user: UserWithoutPassword): UserWithoutPasswordResponse {
	return {
		...user,
		id: user.publicId,
		imageInformation: null,
	};
}
