import { Token } from './Auth.interface';
import { Message } from '../entities/Message.entity';

interface UserInRoom {
	id?: number;
	nickname: string;
	avatar: string;
}

export interface RoomCreateCondition {
	videoId: number;
	user: Token;
}

export interface FoundRoom {
	title: string;
	url_720: string;
	url_480: string;
	url_360: string;
}
