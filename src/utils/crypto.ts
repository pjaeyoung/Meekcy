import crypto from 'crypto';
import configs from '../common/config';

export default (target: string): string => {
	return crypto.createHmac('sha256', `${configs.SALT}`).update(target).digest('hex');
};
