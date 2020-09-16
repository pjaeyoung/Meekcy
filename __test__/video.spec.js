'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);
const URL = 'http://localhost:4000';

describe('Video API test', () => {
	describe('GET /videos', () => {
		describe('Best Case', () => {
			it('token 인증이 성공되었으면 DB에 있는 모든 video 정보들을 가져와야합니다.', (done) => {
				chai
					.request(URL)
					.get('/videos')
					.set({ Authorization: `Bearer ${global.token}` })
					.then((res) => {
						expect(res).to.have.status(200);
						expect(Array.isArray(res.body)).to.be.true;
						for (let i = 0; i < res.body.length; i += 1) {
							expect(res.body[i]).has.all.keys([
								'id',
								'title',
								'thumbnail',
								'runningTime',
								'releaseDay',
								'detail',
								'url',
								'trailer',
							]);
						}
						done();
					})
					.catch((err) => done(err));
			});
		});
		describe('Worst Case', () => {
			it('token을 decode한 결과 user 정보가 없으면 Unauthorized 응답을 해야합니다.', (done) => {
				chai
					.request(URL)
					.get('/videos')
					.set({ Authorization: `Bearer thisisfaketoken` })
					.then((res) => {
						expect(res).to.have.status(401);
						expect(res.res.statusMessage).to.equal('Unauthorized');
						done();
					})
					.catch((err) => done(err));
			});
		});
	});
	describe('GET videos/watched', () => {
		describe('Best Case', () => {
			it('token 인증이 성공되었으면 DB에 있는 video 정보와 시청기록을 가져와야합니다.', (done) => {
				chai
					.request(URL)
					.get('/videos/watched')
					.set({ Authorization: `Bearer ${global.token}` })
					.then((res) => {
						expect(res).to.have.status(200);
						expect(Array.isArray(res.body)).to.be.true;
						for (let i = 0; i < res.body.length; i += 1) {
							expect(res.body[i]).has.all.keys(['video', 'endTime']);
							expect(res.body[i].video).has.all.keys([
								'id',
								'title',
								'thumbnail',
								'runningTime',
								'releaseDay',
								'detail',
								'url',
								'trailer',
							]);
						}
						done();
					})
					.catch((err) => done(err));
			});
		});
		describe('Worst Case', () => {
			it('token을 decode한 결과 user 정보가 없으면 Unauthorized 응답을 해야합니다.', (done) => {
				chai
					.request(URL)
					.get('/videos/watched')
					.set({ Authorization: `Bearer thisisfaketoken` })
					.then((res) => {
						expect(res).to.have.status(401);
						expect(res.res.statusMessage).to.equal('Unauthorized');
						done();
					})
					.catch((err) => done(err));
			});
		});
	});
});
