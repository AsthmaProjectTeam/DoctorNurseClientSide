import { combineReducers } from 'redux';
import EntranceReducer from './EntranceReducer';
import LoginReducer from './LoginReducer';
import PatientDetailReducer from './PatientDetailReducer';
import PatientListReducer from './PatientListReducer';
import EditPatientReducer from './EditPatientReducer';
import AddPatientReducer from './AddPatientReducer';
import PrivateQuestionReducer from './PrivateQuestionReducer';

export default combineReducers({
    entrance: EntranceReducer,
    login: LoginReducer,
    patients: PatientListReducer,
    singlepatient: PatientDetailReducer,
    editPatient: EditPatientReducer,
    addPatient: AddPatientReducer,
    privateQuestions: PrivateQuestionReducer
});
