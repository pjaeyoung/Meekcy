import { combineReducers } from 'redux';
import changeDetaildata from '../actions/changeDetaildata';
import changeModalStatus from '../actions/changeModalStatus';
import changeLoginStatus from '../actions/changeLoginStatus';

//리덕스를 사용하기 위해 리듀서들을 모아주는 루트 리듀서 함수
const rootReducer = combineReducers({
	changeDetaildata,
	changeModalStatus,
	changeLoginStatus,
});
export default rootReducer;
