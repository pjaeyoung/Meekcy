import jwt from 'jsonwebtoken';
import { JWTCreationOption } from '../interfaces/Auth.interface';
import configs from '../common/config';

// JWT token 생성 : nickname, avatar, userId이 담겨짐
export const createJWT = (option: JWTCreationOption): string => {
	return jwt.sign(option.payload, configs.JWT_SECRET, { expiresIn: option.expiresIn || 129600 });
};
