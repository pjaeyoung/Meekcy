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
import { SocketUser, CustomRequest } from './interfaces/Socket.interface';
import app from './index';
import { debugINFO } from './utils/debug';
import { response } from 'express';
const server = http.createServer(app);
const io = SocketIO(server);

io.use(
	socketioJwt.authorize({
		secret: configs.JWT_SECRET,
		handshake: true,
	}),
);

io.on('connection', (socket) => {
	console.log('-------------');

	const socketToken: string = socket.request._query.token;
	const decodedToken = jwt.verify(socketToken, configs.JWT_SECRET);
	const user = joinUser(
		socket.id,
		(<any>decodedToken).userId,
		(<any>decodedToken).nickname,
		(<any>decodedToken).room,
		(<any>decodedToken).avatar,
	);
	console.log(decodedToken, '****************');

	socket.on('joinRoom', (value) => {
		console.log('========================');

		joinRoom(user.userId, value.roomName);
		//user.room = value.roomName;

		// const curuser: SocketUser | undefined = getCurrentUserid(socket.id);
		// console.log(curuser, 'curuser');

		// curuser ? (curuser.room = value.roomName) : undefined;
		// // console.log(curuser, 'curuser after');
		// //console.log(user, 'user');
		console.log(user.room, 'user.room');
		socket.join(user.room);
		//message db에 넣기
		let message = new Message();
		message.caption = `Joined ${user.username}`;
		User.findOne({ id: user.userId })
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
				caption: message.caption,
				id: user.userId,
				avatar: user.avatar,
			},
		});
	});

	socket.on('error', (err) => {
		console.log(err);
	});

	socket.on('sendMessage', (value) => {
		console.log(value, 'send');

		if (!user) {
			return;
		}
		let message = new Message();
		message.text = value.message;
		User.findOne({ id: user.userId })
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
		const selectedUser = await User.findOne({ id: user.userId });
		const selectedAvatar = await Avatar.findOne({ url: user.avatar });

		if (selectedUser && selectedAvatar) {
			selectedUser.avatar = selectedAvatar;
			selectedAvatar.save();
		}

		io.to(user.room).emit('receiveChangeAvatar', tempObj);
	});

	socket.on('disconnect', () => {
		let message = new Message();
		console.log(user);
		let find = getCurrentUserid(socket.id);
		console.log(find);

		message.caption = `left ${user.username}`;
		User.findOne({ id: user.userId })
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
		const curuser = getCurrentUserid(socket.id);
		const tempRoomName = user.room;
		const isExistParticipant = leftUser(user.userId, user.room);
		// if (!isExistParticipant) {
		// 	Room.delete({ roomname: tempRoomName });
		// }
	});
});
export default server;
