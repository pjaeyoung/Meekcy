'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const URL = 'http://localhost:4000';

const { token } = require('./fixtures/token.json');

describe('Room API Test', () => {
	describe('GET /rooms/:roomname', () => {
		describe('Best Case', () => {
			it('token 인증이 성공되었으면 DB에 Room정보(video,user,messages)를 전달해야합니다.', (done) => {
				chai
					.request(URL)
					.get('/rooms/14d7bebb-963c-421e-9bd4-9e8ef6c97525')
					.set({
						Authorization: `Bearer ${token}`,
					})
					.then((res) => {
						expect(res).to.have.status(200);
						expect(res.body).has.all.keys(['video', 'user', 'messages']);
						expect(res.body.video).has.all.keys(['title', 'url']);
						expect(res.body.user).has.all.keys(['userId', 'nickname', 'avatar']);
						expect(Array.isArray(res.body.messages)).to.be.true;

						const message = res.body.messages[0];
						expect(message).has.all.keys(['id', 'text', 'caption', 'user']);
						done();
					})
					.catch((err) => done(err));
			});
		});
		describe('Worst Case', () => {
			it('token을 decode한 결과 user 정보가 없으면 Unauthorized 응답을 해야합니다.', (done) => {
				chai
					.request(URL)
					.get('/rooms/14d7bebb-963c-421e-9bd4-9e8ef6c97525')
					.set({ Authorization: `Bearer thisisfaketoken` })
					.then((res) => {
						expect(res).to.have.status(401);
						expect(res.res.statusMessage).to.equal('Unauthorized');
						done();
					})
					.catch((err) => done(err));
			});
			it('roomname이 DB에 존재하지 않으면 NOT FOUND 응답을 해야 합니다.', (done) => {
				chai
					.request(URL)
					.get('/rooms/fakeroomname')
					.set({ Authorization: `Bearer ${token}` })
					.then((res) => {
						expect(res).to.have.status(404);
						expect(res.text).to.equal('RequestError: roomname');
						done();
					})
					.catch((err) => done(err));
			});
		});
	});
	describe('POST /rooms', () => {
		describe('Best Case', () => {
			it('token 인증이 성공되었으면 DB에 Room record를 생성하고 Room정보를 전달해야합니다.', (done) => {
				chai
					.request(URL)
					.post('/rooms')
					.set({
						Authorization: `Bearer ${token}`,
					})
					.send({ video_id: 1, end_time: 0 })
					.then((res) => {
						expect(res).to.have.status(201);
						expect(res.body).has.all.keys(['roomname', 'video', 'user']);
						expect(res.body.video).has.all.keys(['title', 'url', 'end_time']);
						expect(res.body.user).has.all.keys(['nickname', 'avatar']);
						done();
					})
					.catch((err) => done(err));
			});
		});
		describe('Worst Case', () => {
			it('token을 decode한 결과 user 정보가 없으면 Unauthorized 응답을 해야합니다.', (done) => {
				chai
					.request(URL)
					.post('/rooms')
					.set({ Authorization: `Bearer thisisfaketoken` })
					.send({ video_id: 1, end_time: 0 })
					.then((res) => {
						expect(res).to.have.status(401);
						expect(res.res.statusMessage).to.equal('Unauthorized');
						done();
					})
					.catch((err) => done(err));
			});
			it('video_id가 DB에 존재하지 않으면 NOT FOUND 응답을 해야 합니다.', (done) => {
				chai
					.request(URL)
					.post('/rooms')
					.set({ Authorization: `Bearer ${token}` })
					.send({ video_id: -1, end_time: 0 })
					.then((res) => {
						expect(res).to.have.status(404);
						expect(res.text).to.equal('RequestError: video_id');
						done();
					})
					.catch((err) => done(err));
			});
			it('end_time이 request body에 존재하지 않으면 NOT FOUND 응답을 해야 합니다.', (done) => {
				chai
					.request(URL)
					.post('/rooms')
					.set({ Authorization: `Bearer ${token}` })
					.send({ video_id: 100 })
					.then((res) => {
						expect(res).to.have.status(404);
						expect(res.text).to.equal('RequestError: end_time');
						done();
					})
					.catch((err) => done(err));
			});
		});
	});
});
