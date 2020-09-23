import React from 'react';
import styled from 'styled-components';
const Image = styled.div`
	background-image: url(${(props) => props.bgUrl});
	height: 180px;
	background-size: cover;
	border-radius: 4px;
	background-position: center center;
	transition: opacity 0.1s linear;
`;
const Title = styled.span`
	font-size: 13px;
	display: block;
	margin-bottom: 3px;
`;
const Year = styled.span`
	font-size: 11px;
	color: gray;
`;
const Rating = styled.span`
	bottom: 5px;
	right: 5px;
	position: absolute;
	opacity: 0;
	transition: opacity 0.1s linear;
`;
const ImageContainer = styled.div`
	margin-bottom: 5px;
	position: relative;
	&:hover {
		${Image} {
			opacity: 0.3;
		}
		${Rating} {
			opacity: 1;
		}
	}
`;
const Container = styled.div`
	font-size: 12px;
`;
const EndBarWrap = styled.div``;
const EndBar = styled.progress`
	display: block;
	width: 125px;
	height: 8px;
	padding: 1px;
	border: 0 none;
	border-radius: 5px;
	margin-bottom: 5px;
	background-color: gray;
	border: none;
	box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.5), 0px 1px 0px rgba(255, 255, 255, 0.2);
	&::-moz-progress-bar {
		background-color: #900c3f;
		border-radius: 5px;
		box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.4), 0 2px 5px 0px rgba(0, 0, 0, 0.3);
	}
	&::-webkit-progress-value {
		background-color: #900c3f;
		border-radius: 4px;
		box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.4), 0 2px 5px 0px rgba(0, 0, 0, 0.3);
	}
`;

const Poster = ({ changeModalTrue, movie, setDetailAction }) => {
	return (
		<div>
			<span
				onClick={() => {
					changeModalTrue();
					setDetailAction(movie);
				}}
			>
				<Container key={movie.id}>
					<ImageContainer>
						<Image bgUrl={movie.poster_path} />{' '}
						<Rating>
							<span role="img" aria-label="rating">
								⭐️
							</span>{' '}
							{movie.vote_average}
						</Rating>
					</ImageContainer>
					{movie.endTime >= 0 ? (
						<EndBarWrap>
							<EndBar value={movie.endTime} max={movie.runningTime}></EndBar>
						</EndBarWrap>
					) : (
						<></>
					)}

					<Title>
						{movie.original_title.length > 18
							? `${movie.original_title.substring(0, 18)}...`
							: movie.original_title}
					</Title>
					<Year>{movie.release_date}</Year>
				</Container>
			</span>
		</div>
	);
};
export default Poster;
