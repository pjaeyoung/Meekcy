import React, { useState, useEffect } from 'react';
import Poster from './Poster';
import Section from './Section';
import NewModal from './Modal';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
	padding: 15px;
	/* 스마트폰 세로 */
	@media (max-width: 540px) {
		text-align: center;
	}
`;

const Recommendation = ({ setDetailAction, changeModalTrue, changeModalFalse }) => {
	//영화 데이터를 set 하기 위한 useState
	const [movie, setMovie] = useState(null);
	useEffect(() => {
		axios
			.get('http://ec2-13-124-190-63.ap-northeast-2.compute.amazonaws.com:4000/videos', {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			})
			.then((res) => setMovie(res))
			.catch((err) => console.log(err));
	}, []);

	return (
		<>
			<NewModal changeModalFalse={changeModalFalse}></NewModal>
			<Container>
				<Section title="Recommendation">
					{movie?.data.map((movie, index) => {
						let favoriteMovie = {
							//api가 다르기 때문에 렌더하는 값을 다르게 하기 위한 객체 설정
							id: movie.id,
							poster_path: movie.thumbnail,
							original_title: movie.title,
							release_date: movie.releaseDay,
							runningTime: movie.runningTime,
							overview: movie.detail,
							video: movie.url,
							trailer: movie.trailer,
						};
						return (
							<Poster
								setDetailAction={setDetailAction}
								key={index}
								movie={favoriteMovie}
								changeModalTrue={changeModalTrue}
							></Poster>
						);
					})}
				</Section>
			</Container>
		</>
	);
};
export default Recommendation;
