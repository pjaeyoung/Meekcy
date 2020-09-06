import { Request } from 'express';

export interface Token {
	avatar: string;
	exp: number;
	iat: number;
	nickname: string;
	id: number;
}

interface JWTCreationPayload {
	nickname: string;
	avatar: string;
	id: number;
}

export interface JWTCreationOption {
	payload: JWTCreationPayload;
	expiresIn?: string;
}

export interface JWTRequest extends Request {
	user?: Token;
}
