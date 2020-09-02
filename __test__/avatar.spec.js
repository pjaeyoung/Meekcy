'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const API = 'http://localhost:4000';

const { token } = require('./fixtures/token.json');

describe('Avatar API Test', () => {
	describe('Check for certification', () => {
		it('token을 decode한 결과 user 정보가 없으면 Unauthorized 응답을 해야합니다.', (done) => {
			chai
				.request(API)
				.get('/avatars')
				.set({ Authorization: `Bearer thisisfaketoken` })
				.then((res) => {
					expect(res).to.have.status(401);
					expect(res.res.statusMessage).to.equal('Unauthorized');
					done();
				})
				.catch((err) => done(err));
		});
		it('token 인증이 성공되었으면 DB에 있는 모든 avatar 정보를 가져와야합니다.', (done) => {
			chai
				.request(API)
				.get('/avatars')
				.set({
					Authorization: `Bearer ${token}`,
				})
				.then((res) => {
					expect(res).to.have.status(200);
					expect(Array.isArray(res.body)).to.equal(true);
					expect(res.body.length).to.equal(7);
					for (let i = 0; i < res.body.length; i += 1) {
						expect(res.body[i]).has.all.keys(['id', 'name', 'url']);
					}
					done();
				})
				.catch((err) => done(err));
		});
	});
});
