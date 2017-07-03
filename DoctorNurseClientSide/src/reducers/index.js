import { combineReducers } from 'redux';
import LoginReducer from './LoginReducer';
import PatientListReducer from './PatientListReducer';

export default combineReducers({
    login: LoginReducer,
    patients: PatientListReducer
});
