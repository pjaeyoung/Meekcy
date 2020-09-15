import { Response } from 'express';
import { JWTRequest, JWTCreationOption } from '../interfaces/Auth.interface';
import { User } from '../entities/User.entity';
import { debugERROR } from '../utils/debug';
import { createJWT } from '../utils/token';
import { Avatar } from '../entities/Avatar.entity';

export default {
	patch: async (req: JWTRequest, res: Response): Promise<void> => {
		try {
			const {
				user,
				body: { avatar_id },
			} = req;

			// token이 없을 경우
			if (user === undefined) {
				throw Error('RequestError: user_id');
			}

			// avatar_id가 DB에 존재하지 않을 경우
			const avatar = await Avatar.findOne({ id: avatar_id });
			if (avatar === undefined) {
				throw Error('RequestError: avatar_id');
			}

			// userId에 해당하는 user record의 avatar 변경사항 적용
			await User.updateProfile(user.id, avatar);

			// jwt token 수정
			const jwtCreationOption: JWTCreationOption = {
				payload: {
					id: user.id,
					nickname: user.nickname,
					avatar: avatar.url,
				},
				expiresIn: String(user.exp),
			};
			const token = createJWT(jwtCreationOption);
			res.status(200).send({ token });
		} catch (err) {
			debugERROR(err);
			res.status(404).send(err.message);
		}
	},
};
