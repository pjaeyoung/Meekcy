import { Response } from 'express';
import { JWTRequest } from '../interfaces/Auth.interface';
import { VideoHistory } from '../entities/VideoHistory.entity';
import { Video } from '../entities/Video.entity';

export default {
	getAll: async (req: JWTRequest, res: Response): Promise<void> => {
		try {
			const videos = await Video.find({
				select: ['id', 'title', 'thumbnail', 'runningTime', 'releaseDay', 'detail', 'url'],
			});
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
				.select([
					'history.endTime',
					'video.id',
					'video.title',
					'video.thumbnail',
					'video.runningTime',
					'video.releaseDay',
					'video.detail',
					'video.url',
				])
				.getMany();
			res.json(videos);
		} catch (err) {
			res.status(404).send(err.message);
		}
	},
};
