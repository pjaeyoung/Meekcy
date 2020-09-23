import React from 'react';
import Poster from './Poster';
import Section from './Section';
import NewModal from './Modal';
import styled from 'styled-components';

const Container = styled.div`
	padding: 15px;
	/* 스마트폰 세로 */
	@media (max-width: 540px) {
		text-align: center;
	}
`;
const EndTimeList = ({ setDetailAction, changeModalTrue, changeModalFalse, Endmovie }) => {
	return (
		<>
			<NewModal changeModalFalse={changeModalFalse}></NewModal>
			<Container>
				<Section title="시청중인 컨텐츠">
					{Endmovie.map((movie, index) => {
						//api가 다르기 때문에 렌더하는 값을 다르게 하기 위한 객체 설정
						let favoriteMovie = {
							id: movie.video.id,
							poster_path: movie.video.thumbnail,
							original_title: movie.video.title,
							release_date: movie.video.releaseDay,
							runningTime: movie.video.runningTime,
							overview: movie.video.detail,
							video: movie.video.url,
							endTime: movie.endTime,
							trailer: movie.video.trailer,
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
export default EndTimeList;
