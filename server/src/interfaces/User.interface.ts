interface Users {
	id?: number;
	nickname?: string;
	snsId: string;
	avatarId?: number;
	roomId?: number;
}

export interface FindUserCondition {
	where: Users;
	defaults: Users;
}
