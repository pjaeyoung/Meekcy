import http from 'http';
import SocketIO from 'socket.io';
import socketioJwt from 'socketio-jwt';
import jwt from 'jsonwebtoken';

import { Message } from './entities/Message.entity';
import { User } from './entities/User.entity';
import { Room } from './entities/Room.entity';
import { VideoHistory } from './entities/VideoHistory.entity';
import configs from './common/config';
import { joinUser, leftUser, joinRoom, getUserInRoom } from './utils/socketUser';
import app from './index';
import { debugINFO, debugERROR } from './utils/debug';
import { getRepository } from 'typeorm';

const server = http.createServer(app);
const io = SocketIO(server);

//socket jwt 토큰 통신을 위한 미들웨어
io.use(
	socketioJwt.authorize({
		secret: configs.JWT_SECRET,
		handshake: true,
	}),
);

// socket통신 간의 이벤트 관리
/**
 * 이벤트
 * commection : socket통신이 연결 됐을경우 자동으로 socket.io에서 발생하는 이벤트
 * joinRoom : client에서 특정 방에 들어가면 처리하는 flow가 담긴 이벤트
 * sendMessage : client에서 보내온 message를 처리하는 이벤트
 * sendChangeAvatar : client에서 변경된 avatar을 실시간으로 모든 유저에게 변경된 내용을 보내주기위한 이벤트
 * sendChangePlay , sendChangeSeeked , sendChangePause : client에서 보내준 싱크를 맞추기 위한 이벤트
 * disconnect : socket 연결이 끊어졌을때 자동으로 socket.io에서 발생하는 이벤트
 *
 * */
io.on('connection', async (socket) => {
	//토큰 파싱과 파싱된 data로 in memory로 참여자들을 관리하기위한 구문
	const socketToken: string = socket.request._query.token;
	const decodedToken = jwt.verify(socketToken, configs.JWT_SECRET);
	const [user, isExist] = joinUser(
		socket.id,
		(<any>decodedToken).id,
		(<any>decodedToken).nickname,
		(<any>decodedToken).room,
		(<any>decodedToken).avatar,
	);
	//이미 in memory(paticipant array)에 존재하는 경우 client에게 알리는 구문
	if (isExist) {
		socket.emit('overlapUser', {});
		socket.disconnect(true);
	}

	socket.on('joinRoom', async (value) => {
		joinRoom(user.userId, value.roomName);
		socket.join(user.room);
		if (!user.room) {
			return;
		}
		//message db row Create
		const message = new Message();
		message.caption = `Joined ${user.username}`;

		const finduser = await User.findOne({ id: user.userId });
		const findRoom = await Room.findOne({ roomname: user.room });
		if (!finduser || !findRoom) {
			return;
		}
		finduser.room = findRoom;
		await finduser.save();

		message.user = finduser;
		message.room = findRoom;
		await message.save();

		const msg = await Message.createQueryBuilder('message')
			.leftJoinAndSelect('message.user', 'user')
			.leftJoinAndSelect('user.avatar', 'avatar')
			.leftJoin('message.room', 'room')
			.where('room.roomname = :roomname', { roomname: user.room })
			.getMany();

		const messages = msg.map((element) => {
			return {
				value: {
					caption: element.caption,
					message: element.text,
					id: element.user.id,
					avatar: element.user.avatar.url,
					nickname: element.user.nickname,
				},
			};
		});
		//현재 방에 접속된 참여자들의 수를 보내주고, 저장된 메세지들을 보내주는 트리거
		const countParticipants = getUserInRoom(user.room);
		io.to(user.room).emit('receiveHistoryMessages', messages);
		io.to(user.room).emit('receiveParticipants', { countParticipants });

		// url로 스트리밍화면 진입한 사람에게 현재 video 시간을 알려주는 트리거 역할
		io.in(user.room).clients((err: Error, clients: any) => {
			// 여기서 clients 중 하나 골라서 <동영상 위치> 이벤트를 송신(emit)
			// url 진입한 대상(target)만 이벤트를 걸어주기 위해 socketId 전달 : 서버 => 클라이언트 => 서버로 전달되는 값 (166줄 참고)
			io.to(clients[0]).emit('currentVideoPosition', { target: user.socketId });
		});
	});

	socket.on('error', (err) => {
		debugERROR(err);
	});

	socket.on('sendMessage', async (value) => {
		if (!user) {
			return;
		}
		//message db row Create
		const message = new Message();
		let nickname = '';
		message.text = value.message;
		await User.findOne({ id: user.userId })
			.then((res) => {
				if (res) {
					message.user = res;
					nickname = res.nickname;
				} else {
					return;
				}
			})
			.then(() => {
				Room.findOne({ roomname: user.room }).then((res) => {
					console.log(res, 'roomname');
					if (res) {
						message.room = res;
					} else {
						return;
					}
					message.save();
				});
			});

		io.to(user.room).emit('receiveMessage', {
			value: {
				message: value.message,
				id: user.userId,
				avatar: user.avatar,
				nickname: nickname,
			},
		});
	});

	socket.on('sendChangeAvatar', async (value) => {
		const tempObj = {
			userId: user.userId,
			nickname: user.username,
			avatar: value.user.avatar,
		};
		user.avatar = value.user.avatar;

		io.to(user.room).emit('receiveChangeAvatar', tempObj);
	});

	// 임의로 선택된 client로 부터 currentTime(비디오 재생시간)과 status(비디오 재생상태)를 받아
	// url로 스트리밍화면에 진입한 유저에게만 receiveSeeked 이벤트 발동
	// 싱크 문제로 currentTime에 0.7초 더해준 값 전달
	socket.on('sendCurrentVideoPosition', (value) => {
		socket
			.to(value.target)
			.emit('receiveSeeked', { currentTime: value.currentTime + 0.7, status: value.status });
	});

	socket.on('sendChangePlay', async (value) => {
		if (!user) {
			return;
		}
		//message db row Create
		const message = new Message();
		const finduser = await User.findOne({ id: user.userId });
		const findRoom = await Room.findOne({ roomname: user.room });
		if (!finduser || !findRoom) {
			return;
		}
		message.caption = 'started playing the video';
		message.user = finduser;
		message.room = findRoom;
		await message.save();
		io.to(user.room).emit('receiveMessage', {
			value: {
				caption: message.caption,
				id: user.userId,
				avatar: user.avatar,
				nickname: user.username,
			},
		});
		socket.to(user.room).broadcast.emit('receivePlay', value);
	});
	socket.on('sendChangeSeeked', async (value) => {
		if (!user) {
			return;
		}
		//message db row Create
		const beforeSec: number = value.currentTime;

		let hour: number | string = Math.floor(beforeSec / 3600);
		let min: number | string = Math.floor((beforeSec % 3600) / 60);
		let sec: number | string = Math.floor(beforeSec % 60);
		const message = new Message();
		const finduser = await User.findOne({ id: user.userId });
		const findRoom = await Room.findOne({ roomname: user.room });
		if (!finduser || !findRoom) {
			return;
		}
		hour = hour < 10 ? (hour = '0' + hour) : hour;
		min = min < 10 ? (min = '0' + min) : min;
		sec = sec < 10 ? (sec = '0' + sec) : sec;

		message.caption = `Jump to ${hour}:${min}:${sec}`;
		message.user = finduser;
		message.room = findRoom;
		await message.save();
		io.to(user.room).emit('receiveMessage', {
			value: {
				caption: message.caption,
				id: user.userId,
				avatar: user.avatar,
				nickname: user.username,
			},
		});
		socket.to(user.room).broadcast.emit('receiveSeeked', value);
	});
	socket.on('sendChangePause', async (value) => {
		if (!user) {
			return;
		}
		//message db row Create
		const message = new Message();
		const finduser = await User.findOne({ id: user.userId });
		const findRoom = await Room.findOne({ roomname: user.room });
		if (!finduser || !findRoom) {
			return;
		}
		message.caption = 'paused the video';
		message.user = finduser;
		message.room = findRoom;
		await message.save();
		io.to(user.room).emit('receiveMessage', {
			value: {
				caption: message.caption,
				id: user.userId,
				avatar: user.avatar,
				nickname: user.username,
			},
		});
		socket.to(user.room).broadcast.emit('receivePause', value);
	});

	socket.on('disconnect', async () => {
		const message = new Message();
		//message db row Create
		message.caption = `left ${user.username}`;
		await User.findOne({ id: user.userId })
			.then((res) => {
				if (res) {
					message.user = res;
				} else {
					return;
				}
			})
			.then(() => {
				Room.findOne({ roomname: user.room }).then((res) => {
					if (res) {
						message.room = res;
					} else {
						return;
					}
					message.save();
				});
			});
		//방을 나간 유저의 db에서 room_id를 삭제 하기위한 구문
		const userRecord = await User.findOne({ id: user.userId });

		if (userRecord === undefined) {
			throw Error('RequestError: user_id');
		}

		userRecord.room = null;
		await userRecord.save();
		io.to(user.room).emit('receiveMessage', {
			value: {
				caption: message.caption,
				id: user.userId,
				avatar: user.avatar,
			},
		});
		//해당 유저를 in memory에서 삭제하고 해당방에 아무도 남아있지 않을경우 해당 room을 db delete
		const isExistParticipant = leftUser(user.userId, user.room);
		const countParticipants = getUserInRoom(user.room);
		io.to(user.room).emit('receiveParticipants', { countParticipants });
		if (!isExistParticipant) {
			await Room.delete({ roomname: user.room });
		}
	});
});
export default server;
