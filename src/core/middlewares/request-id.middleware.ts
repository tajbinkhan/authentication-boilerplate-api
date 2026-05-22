import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
	const header = req.headers['x-request-id'];
	const requestId = typeof header === 'string' ? header : randomUUID();

	req.requestId = requestId;
	res.setHeader('X-Request-Id', requestId);
	next();
}
