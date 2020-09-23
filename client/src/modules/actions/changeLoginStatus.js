//액션 타입 선언
export const LOGINCHECK = 'logincheck';
export const LOGOUTCHECK = 'logoutcheck';

//액션 객체 생성 함수
export const loginCheck = () => {
	return {
		type: LOGINCHECK,
	};
};
export const logoutClickevent = () => {
	return {
		type: LOGOUTCHECK,
	};
};

// 초기 값 선언
const initialStore = { isLogin: false };

// 로그인 상태를 리덕스에 담기 위한 리듀서 함수
const changeLoginStatus = (state = initialStore, action) => {
	switch (action.type) {
		case LOGINCHECK:
			return { ...state, isLogin: true };
		case LOGOUTCHECK:
			return { ...state, isLogin: false };
		default:
			return state;
	}
};
export default changeLoginStatus;
