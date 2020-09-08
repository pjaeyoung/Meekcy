import { SocketUser } from '../interfaces/Socket.interface';

const users: Array<SocketUser> = [];

function joinUser(
	socketId: string,
	userId: number,
	username: string,
	room: string,
	avatar: string,
) {
	const existedUser = users.find((element) => element.userId === userId);
	if (existedUser) {
		existedUser.socketId = socketId;
		return existedUser;
	}
	const user: SocketUser = { socketId, userId, username, room, avatar };

	users.push(user);

	return user;
}

function getCurrentUserid(id: string): SocketUser | undefined {
	const findUser: SocketUser | undefined = users.find((user: SocketUser) => id === user.socketId);
	console.log(users, 'users');

	return findUser;
}

function joinRoom(userId: number, roomName: string) {
	const findUser = users.find((element) => element.userId === userId);
	console.log('============');
	if (findUser) {
		findUser.room = roomName;
		console.log(users, '=================');
	} else {
		console.log('not found user');
	}
}
function leftUser(userId: number, roomName: string) {
	// let arrIndex: number;

	users.find((element, index) => {
		if (element.userId === userId) {
			users.splice(index, 1);
			return true;
		}
		return false;
	});
	const isParticipantIn = users.find((element) => element.room === roomName);
	if (isParticipantIn) {
		return true;
	}
	return false;
}

export { joinUser, getCurrentUserid, leftUser, joinRoom };
