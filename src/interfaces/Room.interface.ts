import { Token } from './Auth.interface';
import { Message } from '../entities/Message.entity';

interface VideoInRoom {
	title: string;
	url: string;
	end_time?: number;
}

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
	video: VideoInRoom;
	user: UserInRoom;
	messages: Message[];
}
