'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);
const URL = 'http://localhost:4000';

describe('VideoHistory API Test', () => {
	describe('Best Case', () => {
		it('token 인증이 성공되었으면 DB에 시청목록 업데이트되어야 합니다.', (done) => {
			chai
				.request(URL)
				.post('/videoHistory')
				.set({
					Authorization: `Bearer ${global.token}`,
				})
				.send({
					video_id: 1,
					endTime: 100,
				})
				.then((res) => {
					expect(res).to.have.status(200);
					expect(res.text).to.equal('Success');
					done();
				})
				.catch((err) => done(err));
		});
	});
	describe('Worst Case', () => {
		it('token을 decode한 결과 user 정보가 없으면 Unauthorized 응답을 해야합니다.', (done) => {
			chai
				.request(URL)
				.post('/videoHistory')
				.set({ Authorization: `Bearer thisisfaketoken` })
				.send({
					video_id: 1,
					endTime: 100,
				})
				.then((res) => {
					expect(res).to.have.status(401);
					expect(res.res.statusMessage).to.equal('Unauthorized');
					done();
				})
				.catch((err) => done(err));
		});
		it('요청한 Video Id가 DB에 존재하지 않으면 NOT FOUND 응답을 해야합니다.', (done) => {
			chai
				.request(URL)
				.post('/videoHistory')
				.set({ Authorization: `Bearer ${global.token}` })
				.send({
					video_id: -1,
					endTime: 100,
				})
				.then((res) => {
					expect(res).to.have.status(404);
					expect(res.text).to.equal('RequestError: video_id');
					done();
				})
				.catch((err) => done(err));
		});
		it('요청한 endTime이 요청 body에 존재하지 않으면 NOT FOUND 응답을 해야합니다.', (done) => {
			chai
				.request(URL)
				.post('/videoHistory')
				.set({ Authorization: `Bearer ${global.token}` })
				.send({
					video_id: 1,
				})
				.then((res) => {
					expect(res).to.have.status(404);
					expect(res.text).to.equal('RequestError: endTime');
					done();
				})
				.catch((err) => done(err));
		});
	});
});
