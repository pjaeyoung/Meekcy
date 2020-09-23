import { Token } from './Auth.interface';

export interface RoomCreateCondition {
	videoId: number;
	user: Token;
}

export interface FoundRoom {
	title: string;
	url: string;
}
