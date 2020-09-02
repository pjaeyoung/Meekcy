import { Response } from 'express';
import { JWTRequest } from '../interfaces/Auth.interface';
import { User } from '../entities/User.entity';
import { debugERROR } from '../utils/debug';

export default {
	patch: async (req: JWTRequest, res: Response): Promise<void> => {
		const {
			user,
			body: { avatar_id: avatar },
		} = req;

		try {
			// userId에 해당하는 user record의 avatar 변경사항 적용
			await User.createQueryBuilder()
				.update()
				.set({ avatar })
				.where({ id: user?.userId })
				.execute();
			res.status(200).send('Success');
		} catch (err) {
			debugERROR(err);
			// avatar_id가 DB에 존재하지 않을 경우
			res.status(404).send('unvalid avatar id');
		}
	},
};
