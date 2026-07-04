import { MediaSchemaType } from '../../core/database/types';
import type { MediaResponseType } from './schemas/media.schema';

export type MediaDataType = Omit<MediaSchemaType, 'id' | 'publicId' | 'createdAt' | 'updatedAt'>;

export type MediaDeleteResponseType = MediaResponseType & {
	storageKey: string;
};
