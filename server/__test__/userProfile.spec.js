'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);
const URL = 'http://localhost:4000';

describe('User Profile API Test', () => {
	describe('Best Case', () => {
		it('token 인증이 성공되었으면 DB에 유저 정보가 업데이트되어야 합니다.', (done) => {
			chai
				.request(URL)
				.patch('/user/profile')
				.set({
					Authorization: `Bearer ${global.token}`,
				})
				.send({
					avatar_id: 1,
				})
				.then((res) => {
					expect(res).to.have.status(200);
					expect(res.body).has.key('token');
					expect(typeof res.body.token).to.equal('string');
					done();
				})
				.catch((err) => done(err));
		});
	});
	describe('Worst Case', () => {
		it('token을 decode한 결과 user 정보가 없으면 Unauthorized 응답을 해야합니다.', (done) => {
			chai
				.request(URL)
				.patch('/user/profile')
				.set({ Authorization: `Bearer thisisfaketoken` })
				.send({
					avatar_id: 1,
				})
				.then((res) => {
					expect(res).to.have.status(401);
					expect(res.res.statusMessage).to.equal('Unauthorized');
					done();
				})
				.catch((err) => done(err));
		});
		it('요청한 Avatar Id가 DB에 존재하지 않으면 NOT FOUND 응답을 해야합니다.', (done) => {
			chai
				.request(URL)
				.patch('/user/profile')
				.set({ Authorization: `Bearer ${global.token}` })
				.send({
					avatar_id: -1,
				})
				.then((res) => {
					expect(res).to.have.status(404);
					expect(res.text).to.equal('RequestError: avatar_id');
					done();
				})
				.catch((err) => done(err));
		});
	});
});
