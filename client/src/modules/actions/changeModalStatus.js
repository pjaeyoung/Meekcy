//액션 타입 선언
export const CHANGETRUE = 'CHANGETRUE';
export const CHANGEFALSE = 'CHANGEFALSE';

//액션 객체 생성 함수
export const setModalTrue = () => ({ type: CHANGETRUE });
export const setModalFalse = () => ({ type: CHANGEFALSE });

//초기값 선언
const initialState = false;

//모달창의 상태를 리덕스에 담기 위한 리듀서 함수
const changeModalStatus = (state = initialState, action) => {
	switch (action.type) {
		case CHANGETRUE:
			return true;
		case CHANGEFALSE:
			return false;
		default:
			return state;
	}
};
export default changeModalStatus;
//
