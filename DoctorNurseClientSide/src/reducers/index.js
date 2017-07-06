import { combineReducers } from 'redux';
import LoginReducer from './LoginReducer';
import SinglePatientReducer from './SinglePatientReducer';
import PatientListReducer from './PatientListReducer';
import EditPatientReducer from './EditPatientReducer';

export default combineReducers({
    login: LoginReducer,
    patients: PatientListReducer,
    singlepatient: SinglePatientReducer,
    editPatient: EditPatientReducer
});
