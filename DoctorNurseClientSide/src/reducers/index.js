import { combineReducers } from 'redux';
import LoginReducer from './LoginReducer';
import SinglePatientReducer from './SinglePatientReducer';

export default combineReducers({
    login: LoginReducer,
    singlepatient: SinglePatientReducer
});
