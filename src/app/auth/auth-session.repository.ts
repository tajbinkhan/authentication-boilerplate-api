import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq, gt, ne } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DATABASE_CONNECTION } from '../../database/connection';
import schema from '../../database/schema';
import type { SessionSchemaType } from '../../database/types';
import type { SessionDataType } from './@types/auth.types';

export type AuthSessionDatabase = NodePgDatabase<typeof schema>;

@Injectable()
export class AuthSessionRepository {
	constructor(
		@Inject(DATABASE_CONNECTION)
		private readonly db: AuthSessionDatabase,
	) {}

	async createSession(data: SessionDataType): Promise<SessionSchemaType> {
		return this.db
			.insert(schema.sessions)
			.values(data)
			.returning()
			.then(rows => rows[0]);
	}

	findSession(
		userId: number,
		sessionKeyOrId: string | number,
	): Promise<SessionSchemaType | undefined> {
		return this.db.query.sessions.findFirst({
			where: and(
				this.getSessionIdentityCondition(sessionKeyOrId),
				eq(schema.sessions.userId, userId),
			),
		});
	}

	findSessionByPublicIdForUser(
		userId: number,
		publicId: string,
	): Promise<SessionSchemaType | undefined> {
		return this.db.query.sessions.findFirst({
			where: and(eq(schema.sessions.publicId, publicId), eq(schema.sessions.userId, userId)),
		});
	}

	async extendSession(sessionId: number, expiresAt: Date): Promise<SessionSchemaType | undefined> {
		return this.db
			.update(schema.sessions)
			.set({ expiresAt })
			.where(eq(schema.sessions.id, sessionId))
			.returning()
			.then(rows => rows[0]);
	}

	async revokeSession(userId: number, sessionKeyOrId: string | number): Promise<void> {
		await this.db
			.update(schema.sessions)
			.set({ isRevoked: true })
			.where(
				and(this.getSessionIdentityCondition(sessionKeyOrId), eq(schema.sessions.userId, userId)),
			);
	}

	async revokeSessionByPublicIdForUser(
		userId: number,
		publicId: string,
	): Promise<SessionSchemaType | undefined> {
		return this.db
			.update(schema.sessions)
			.set({ isRevoked: true })
			.where(and(eq(schema.sessions.publicId, publicId), eq(schema.sessions.userId, userId)))
			.returning()
			.then(rows => rows[0]);
	}

	async revokeOtherActiveUserSessions(
		userId: number,
		currentSessionToken: string,
		now: Date = new Date(),
	): Promise<number> {
		const result = await this.db
			.update(schema.sessions)
			.set({ isRevoked: true })
			.where(
				and(
					eq(schema.sessions.userId, userId),
					eq(schema.sessions.isRevoked, false),
					gt(schema.sessions.expiresAt, now),
					ne(schema.sessions.token, currentSessionToken),
				),
			)
			.returning({ id: schema.sessions.id });

		return result.length;
	}

	async revokeAllUserSessions(userId: number): Promise<number> {
		const result = await this.db
			.update(schema.sessions)
			.set({ isRevoked: true })
			.where(and(eq(schema.sessions.userId, userId), eq(schema.sessions.isRevoked, false)))
			.returning();

		return result.length;
	}

	listUserSessions(userId: number): Promise<SessionSchemaType[]> {
		return this.db.query.sessions.findMany({
			where: eq(schema.sessions.userId, userId),
			orderBy: desc(schema.sessions.createdAt),
		});
	}

	private getSessionIdentityCondition(sessionKeyOrId: string | number) {
		return typeof sessionKeyOrId === 'number'
			? eq(schema.sessions.id, sessionKeyOrId)
			: eq(schema.sessions.token, sessionKeyOrId);
	}
}
