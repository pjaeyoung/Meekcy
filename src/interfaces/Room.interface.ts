import { Token } from './Auth.interface';

interface VideoInRoom {
	title: string;
	url: string;
	end_time: number;
}

interface UserInRoom {
	nickname: string;
	avatar: string;
}

export interface RoomCreateCondition {
	videoId: number;
	user: Token;
	end_time: number;
}

export interface CreatedRoom {
	roomname: string;
	video: VideoInRoom;
	user: UserInRoom;
}
