import { combineReducers } from 'redux';
import LoginReducer from './LoginReducer';
import SinglePatientReducer from './SinglePatientReducer';
import PatientListReducer from './PatientListReducer';
import EditPatientReducer from './EditPatientReducer';
import AddPatientReducer from './AddPatientReducer';

export default combineReducers({
    login: LoginReducer,
    patients: PatientListReducer,
    singlepatient: SinglePatientReducer,
    editPatient: EditPatientReducer,
    addPatient: AddPatientReducer
});
