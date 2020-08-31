import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
dotenv.config({ path: path.join(__dirname, '../../', '.env') });

export default (target: string): string => {
	return crypto.createHmac('sha256', `${process.env.SALT}`).update(target).digest('hex');
};
