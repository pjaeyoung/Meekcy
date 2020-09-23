import axios from 'axios';

//영화 데이터를 받아오기 위한 요청 생성
const api = axios.create({
	baseURL: 'https://api.themoviedb.org/3/',
	params: {
		api_key: process.env.REACT_APP_APIKEY,
		language: 'en-US',
	},
});

//영화 데이터를 받아오기 위한 get 요청
export const moviesApi = {
	nowPlaying: () => api.get('movie/now_playing'),
};
