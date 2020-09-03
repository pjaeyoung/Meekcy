import { Response, NextFunction } from 'express';
import { JWTRequest } from '../interfaces/Auth.interface';
import { User } from '../entities/User.entity';
import { debugERROR } from '../utils/debug';

export default {
	patch: async (req: JWTRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const {
				user,
				body: { avatar_id: avatar },
			} = req;
			if (avatar === undefined) {
				throw Error('RequestError');
			}

			// userId에 해당하는 user record의 avatar 변경사항 적용
			await User.createQueryBuilder()
				.update()
				.set({ avatar })
				.where({ id: user?.userId })
				.execute();
			res.status(200).send('Success');
		} catch (err) {
			debugERROR(err.name);
			if (err.message === 'RequestError' || err.name === 'QueryFailedError') {
				res.status(404).send('unvalid avatar_id');
			} else {
				next(err);
			}
		}
	},
};
