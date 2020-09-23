//액션 타입 선언
export const SETDETAIL = 'SETDETAIL';

//액션 객체 생성 함수
export const setDetailAction = (data) => ({ type: SETDETAIL, data: data });

//초기값 선언
const initialState = {
	id: null,
	title: null,
	poster: null,
	description: null,
	video: null,
	runnigTime: null,
	endTime: null,
	trailer: null,
};

//모달창 관련 데이터를 리덕스에 담기 위한 리듀서 함수
const changeDetaildata = (movieData = initialState, action) => {
	switch (action.type) {
		case SETDETAIL:
			return {
				id: action.data.id,
				title: action.data.original_title,
				poster: action.data.poster_path,
				description: action.data.overview,
				video: action.data.video,
				runnigTime: action.data.runningTime,
				endTime: action.data.endTime,
				trailer: action.data.trailer,
			};
		default:
			return movieData;
	}
};
export default changeDetaildata;
//
