import http from 'http';
import SocketIO from 'socket.io';
import socketioJwt from 'socketio-jwt';
import jwt from 'jsonwebtoken';

import { Message } from './entities/Message.entity';
import { User } from './entities/User.entity';
import { Room } from './entities/Room.entity';
import { Avatar } from './entities/Avatar.entity';
import configs from './common/config';
import { joinUser, getCurrentUserid, leftUser, joinRoom } from './utils/socketUser';
import app from './index';
import { debugINFO, debugERROR } from './utils/debug';

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
	const [user, isExsist] = joinUser(
		socket.id,
		(<any>decodedToken).id,
		(<any>decodedToken).nickname,
		(<any>decodedToken).room,
		(<any>decodedToken).avatar,
	);

	if (isExsist) {
		socket.disconnect(true);
		socket.emit('overlapUser', {});
	}

	socket.on('joinRoom', async (value) => {
		joinRoom(user.userId, value.roomName);
		socket.join(user.room);
		if (!user.room) {
			return;
		}
		//message db에 넣기
		let message = new Message();
		message.caption = `Joined ${user.username}`;

		let finduser = await User.findOne({ id: user.userId });
		let findRoom = await Room.findOne({ roomname: user.room });
		if (!finduser || !findRoom) {
			debugINFO(!finduser);
			return;
		}
		finduser.room = findRoom;
		await finduser.save();
		debugINFO(message, 'message!!');

		message.user = finduser;
		message.room = findRoom;
		await message.save();

		const msg = await Message.createQueryBuilder('message')
			.leftJoinAndSelect('message.user', 'user')
			.leftJoinAndSelect('user.avatar', 'avatar')
			.leftJoin('message.room', 'room')
			.where('room.roomname = :roomname', { roomname: user.room })
			.getMany();

		let messages = msg.map((element) => {
			return {
				value: {
					caption: element.caption,
					message: element.text,
					id: element.user.id,
					avatar: element.user.avatar.url,
				},
			};
		});
		io.to(user.room).emit('receiveHistoryMessages', messages);
	});

	socket.on('error', (err) => {
		debugERROR(err);
	});

	socket.on('sendMessage', async (value) => {
		console.log(value, 'send');

		if (!user) {
			return;
		}
		let message = new Message();
		message.text = value.message;
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

	socket.on('disconnect', async () => {
		let message = new Message();

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
					console.log(res, 'end');
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
				caption: message.caption,
				id: user.userId,
				avatar: user.avatar,
			},
		});

		const isExistParticipant = leftUser(user.userId, user.room);
		if (!isExistParticipant) {
			await Room.delete({ roomname: user.room });
		}
	});
});
export default server;
