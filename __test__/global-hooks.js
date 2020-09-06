const user = require('./fixtures/user.json');
const createJWT = require('./utils/createJwt');

global.token;
exports.mochaHooks = {
	beforeAll(done) {
		token = createJWT({ payload: user });
		console.log(token);
		done();
	},
};
