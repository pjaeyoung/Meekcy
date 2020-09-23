import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import videojs from 'video.js';

const Container = styled.div`
	position: relative;

	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		width: 100%;
		grid-area: detail;
		display: grid;
		grid-template-areas:
			'title title'
			'description video';
		grid-gap: 10px;
		grid-template-rows: 10vh 90vh;
	}
`;

const ModalHeader = styled.div`
	display: flex;
	padding-top: 10px;
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		grid-area: title;
		top: 20px;
	}
	/* 스마트폰 세로 */
	@media (max-width: 540px) {
		padding: 0;
	}
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		padding: 10;
	}
`;

const Title = styled.div`
	width: 97%;
	font-size: 50px;
	padding-bottom: 10px;
	color: white;
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		font-size: 35px;
	}
	/* 스마트폰 세로 */
	@media (max-width: 540px) {
		top: 0;
		left: 0;
		padding: 0;
		font-size: 25px;
	}
`;

const Close = styled.div`
	color: #aaa;
	margin: 0;
	font-size: 28px;
	font-weight: bold;
	&:hover {
		color: #900c3f;
		text-decoration: none;
		cursor: pointer;
	}
	/* 스마트폰 세로 */
	@media (max-width: 540px) {
		top: 0;
		left: 0;
		font-size: 25px;
	}
`;

const DescriptionWrap = styled.div`
	width: 40%;
	padding: 20px 0px;

	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		position: fixed;
		top: 25vh;
		grid-area: description;
		overflow: auto;
		height: 160px;
		width: 45vw;
	}
`;

const Description = styled.div`
	color: white;
	font-size: 13px;
	line-height: 1.8;
	/* 스마트폰 세로 */
	@media (max-width: 540px) {
		top: 55vh;
		position: fixed;
		left: 0;
		width: 100vw;
		padding-bottom: 10px;
		min-width: 20%;
		padding: 5%;
	}
	/* 스마트폰 소형 */
	@media (max-width: 321px) {
		position: fixed;
		top: 56vh;
		grid-area: description;
		overflow: auto;
		height: 185px;
		width: 100vw;
	}
`;

const PreVideo = styled.div`
	width: 50vw;
	height: 45vh;
	max-width: 700px;
	position: absolute;
	top: 70px;
	right: 60px;
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		grid-area: video;
		height: 70vh;
		width: 40vw;
		top: 8vh;
	}
	/* 스마트폰 세로 */
	@media (max-width: 540px) {
		position: absolute;
		top: 0px;
		left: 0.5%;

		width: 100%;
		padding: 2%;
	}
	/*태블릿 */
	@media (max-width: 775px) {
		right: 15px;
		height: 40vh;
		top: 10vh;
	}
`;

const Detail = ({ changeModalFalse }) => {
	const videoPlayerRef = useRef(null);
	const storeState = useSelector((state) => state.changeDetaildata, []);
	const [size, setSize] = useState([]);

	//videojs option
	const options = {
		autoplay: true,
		controls: false,
		muted: true,
		sources: [
			{
				src: `${storeState.video}`,
				type: 'application/x-mpegurl',
			},
		],
	};

	useEffect(() => {
		videojs(videoPlayerRef.current, options);
	}, []);

	// 윈도우 화면이 변경 될 때 실행되는 함수
	// 모달창 text에 웹반응형 적용을 위한 브라우저 width를 구하는 react의 Effect Hook함수
	const useWindowSize = () => {
		useLayoutEffect(() => {
			function updateSize() {
				setSize([window.innerWidth]);
			}
			window.addEventListener('resize', updateSize);
			updateSize();
			return () => window.removeEventListener('resize', updateSize);
		}, []);
		return size;
	};

	const [width] = useWindowSize();

	return (
		<Container>
			<ModalHeader>
				<Title>{storeState.title}</Title>
				<Close onClick={() => changeModalFalse()}>X</Close>
			</ModalHeader>
			<DescriptionWrap>
				{width < 961 ? (
					<Description>
						{storeState.description.length > 300
							? `${storeState.description.substring(0, 300)}...`
							: storeState.description}
					</Description>
				) : (
					<Description>{storeState.description}</Description>
				)}
			</DescriptionWrap>

			<PreVideo>
				<video
					className="video-js"
					ref={videoPlayerRef}
					style={{ width: '100%', height: '100%' }}
				></video>
			</PreVideo>
		</Container>
	);
};
export default Detail;
