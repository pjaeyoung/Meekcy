import { Response } from 'express';
import { JWTRequest } from '../interfaces/Auth.interface';
import { VideoHistory } from '../entities/VideoHistory.entity';
import { Video } from '../entities/Video.entity';

export default {
	getAll: async (req: JWTRequest, res: Response): Promise<void> => {
		try {
			const videos = await Video.find();
			res.json(videos);
		} catch (err) {
			res.status(404).send(err.message);
		}
	},
	getWatched: async (req: JWTRequest, res: Response): Promise<void> => {
		try {
			const { user } = req;

			if (user === undefined) {
				throw Error('Unauthorized');
			}

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
