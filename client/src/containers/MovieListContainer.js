import React, { useState, useEffect } from 'react';
import NowPlaying from '../components/NowPlaying';
import Recommendation from '../components/Recommendation';
import EndTimeList from '../components/EndTimeList';
import { useSelector, useDispatch } from 'react-redux';
import { SETDETAIL } from '../modules/actions/changeDetaildata';
import { CHANGETRUE, CHANGEFALSE } from '../modules/actions/changeModalStatus';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
	padding-bottom: 20px;

	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		text-align: center;
		padding-left: 20px;
		padding-bottom: 20px;
	}
`;

const MovieListContainer = () => {
	//모달 데이터를 가져오기 위한 리덕스 스토어
	const storeState = useSelector((state) => state.changeDetaildata, []);

	//리덕스를 사용하기 위한 디스패치 선언
	const dispatch = useDispatch();

	//'시청중인 컨텐츠' 섹션 데이터를 받아오기 위한 useState
	const [Endmovie, setEndmovie] = useState(null);

	useEffect(() => {
		axios
			.get('http://ec2-13-124-190-63.ap-northeast-2.compute.amazonaws.com:4000/videos/watched', {
				//토큰을 가져오기 위한 헤더 세팅
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then((res) => {
				//response의 데이터를 렌더 하기 위한 조건
				if (res.data.length > 0) {
					setEndmovie(res.data);
				}
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<>
			<Container />
			{Endmovie ? (
				<EndTimeList
					Endmovie={Endmovie}
					storeState={storeState}
					setDetailAction={(e) => dispatch({ type: SETDETAIL, data: e })}
					changeModalTrue={() => dispatch({ type: CHANGETRUE })}
					changeModalFalse={() => dispatch({ type: CHANGEFALSE })}
				/>
			) : (
				<></>
			)}
			<Recommendation
				storeState={storeState}
				setDetailAction={(e) => dispatch({ type: SETDETAIL, data: e })}
				changeModalTrue={() => dispatch({ type: CHANGETRUE })}
				changeModalFalse={() => dispatch({ type: CHANGEFALSE })}
			/>
			<NowPlaying
				storeState={storeState}
				setDetailAction={(e) => dispatch({ type: SETDETAIL, data: e })}
				changeModalTrue={() => dispatch({ type: CHANGETRUE })}
				changeModalFalse={() => dispatch({ type: CHANGEFALSE })}
			/>
		</>
	);
};
export default MovieListContainer;
