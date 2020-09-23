import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled, { css } from 'styled-components';
import Video from '../components/Video';
import Loading from '../components/Loading';
import Chat from '../containers/chattingContainer';
import { useHistory } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faComments } from '@fortawesome/free-solid-svg-icons';
import { faComments as faCommentsRegular } from '@fortawesome/free-regular-svg-icons';
import { faComments as faCommentsSolid } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import videojs from 'video.js';
import { useSelector } from 'react-redux';
library.add(faComments, faCommentsRegular, faCommentsSolid);

const Container = styled.div`
	width: 100%;
	height: 100%;
	display: flex;

	/* pc 줄었을 때 */
	@media (max-width: 1024px) {
		display: grid;
	}

	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		display: flex;
	}
`;

const VideoWrap = styled.div`
	width: 80%;
	height: 100vh;
	position: relative;

	${(props) => {
		if (props.ChatToggleState) {
			return css`
				width: 80%;
				transition: width 0.3s;
			`;
		} else {
			return css`
				width: 100%;
				transition: width 0.3s;
			`;
		}
	}}

	/* pc 줄었을 때 */
	@media (max-width: 1024px) {
		width: 100%;
		height: 65vh;
		${(props) => {
			if (props.ChatToggleState) {
				return css`
					height: 65vh;
					transition: height 0.3s;
				`;
			} else {
				return css`
					height: 100vh;
					transition: height 0.3s;
				`;
			}
		}}
	}
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		width: 80%;
		height: 100vh;
		${(props) => {
			if (props.ChatToggleState) {
				return css`
					height: 100vh;
					transition: height 0.3s;
				`;
			} else {
				return css`
					width: 100%;
					height: 100vh;
					transition: height 0.3s;
				`;
			}
		}}
	}
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		width: 100%;
		height: 100vh;
		${(props) => {
			if (props.ChatToggleState) {
				return css`
					height: 100vh;
					transition: height 0.3s;
				`;
			} else {
				return css`
					height: 100vh;
					transition: height 0.3s;
				`;
			}
		}}
	}
`;

const ChatWrqp = styled.div`
	width: 20%;
	height: 100vh;
	font-size: 20px;

	${(props) => {
		if (props.ChatToggleState) {
			return css`
				display: block;
			`;
		} else {
			return css`
				display: none;
			`;
		}
	}}

	/* pc 줄었을 때 */
	@media (max-width: 1024px) {
		width: 100%;
		height: 35vh;
	}

	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		width: 30%;
		height: 100vh;
	}
`;

const VideoIcon = styled.div`
	position: absolute;
	top: 0;
	width: 100%;
	display: flex;
	justify-content: space-between;
	line-height: 6;
	z-index: 2;
`;

const BackBtn = styled.div`
	padding: 5px;
	padding-left: 25px;
	cursor: pointer;
	&:hover {
		color: gray;
	}
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		padding-top: 0;
	}
`;

const ChatToggle = styled.div`
	padding: 5px;
	padding-right: 20px;
	cursor: pointer;
	&:hover {
		color: gray;
		/* opacity: 0.4; */
	}
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		padding-top: 0;
	}
`;

const token = localStorage.getItem('token');

const StreamingPage = () => {
	const [videoUrl, setVideoUrl] = useState(null);
	const [chatState, setChatState] = useState(true);
	const history = useHistory();
	const [socketIo, setSocketIO] = useState();
	const videoPlayerRef = useRef(null);
	const storeState = useSelector((state) => state.changeDetaildata, []);

	//뒤로 가기 버튼 함수
	const goToBack = async () => {
		try {
			//뒤로 가기 버튼을 누를때, 소켓과의 연결 x
			socketIo.disconnect();
			const player = videojs(videoPlayerRef.current);

			//유저가 본 영상의 마지막 시간을 기록하기 위한 함수
			const currentTime = player.currentTime();
			await axios.post(
				'http://ec2-13-124-190-63.ap-northeast-2.compute.amazonaws.com:4000/videoHistory',
				{
					video_id: storeState.id,
					endTime: currentTime,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
		} catch (error) {}

		history.push(`/`);
	};
	//url 주소를 가져오기 위한 상수 선언
	const roomName = history.location.pathname.substring(7);

	//socket 연결을 위해 connect 시켜주는 useEffect
	useEffect(() => {
		let socketIO = io.connect(
			'http://ec2-13-124-190-63.ap-northeast-2.compute.amazonaws.com:4000',
			{
				query: 'token=' + token,
			},
		);
		setSocketIO(socketIO);

		//이미 방에 들어간 유저가 다른 방에 접속했을때 발생하는 이벤트
		socketIO.on('overlapUser', (value) => {
			socketIO.disconnect();
			history.push(`/warn`);
		});
		axios
			.get(`http://ec2-13-124-190-63.ap-northeast-2.compute.amazonaws.com:4000/rooms/${roomName}`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then((res) => setVideoUrl(res.data))

			.catch((err) => {
				console.log(err);
				socketIO.disconnect();
				history.push('/');
			});
	}, []);

	// 링크로 스트리밍페이지 접속시 로그인여부확인하는 react의 Effect Hook함수
	useEffect(() => {
		let LoginChecking = localStorage.getItem('token');
		if (!LoginChecking) {
			history.push(`/`);
		}
	}, []);

	return (
		<Container>
			{videoUrl ? (
				<>
					<VideoWrap ChatToggleState={chatState}>
						<VideoIcon>
							<BackBtn
								onClick={() => {
									goToBack();
								}}
							>
								<FontAwesomeIcon icon={faArrowLeft} size={'2x'} />
							</BackBtn>
							<ChatToggle
								onClick={() => {
									setChatState(!chatState);
								}}
							>
								{chatState ? (
									<FontAwesomeIcon icon={['fas', 'comments']} size={'2x'} />
								) : (
									<FontAwesomeIcon icon={['far', 'comments']} size={'2x'} />
								)}
							</ChatToggle>
						</VideoIcon>
						<Video
							videoUrl={videoUrl}
							videoPlayerRef={videoPlayerRef}
							socket={socketIo}
							history={history}
						></Video>
					</VideoWrap>

					<ChatWrqp ChatToggleState={chatState}>
						<Chat socket={socketIo}></Chat>
					</ChatWrqp>
				</>
			) : (
				<Loading></Loading>
			)}
		</Container>
	);
};

export default StreamingPage;
