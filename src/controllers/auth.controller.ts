import { Request, Response, NextFunction } from 'express';
import { OAuth2Client, LoginTicket, TokenPayload } from 'google-auth-library';
import { User } from '../entities/User.entity';
import { debugERROR } from '../utils/debug';
import configs from '../common/config';
import { JWTCreationOption } from '../interfaces/Auth.interface';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client();

// token 검증 및 user정보 반환
const verifyTokenAndGetUserInfo = async (idToken: string): Promise<TokenPayload | undefined> => {
	try {
		const ticket: LoginTicket = await client.verifyIdToken({
			idToken,
			audience: configs.GOOGLE_CLIENT_ID,
		});
		return ticket.getPayload();
	} catch (err) {
		const error = new Error(err.message);
		error.name = 'TokenVerificationError';
		throw error;
	}
};

// JWT token 생성 : nickname, avatar, userId이 담겨짐
const createJWT = (option: JWTCreationOption): string => {
	return jwt.sign(option, configs.JWT_SECRET, { expiresIn: 129600 });
};

export default {
	post: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { id_token } = req.body;

			if (id_token === undefined) {
				throw Error('RequestError');
			}

			// id_token 검증 및 유저 정보 가져오기
			const payload = await verifyTokenAndGetUserInfo(id_token);
			if (payload === undefined) {
				res.status(404).send('Login Fail : unvaild id_token');
				return;
			}

			// 가져온 유저정보로 DB 생성 or 기존 유저 가져오기
			const [user, created] = await User.findOrCreate({
				where: { snsId: payload.sub },
				defaults: { nickname: payload.name, snsId: payload.sub },
			});

			// token 생성
			const token = createJWT({
				userId: user.id,
				nickname: user.nickname,
				avatar: user.avatar.url,
			});

			// 클라이언트에 token 전달
			const statusCode = created ? 201 : 200;
			res.status(statusCode).json({ token });
		} catch (err) {
			if (err.message === 'RequestError' || err.name === 'QueryFailedError') {
				res.status(404).send('unvalid token_id');
			} else {
				next(err);
			}
		}
	},
};
