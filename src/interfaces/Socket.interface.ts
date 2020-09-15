export interface SocketUser {
	socketId: string;
	userId: number;
	username: string;
	room: string;
	avatar: string;
}

import { Request } from 'express';

export interface CustomRequest extends Request {
	decoded: string;
}
