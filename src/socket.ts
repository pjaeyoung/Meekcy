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

io.use(
	socketioJwt.authorize({
		secret: configs.JWT_SECRET,
		handshake: true,
	}),
);

io.on('connection', async (socket) => {
	const socketToken: string = socket.request._query.token;
	const decodedToken = jwt.verify(socketToken, configs.JWT_SECRET);
	const [user, isExist] = joinUser(
		socket.id,
		(<any>decodedToken).id,
		(<any>decodedToken).nickname,
		(<any>decodedToken).room,
		(<any>decodedToken).avatar,
	);

	if (isExist) {
		socket.emit('overlapUser', { 1: 1 });
		socket.disconnect(true);
	}

	socket.on('joinRoom', async (value) => {
		joinRoom(user.userId, value.roomName);
		socket.join(user.room);
		if (!user.room) {
			return;
		}

		//message db에 넣기
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
		const countParticipants = getUserInRoom(user.room);
		io.to(user.room).emit('receiveHistoryMessages', messages);
		io.to(user.room).emit('receiveParticipants', { countParticipants });

		// url로 스트리밍화면 진입한 사람에게 현재 video 시간을 알려주는 트리거 역할
		io.in(user.room).clients((err: Error, clients: any) => {
			// 여기서 clients 중 하나 골라서 <동영상 위치> 이벤트를 송신(emit)
			debugINFO('clients ==== >', clients);
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
	socket.on('sendLastVideoCurrnetTime', async (value) => {
		const videoHistory = new VideoHistory();

		const roomRepo = await getRepository(Room)
			.createQueryBuilder('room')
			.leftJoinAndSelect('room.video', 'video')
			.where('room.video = video.id')
			.getOne();

		const findUser = await User.findOne({ id: user.userId });

		if (findUser && roomRepo) {
			videoHistory.user = findUser;
			videoHistory.endTime = value.currentTime;
			videoHistory.video = roomRepo.video;
			await videoHistory.save();
		}
	});
	// url로 들어온 사람만 현재 비디오 재생시간 이벤트 트리거
	socket.on('sendCurrentVideoPosition', (value) => {
		socket
			.to(value.target)
			.emit('receiveSeeked', { currentTime: value.currentTime + 0.7, status: value.status });
	});

	socket.on('sendChangePlay', async (value) => {
		socket.to(user.room).broadcast.emit('receivePlay', value);
	});
	socket.on('sendChangeSeeked', async (value) => {
		socket.to(user.room).broadcast.emit('receiveSeeked', value);
	});
	socket.on('sendChangePause', async (value) => {
		socket.to(user.room).broadcast.emit('receivePause', value);
	});

	socket.on('disconnect', async () => {
		const message = new Message();

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
		const isExistParticipant = leftUser(user.userId, user.room);
		const countParticipants = getUserInRoom(user.room);
		io.to(user.room).emit('receiveParticipants', { countParticipants });
		if (!isExistParticipant) {
			await Room.delete({ roomname: user.room });
		}
	});
});
export default server;
