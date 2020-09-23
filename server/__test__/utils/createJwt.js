const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../', '.env') });

// JWT token 생성 : nickname, avatar, userId이 담겨짐
module.exports = createJWT = (option) => {
	return jwt.sign(option.payload, process.env.JWT_SECRET, { expiresIn: 129600 });
};
