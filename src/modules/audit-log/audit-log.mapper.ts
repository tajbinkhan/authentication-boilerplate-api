import type { RoleTypeEnum } from '../../core/database/types';
import type { AuditLogResponse } from './schemas/audit-log.schema';

export interface AuditLogRow {
	publicId: string;
	actorPublicId: string | null;
	actorRole: RoleTypeEnum | null;
	actorName: string | null;
	actorEmail: string | null;
	action: string;
	targetType: string;
	targetId: string;
	metadata: Record<string, unknown>;
	ipAddress: string | null;
	userAgent: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export function mapAuditLogResponse(row: AuditLogRow): AuditLogResponse {
	return {
		id: row.publicId,
		actorId: row.actorPublicId,
		actorRole: row.actorRole,
		actorName: row.actorName,
		actorEmail: row.actorEmail,
		action: row.action,
		targetType: row.targetType,
		targetId: row.targetId,
		metadata: row.metadata,
		ipAddress: row.ipAddress,
		userAgent: row.userAgent,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	};
}
