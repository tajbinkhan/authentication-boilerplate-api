import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { STATUS_CODES } from 'http';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();
		const exceptionResponse = exception.getResponse();
		const normalizedResponse =
			typeof exceptionResponse === 'object' && exceptionResponse !== null ? exceptionResponse : {};
		const requestId = this.getRequestId(request);
		const error = this.getErrorTitle(status, normalizedResponse);
		const message = this.getMessage(exception, normalizedResponse);
		const meta = this.getMeta(normalizedResponse);

		const responsePayload = {
			statusCode: status,
			code: this.getCode(status, normalizedResponse),
			error,
			message,
			meta,
			timestamp: new Date().toISOString(),
			path: request.url,
			requestId,
		};

		response.status(status).json(responsePayload);
	}

	private getRequestId(request: Request): string {
		if (request.requestId) {
			return request.requestId;
		}

		const header = request.headers?.['x-request-id'];
		if (Array.isArray(header)) {
			return header[0] ?? '';
		}

		return header || '';
	}

	private getErrorTitle(status: number, response: object): string {
		if ('error' in response && typeof response.error === 'string') {
			return response.error;
		}

		return STATUS_CODES[status] ?? 'Error';
	}

	private getMessage(exception: HttpException, response: object): string {
		if ('message' in response) {
			if (Array.isArray(response.message)) {
				return response.message.join(', ');
			}

			if (typeof response.message === 'string') {
				return response.message;
			}
		}

		return exception.message;
	}

	private getMeta(response: object): Record<string, unknown> {
		if ('meta' in response && this.isRecord(response.meta)) {
			return response.meta;
		}

		const meta: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(response)) {
			if (!['statusCode', 'code', 'error', 'message', 'meta'].includes(key)) {
				meta[key] = value;
			}
		}

		return meta;
	}

	private getCode(status: number, response: object): string {
		if ('code' in response && typeof response.code === 'string') {
			return response.code;
		}

		const statusCodeMap: Record<number, string> = {
			[HttpStatus.BAD_REQUEST]: 'bad_request',
			[HttpStatus.UNAUTHORIZED]: 'unauthorized',
			[HttpStatus.FORBIDDEN]: 'forbidden',
			[HttpStatus.NOT_FOUND]: 'not_found',
			[HttpStatus.CONFLICT]: 'conflict',
			[HttpStatus.UNPROCESSABLE_ENTITY]: 'validation_failed',
			[HttpStatus.INTERNAL_SERVER_ERROR]: 'internal_error',
		};

		return statusCodeMap[status] ?? 'http_error';
	}

	private isRecord(value: unknown): value is Record<string, unknown> {
		return typeof value === 'object' && value !== null && !Array.isArray(value);
	}
}
