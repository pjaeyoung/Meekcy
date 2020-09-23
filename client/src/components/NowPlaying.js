import React, { useState, useEffect } from 'react';
import Poster from './Poster';
import { moviesApi } from '../containers/moviesApi';
import Section from './Section';
import NewModal from './Modal';
import styled from 'styled-components';

const Container = styled.div`
	padding-left: 15px;
	padding-top: 20px;
	/** 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		padding-left: 30;
	}
	/**스마트폰 세로 */
	@media (max-width: 540px) {
		text-align: center;
	}
`;

const NowPlaying = ({ setDetailAction, changeModalTrue, changeModalFalse }) => {
	//영화 데이터를 set 하기 위한 useState
	const [movie, setMovie] = useState(null);

	useEffect(() => {
		//영화 데이터를 받아오기 위한 Api
		moviesApi.nowPlaying().then((res) => {
			setMovie(res);
		});
	}, []);

	return (
		<>
			<NewModal changeModalFalse={changeModalFalse}></NewModal>
			<Container>
				<Section title="Now Playing">
					{movie?.data.results.map((movie, index) => {
						//api가 다르기 때문에 렌더하는 값을 다르게 하기 위한 객체 설정
						let listMovie = {
							id: movie.id,
							poster_path: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
							original_title: movie.original_title,
							release_date: movie.release_date,
							runningTime: movie.runningTime,
							vote_average: `${movie.vote_average} /10`,
							overview: movie.overview,
						};
						return (
							<Poster
								setDetailAction={setDetailAction}
								key={index}
								movie={listMovie}
								changeModalTrue={changeModalTrue}
							></Poster>
						);
					})}
				</Section>
			</Container>
		</>
	);
};
export default NowPlaying;
