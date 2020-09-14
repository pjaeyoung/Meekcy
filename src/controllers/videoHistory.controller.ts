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

			if (user === undefined) {
				throw Error('Unauthorized');
			}

			if (videoId === undefined) {
				throw Error('RequestError: video_id');
			}

			if (endTime === undefined) {
				throw Error('RequestError: endTime');
			}

			await VideoHistory.UpdateOrCreate({ userId: user.id, videoId, endTime });

			res.status(200).send('Success');
		} catch (err) {
			res.status(404).send(err.message);
		}
	},
};
