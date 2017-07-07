import { combineReducers } from 'redux';
import EntranceReducer from './EntranceReducer';
import LoginReducer from './LoginReducer';
import PatientDetailReducer from './PatientDetailReducer';
import PatientListReducer from './PatientListReducer';
import EditPatientReducer from './EditPatientReducer';

export default combineReducers({
    entrance: EntranceReducer,
    login: LoginReducer,
    patients: PatientListReducer,
    singlepatient: PatientDetailReducer,
    editPatient: EditPatientReducer
});
