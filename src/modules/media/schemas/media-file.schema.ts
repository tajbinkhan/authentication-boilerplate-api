import { z } from 'zod';

type MulterFile = Express.Multer.File;

export const FILE_SIZE_LIMIT = 2 * 1024 * 1024;

export const singleFileSchema = z
	.custom<MulterFile>(value => value !== null && typeof value === 'object', {
		message: 'File is required',
	})
	.superRefine((file, context) => {
		if (!file?.originalname) {
			context.addIssue({ code: 'custom', message: 'Invalid file' });
			return;
		}

		const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp'] as const;
		if (!allowedMimeTypes.includes(file.mimetype as (typeof allowedMimeTypes)[number])) {
			context.addIssue({ code: 'custom', message: `Unsupported file type: ${file.mimetype}` });
		}

		if (file.size > FILE_SIZE_LIMIT) {
			context.addIssue({
				code: 'custom',
				message: `File too large. Max is ${FILE_SIZE_LIMIT} bytes`,
			});
		}
	});
