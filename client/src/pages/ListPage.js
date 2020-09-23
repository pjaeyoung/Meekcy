import React from 'react';
import Header from '../components/Header';
import MovieListContainer from '../containers/MovieListContainer';

const ListPage = () => {
	return (
		<>
			<Header></Header>
			<MovieListContainer></MovieListContainer>
		</>
	);
};

export default ListPage;
