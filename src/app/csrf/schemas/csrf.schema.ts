import { createApiResponseSchema } from '../../../core/validators/api-response.schema';
import { validateString } from '../../../core/validators/common.schema';

export const csrfTokenApiResponseSchema = createApiResponseSchema(validateString('CSRF Token'));
