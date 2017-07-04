import { combineReducers } from 'redux';
import LoginReducer from './LoginReducer';
import SinglePatientReducer from './SinglePatientReducer';
import PatientListReducer from './PatientListReducer';

export default combineReducers({
    login: LoginReducer,
    patients: PatientListReducer,
    singlepatient: SinglePatientReducer,
});
