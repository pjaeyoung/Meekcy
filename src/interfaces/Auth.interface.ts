import { Request } from 'express';

interface token {
	avatar: string;
	exp: number;
	iat: number;
	nickname: string;
	userId: number;
}

export interface JWTCreationOption {
	nickname: string;
	avatar: string;
	userId: number;
}

export interface JWTRequest extends Request {
	user?: token;
}
