import { Response, NextFunction } from 'express';
import { JWTRequest } from '../interfaces/Auth.interface';
import { VideoHistory } from '../entities/VideoHistory.entity';
import { Video } from '../entities/Video.entity';

export default {
	getAll: async (req: JWTRequest, res: Response, next: NextFunction) => {
		try {
			const videos = await Video.find();
			res.json(videos);
		} catch (err) {
			next(err);
		}
	},
	getWatched: async (req: JWTRequest, res: Response, next: NextFunction) => {
		try {
			const { user } = req;
			const videos = await VideoHistory.createQueryBuilder('history')
				.select('history.endTime')
				.innerJoin('history.user', 'user')
				.innerJoinAndSelect('history.video', 'video')
				.where('history.user_id = :userId', { userId: user?.id })
				.getMany();
			res.json(videos);
		} catch (err) {
			next(err);
		}
	},
};
