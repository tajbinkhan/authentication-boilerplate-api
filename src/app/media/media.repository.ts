import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DATABASE_CONNECTION } from '../../database/connection';
import schema from '../../database/schema';
import type { MediaSchemaType } from '../../database/types';
import type { MediaDataType } from './@types/media.types';
import type { MediaDto } from './media.schema';
import type { MediaDeleteRow, MediaResponseRow } from './media.mapper';

export type MediaDatabase = NodePgDatabase<typeof schema>;

@Injectable()
export class MediaRepository {
	constructor(
		@Inject(DATABASE_CONNECTION)
		private readonly db: MediaDatabase,
	) {}

	async create(data: MediaDataType): Promise<MediaSchemaType | null> {
		return this.db
			.insert(schema.media)
			.values(data)
			.returning()
			.then(rows => rows[0] || null);
	}

	listByUserId(userId: number): Promise<MediaResponseRow[]> {
		return this.db
			.select(this.mediaResponseSelection())
			.from(schema.media)
			.where(eq(schema.media.uploadedBy, userId))
			.orderBy(schema.media.createdAt);
	}

	async findByPublicIdForUser(
		userId: number,
		publicId: string,
	): Promise<MediaResponseRow | null> {
		return this.db
			.select(this.mediaResponseSelection())
			.from(schema.media)
			.where(and(eq(schema.media.publicId, publicId), eq(schema.media.uploadedBy, userId)))
			.then(rows => rows[0] || null);
	}

	async updateForUser(
		userId: number,
		publicId: string,
		data: MediaDto,
	): Promise<MediaSchemaType | null> {
		return this.db
			.update(schema.media)
			.set({
				altText: data.altText,
				filename: data.name,
			})
			.where(and(eq(schema.media.publicId, publicId), eq(schema.media.uploadedBy, userId)))
			.returning()
			.then(rows => rows[0] || null);
	}

	async deleteForUser(userId: number, publicId: string): Promise<MediaDeleteRow | null> {
		return this.db
			.delete(schema.media)
			.where(and(eq(schema.media.publicId, publicId), eq(schema.media.uploadedBy, userId)))
			.returning(this.mediaDeleteSelection())
			.then(rows => rows[0] || null);
	}

	async countByUserId(userId: number): Promise<number> {
		return this.db
			.select({ id: schema.media.id })
			.from(schema.media)
			.where(eq(schema.media.uploadedBy, userId))
			.then(rows => rows.length);
	}

	private mediaResponseSelection() {
		return {
			publicId: schema.media.publicId,
			filename: schema.media.filename,
			mimeType: schema.media.mimeType,
			fileSize: schema.media.fileSize,
			secureUrl: schema.media.secureUrl,
			mediaType: schema.media.mediaType,
			altText: schema.media.altText,
			width: schema.media.width,
			height: schema.media.height,
			tags: schema.media.tags,
			createdAt: schema.media.createdAt,
			updatedAt: schema.media.updatedAt,
		};
	}

	private mediaDeleteSelection() {
		return {
			...this.mediaResponseSelection(),
			storageKey: schema.media.storageKey,
		};
	}
}
