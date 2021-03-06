import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../../', '.env') });

export default {
	GOOGLE_CLIENT_ID: `${process.env.GOOGLE_CLIENT_ID}`,
	SALT: `${process.env.SALT}`,
	JWT_SECRET: `${process.env.JWT_SECRET}`,
	CLIENT_IP: [`${process.env.CLIENT1}`, `${process.env.CLIENT2}`],
	DB_NAME: process.env.NODE_ENV === 'test' ? 'meekcy_test' : `${process.env.DB_NAME}`,
};
