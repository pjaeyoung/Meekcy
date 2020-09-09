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
import { debugINFO, debugERROR } from './utils/debug';
import e, { response } from 'express';
const server = http.createServer(app);
const io = SocketIO(server);

io.use(
	socketioJwt.authorize({
		secret: configs.JWT_SECRET,
		handshake: true,
	}),
);

io.on('connection', (socket) => {
	const socketToken: string = socket.request._query.token;
	const decodedToken = jwt.verify(socketToken, configs.JWT_SECRET);
	const [user, isExsist] = joinUser(
		socket.id,
		(<any>decodedToken).userId,
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
		await Room.findOne({ roomname: user.room }).then((res) => {
			Message.find({ room: res }).then((response) => {
				console.log(response, 'findMsg');

				let messages = response.map((element) => {
					return {
						value: {
							caption: element.caption,
							message: element.text,
							id: user.userId,
							avatar: user.avatar,
						},
					};
				});
				io.to(user.room).emit('receiveHistoryMessages', messages);
			});

			// io.to(user.room).emit('receiveHistoryMessages',{})
		});

		// io.to(user.room).emit('receiveMessage', {
		// 	value: {
		// 		caption: message.caption,
		// 		id: user.userId,
		// 		avatar: user.avatar,
		// 	},
		// });
	});

	socket.on('error', (err) => {
		debugERROR(err);
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
		await User.findOne({ id: user.userId }).then((res) => {
			console.log(res, '!!!');
			if (res) {
				Avatar.findOne({ url: user.avatar }).then((response) => {
					if (response) {
						res.avatar = response;
						res.save();
					}
				});
			}
		});

		io.to(user.room).emit('receiveChangeAvatar', tempObj);
	});

	socket.on('disconnect', () => {
		let message = new Message();

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
