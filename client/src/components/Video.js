import React, { useEffect, useSelector } from 'react';
import videojs from 'video.js';
import seekButtons from 'videojs-seek-buttons';
import 'videojs-contrib-quality-levels';
import videojsqualityselector from 'videojs-hls-quality-selector';
import 'video.js/dist/video-js.css';
import '@silvermine/videojs-quality-selector';
import '@silvermine/videojs-quality-selector/dist/css/quality-selector.css';
import styled from 'styled-components';
import axios from 'axios';
//
const Container = styled.div`
	width: 100%;
	height: 100%;
`;

const Video = ({ videoUrl, videoPlayerRef, socket, history }) => {
	//모달 데이터를 가져오기 위한 리덕스 스토어
	const storeState = useSelector((state) => state.changeDetaildata, []);
  
	const options = {
		controls: true,
		muted: false,
		sources: [
			{
				src: `${videoUrl.url}`,
				type: 'application/x-mpegurl',
			},
		],
		controlBar: {
			children: [
				'playToggle',
				'volumePanel',
				'progressControl',
				'fullscreenToggle',
				'qualitySelector',
			],
		},
	};
	//마지막 비디오 실행시간을 저장 하기위한 server와의 API 통신을 하는 함수
	const saveVideoHistory = () => {
		socket.disconnect();
		let token = localStorage.getItem('token');
		let player = videojs(videoPlayerRef.current);
		let currentTime = player.currentTime();

		axios.post(
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
		history.go(0);
	};

	useEffect(() => {
		let player = videojs(videoPlayerRef.current, options, () => {
			//영상 플레이어 구축 videojs(id,option,callback)

			player.seekButtons({
				//앞으로 가기, 뒤로가기 버튼
				forward: 10,
				back: 10,
			});

			player
				.qualityLevels
				//화질 만들기
				();

			//화질 선택 버튼 만들기
			player.hlsQualitySelector = videojsqualityselector;
			player.hlsQualitySelector({
				displayCurrentQuality: false,
			});

			//리덕스에서 endTime 가져옴
			if (storeState.endTime) {
				player.currentTime(storeState.endTime);
			}

			player.controlBar.playToggle.on('click', () => {
				if (player.controlBar.playToggle.controlText_ === 'Play') {
					socket.emit('sendChangePlay');
				} else {
					socket.emit('sendChangePause');
				}
			});

			player.controlBar.progressControl.on('click', () => {
				// video 재생바를 감싸고 있는 컴트롤바를 클릭하면 소켓을 통해 현재 재생위치를 다른 사용자들과 맞출수있게 재생위치를 전달하는 click이벤트
				socket.emit('sendChangeSeeked', { currentTime: player.currentTime() });
			});

			player.controlBar.progressControl.children_[0].on('click', () => {
				// video 재생바를 클릭하면 소켓을 통해 현재 재생위치를 다른 사용자들과 맞출수있게 재생위치를 전달하는 click이벤트
				socket.emit('sendChangeSeeked', { currentTime: player.currentTime() });
			});

			player.ready(() => {
				// video데이가 준비된 경우 트리거를 하는 함수
				player.controlBar.seekBack.on('click', () => {
					// video 10초 전 버튼을 클릭하면 소켓을 통해 현재 재생위치를 다른 사용자들과 맞출수있게 재생위치를 전달하는 click이벤트
					socket.emit('sendChangeSeeked', { currentTime: player.currentTime() });
				});
				player.controlBar.seekForward.on('click', () => {
					//// video 10초 후 버튼을 클릭하면 소켓을 통해 현재 재생위치를 다른 사용자들과 맞출수있게 재생위치를 전달하는 click이벤트
					socket.emit('sendChangeSeeked', { currentTime: player.currentTime() });
				});
			});
		});
	}, []);

	//다른 이용자가 재생위치 변경, 동영상시작, 멈추는 행위를 했을때 발생하는 이벤트
	useEffect(() => {
		const player = videojs(videoPlayerRef.current);
		socket.on('receiveSeeked', (value) => {
			player.currentTime(value.currentTime);
			// url로 중간에 스트리밍화면에 진입한 유저에게 재생상태에 맞춰 비디오 컨트롤
			if (value.status === 'play') {
				player.play();
			}
		});
		socket.on('receivePlay', () => {
			player.play();
		});
		socket.on('receivePause', () => {
			player.pause();
		});

		/* 
			@Description  url로 스트리밍화면에 진입한 사람에게 현재 동영상 위치를 알려주는 기능
		                  서버가 임의의 유저를 고른 대상만 이벤트가 발생함 
			@params       { string } target 
		*/
		socket.on('currentVideoPosition', ({ target }) => {
			// target(url 진입한 소켓 Id) , currentTime(현재 동영상 위치) , status(동영상 재생여부)를 서버에 전달
			socket.emit('sendCurrentVideoPosition', {
				currentTime: player.currentTime(),
				target,
				status: player.paused() ? 'pause' : 'play',
			});
		});
	}, []);

	//브라우저 강제종료시 발생하는 이벤트처리를 위한 useEffect
	useEffect(() => {
		window.addEventListener('beforeunload', async function (event) {
			socket.disconnect();
			const token = localStorage.getItem('token');
			const player = videojs(videoPlayerRef.current);
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
		});

		return saveVideoHistory;
	}, []);

	// 다른 사용자가 재생위치를 변경하거나 재생버튼을 누르거나 멈추었을때 소켓을 통해서 환경을 동일하게 적용시켜주는 react의 Effect Hook함수
	useEffect(() => {
		const player = videojs(videoPlayerRef.current);
		socket.on('receiveSeeked', (value) => {
			player.currentTime(value.currentTime);
		});
		socket.on('receivePlay', () => {
			player.play();
		});
		socket.on('receivePause', () => {
			player.pause();
		});
	}, []);

	// video 영상화면을 클릭한 경우 현재 영상의 플레이환경에 따라 소켓을 이용해 다른 사용자들과 맞출수있게 환경을 전달하는 click이벤트에 연결된 메소드
	function overClick(e) {
		const player = videojs(videoPlayerRef.current);
		if (e.target.className === 'vjs-tech') {
			if (player.controlBar.playToggle.controlText_ === 'Play') {
				socket.emit('sendChangePlay');
			} else {
				socket.emit('sendChangePause');
			}
		}
	}

	return (
		<Container>
			<video
				onClick={(e) => {
					overClick(e);
				}}
				ref={videoPlayerRef}
				className="video-js vjs-default-skin vjs-big-play-centered"
				style={{ width: '100%', height: '100%' }}
			></video>
		</Container>
	);
};
export default Video;
