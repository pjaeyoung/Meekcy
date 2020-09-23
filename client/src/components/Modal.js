import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Detail from './Detail';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
	display: block;
	position: fixed;
	z-index: 1;
	left: 0;
	top: 0;
	width: 100%;
	height: 100vh;
	background-color: rgb(0, 0, 0);
	background-color: rgba(0, 0, 0, 0.4);
`;

const ModalContent = styled.div`
	background-image: url(${(props) => props.bgUrl});
	float: left;
	background-size: cover;
	border-radius: 4px;
	background-position: center center;
	transition: opacity 0.1s linear;
	position: relative;
	margin: 10% auto;
	width: 100%;
	height: 60vh;
	min-height: 450px;
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		transform: translateY(-16%);
	}
	/* 스마트폰 세로 */
	@media (max-width: 540px) {
		transform: translateY(-6%);
		background-size: cover;
		height: 100vh;
	}
`;

const BGIMG = styled.div`
	padding: 20px;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.8);
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		background-color: rgba(0, 0, 0, 0.8);
		display: grid;
		grid-auto-columns: minmax(100px, 1fr);
		grid-template-areas:
			'detail detail'
			'footer footer';
		grid-template-rows: 80vh 20vh;
		width: 100%;
		grid-gap: 10px;
	}
	/* 스마트폰 세로 */
	@media (max-width: 540px) {
		height: 100vh;
	}
`;

const PlayBtn = styled.button`
	width: 130px;
	height: 40px;
	border-radius: 5px;
	padding: 10px 25px;
	background: transparent;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5), 7px 7px 20px 0px rgba(0, 0, 0, 0.1),
		4px 4px 5px 0px rgba(0, 0, 0, 0.1);
	border: none;
	color: black;
	background-color: white;
	cursor: pointer;
	font-size: 15px;
	position: absolute;
	bottom: 30px;
	left: 20px;
	&:hover {
		background-color: #900c3f;
		color: white;
	}
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		top: 85vh;
	}
	/* 스마트폰 세로 */
	@media (max-width: 540px) {
		top: 91vh;
	}
`;

const PreviewBtn = styled.button`
	width: 130px;
	height: 40px;
	border-radius: 5px;
	padding: 10px 25px;
	background: transparent;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5), 7px 7px 20px 0px rgba(0, 0, 0, 0.1),
		4px 4px 5px 0px rgba(0, 0, 0, 0.1);
	border: none;
	color: white;
	background-color: gray;
	cursor: pointer;
	font-size: 15px;
	position: absolute;
	bottom: 30px;
	left: 170px;
	&:hover {
		background-color: #900c3f;
		color: white;
	}
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		display: none;
	}
	/* 스마트폰 세로 */
	@media (max-width: 540px) {
		display: none;
	}
	/* 스마트폰 소형 */
	@media (max-width: 300px) {
		display: none;
	}
`;

const NewModal = ({ changeModalFalse }) => {
	//모달 데이터를 가져오기 위한 리덕스 스토어
	const storeState = useSelector((state) => state.changeDetaildata, []);

	//streming page로 가기 위한 history 선언
	const history = useHistory();

	//비디오 룸을 만들어주기 위한 함수
	const createRoom = () => {
		let token = localStorage.getItem('token');

		axios
			.post(
				'http://ec2-13-124-190-63.ap-northeast-2.compute.amazonaws.com:4000/rooms',
				{
					video_id: storeState.id, //비디오 id가 겹치면 안되기 때문에 id 보냄
					end_time: 0,
				},
				{
					//bearer 요청을 위한 헤더 세팅
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				},
			)
			.then((res) => {
				//응답이 오면 응답의 roomname데이터를 받아서 페이지 이동
				history.push(`/rooms/${res.data.roomname}`);
			})
			.catch((err) => {
				console.log(err);
				// 이미 방에 참여중인 유저가 ListPage에서 새로운 방 생성시 알람설정
				alert(
					'2개 이상의 브라우저나 탭에서 Meekcy를 이용하고 계십니다. 필요없는 브라우저나 탭을 닫으신 후 페이지를 다시 로드해 주세요.',
				);
			});
	};

	const playButton = () => {
		changeModalFalse(); //모달 상태 변경
		createRoom(); // 방 생성
	};
	//모달 상태를 가져오는 리덕스 스토어
	const modalState = useSelector((state) => state.changeModalStatus, []);

	// 예고편버튼에 trailer가 있는 경우 trailer를 적용하고 없는 경우 youtube로 연결
	let trailer = storeState.trailer || 'https://www.youtube.com';

	return (
		<>
			{modalState === true ? (
				<Container>
					<ModalContent bgUrl={storeState.poster}>
						<BGIMG>
							<Detail changeModalFalse={changeModalFalse}></Detail>

							<PlayBtn onClick={() => playButton()}>
								<FontAwesomeIcon icon={faPlay} />
								{`  PLAY`}
							</PlayBtn>
							<a href={trailer} target="_blank">
								<PreviewBtn>예고편</PreviewBtn>
							</a>
						</BGIMG>
					</ModalContent>
				</Container>
			) : (
				<></>
			)}
		</>
	);
};
export default NewModal;
