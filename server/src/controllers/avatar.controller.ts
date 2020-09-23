import { Response, NextFunction } from 'express';
import { JWTRequest } from '../interfaces/Auth.interface';
import { Avatar } from '../entities/Avatar.entity';

export default {
	get: async (req: JWTRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			// DB에서 모든 avatar 정보 가져오기
			const avatars = await Avatar.find();
			res.status(200).json(avatars);
		} catch (err) {
			next(err);
		}
	},
};
