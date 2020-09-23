import { Response } from 'express';
import { JWTRequest } from '../interfaces/Auth.interface';
import { VideoHistory } from '../entities/VideoHistory.entity';
import { Video } from '../entities/Video.entity';

export default {
	getAll: async (req: JWTRequest, res: Response): Promise<void> => {
		try {
			// 모든 video 정보 가져오기
			const videos = await Video.find();
			res.json(videos);
		} catch (err) {
			res.status(404).send(err.message);
		}
	},
	getWatched: async (req: JWTRequest, res: Response): Promise<void> => {
		try {
			const { user } = req;
			// jwt 토큰에서 user 정보가 없을 경우 예외처리
			if (user === undefined) {
				throw Error('Unauthorized');
			}
			/*
			   @Description   유저가 이전에 본 비디오 정보를 videoHistory에서 찾기 
			   @Condition     userId 
			   @Response      비디오 정보 , 마지막으로 본 재생시간(초)
			*/
			const videos = await VideoHistory.createQueryBuilder('history')
				.innerJoin('history.user', 'user')
				.innerJoinAndSelect('history.video', 'video')
				.where('history.user_id = :userId', { userId: user.id })
				.select(['history.endTime', 'video'])
				.getMany();
			res.json(videos);
		} catch (err) {
			res.status(404).send(err.message);
		}
	},
};
