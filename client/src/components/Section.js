import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	:not(:last-child) {
		margin-bottom: 50px;
	}
	/* 스마트폰 세로 */
	@media (max-width: 375px) {
		margin-top: 30px;
	}
`;

const Title = styled.span`
	font-size: 18px;
	font-weight: 600;
	&:hover {
		padding-bottom: 4px;
		border-bottom: 2px solid #900c3f;
	}

	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		/* margin-left: 30px; */
		border-bottom: 2px solid #900c3f;
	}
	/* 스마트폰 세로 */
	@media (max-width: 540px) {
		border-bottom: 2px solid #900c3f;
	}
`;

const Grid = styled.div`
	margin-top: 25px;
	display: grid;
	grid-template-columns: repeat(auto-fill, 125px);
	grid-gap: 25px;
	/* 스마트폰 세로 */
	@media (max-width: 540px) {
		justify-content: center;
	}
`;

const Section = ({ title, children }) => (
	<Container>
		<Title>{title}</Title>
		<Grid>{children}</Grid>
	</Container>
);

export default Section;
