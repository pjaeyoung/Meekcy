import { Response } from 'express';
import { JWTRequest } from '../interfaces/Auth.interface';
import { debugERROR, debugINFO } from '../utils/debug';
import { Room } from '../entities/Room.entity';

export default {
	get: async (req: JWTRequest, res: Response): Promise<void> => {
		try {
			const {
				user,
				params: { roomname },
			} = req;

			// user undefined 예외처리
			if (user === undefined) {
				throw Error('Unauthorized');
			}

			// roomname으로 Room정보 가져오기
			const room = await Room.findByRoomname(roomname, user);
			res.json(room);
		} catch (err) {
			debugERROR(err);
			res.status(404).send(err.message);
		}
	},
	post: async (req: JWTRequest, res: Response): Promise<void> => {
		try {
			const {
				user,
				body: { video_id, end_time },
			} = req;

			// 클라이언트에서 잘못된 payload 보냈을 때 예외처리
			if (video_id === undefined) {
				throw Error('RequestError: video_id');
			}

			if (end_time === undefined) {
				throw Error('RequestError: end_time');
			}

			// jwt 토큰에서 user 정보가 없을 경우 예외처리
			if (user === undefined) {
				throw Error('Unauthorized');
			}
			// Room 생성
			const room = await Room.createAndSave({ videoId: video_id, user, end_time });
			res.status(201).json(room);
		} catch (err) {
			debugERROR(err);
			res.status(404).send(err.message);
		}
	},
};
