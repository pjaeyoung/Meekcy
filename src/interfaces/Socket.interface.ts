export interface SocketUser {
	socketId: string;
	userId: number;
	username: string;
	room: string;
	avatar: string;
}

import { Request, Response } from 'express';

export interface CustomRequest extends Request {
	decoded: string;
}

// export interface SocketToken {
// 	userId?: string;
// 	nickname: string;
// 	avartar: string;
// }
