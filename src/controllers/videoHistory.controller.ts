import { Response } from 'express';
import { JWTRequest } from '../interfaces/Auth.interface';
import { VideoHistory } from '../entities/VideoHistory.entity';

export default {
	post: async (req: JWTRequest, res: Response): Promise<void> => {
		try {
			const {
				user,
				body: { video_id: videoId, endTime },
			} = req;

			// jwt 토큰에서 user 정보가 없을 경우 예외처리
			if (user === undefined) {
				throw Error('Unauthorized');
			}
			// 잘못된 요청 : video_id 변수명을 제대로 입력하지 않을 경우
			if (videoId === undefined) {
				throw Error('RequestError: video_id');
			}
			// 잘못된 요청 : endTime 변수명을 제대로 입력하지 않을 경우
			if (endTime === undefined) {
				throw Error('RequestError: endTime');
			}
			// 유저가 본 비디오 마지막 재생시점 기록
			await VideoHistory.UpdateOrCreate({ userId: user.id, videoId, endTime });

			res.status(200).send('Success');
		} catch (err) {
			res.status(404).send(err.message);
		}
	},
};
