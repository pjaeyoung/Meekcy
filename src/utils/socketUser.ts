import { SocketUser } from '../interfaces/Socket.interface';

const users: Array<SocketUser> = []; //참여자를 in memory에서 관리하기 위한 배열

/**
 * 참여자들을 관리하기위한 in memory 배열에 socket이 연결된 참여자를 추가해주는 함수
 * @param socketId
 * @param userId
 * @param username nickname
 * @param room roomname
 * @param avatar avatar url
 *
 * output : [Object(SocketUser),boolen] => 해당유저 객체, 접속여부
 */
function joinUser(
	socketId: string,
	userId: number,
	username: string,
	room: string,
	avatar: string,
): [SocketUser, boolean] {
	let isExist = true; //해당 참여자가 존재한다면 여러방에 접속하게 되어 추가해준 변수
	let user = users.find((element) => element.userId === userId);
	if (!user) {
		//해당 유저가 in memory 배열에 없는경우 추가
		user = { socketId, userId, username, room, avatar };
		isExist = false;
		users.push(user);
	}
	return [user, isExist];
}
/**
 * 방 이름으로 해당방의 접속된 참여자들의 수를 출력하는 함수
 * @param roomname 찾고싶은 방의 이름
 * output : integer => 해당 방에 접속된 참여자의 수
 */
function getUserInRoom(roomname: string) {
	let count = 0;
	users.forEach((element) => {
		if (element.room === roomname) {
			count++;
		}
	});
	return count;
}

/**
 * 받은 user id로 in memory에서 찾은 user객체를 출력하는 함수
 * @param id user id
 * output : Object(SocketUser)
 */
function getCurrentUserid(id: string): SocketUser | undefined {
	const findUser: SocketUser | undefined = users.find((user: SocketUser) => id === user.socketId);

	return findUser;
}

/**
 * 해당 참여자의 room 정보를 update하는 함수
 * @param userId
 * @param roomName
 * output : void
 */
function joinRoom(userId: number, roomName: string) {
	const findUser = users.find((element) => element.userId === userId);
	if (findUser) {
		findUser.room = roomName;
	} else {
		console.log('not found user');
	}
}
/**
 * 해당 참여자의 연결이 끊겼을경우 inmemory에서 삭제 시켜주는 함수
 * @param userId
 * @param roomName
 * output : boolean => 해당방에 더이상 남아있는 참여자의 존재 여부
 */
function leftUser(userId: number, roomName: string) {
	//해당 참여자 삭제
	users.find((element, index) => {
		if (element.userId === userId) {
			users.splice(index, 1);
			return true;
		}
		return false;
	});
	//참여자 존재 확인
	const isParticipantIn = users.find((element) => element.room === roomName);
	if (isParticipantIn) {
		return true;
	}
	return false;
}

export { joinUser, getCurrentUserid, leftUser, joinRoom, getUserInRoom };
