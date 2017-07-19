import React from 'react';
import { StackNavigator } from 'react-navigation';
import EntrancePage from './scene/EntrancePage';
import LoginPage from './scene/LoginPage';
import PatientListPage from './scene/PatientListPage';
import PatientDetailPage from './scene/PatientDetailPage';
import QRCodePage from './scene/QRCodePage';
import QuestionSetListPage from './scene/QuestionSetListPage';
import EditPatientPage from './scene/EditPatientPage';
import AddManually from './scene/AddPatientManuallyPage';
import SearchPatient from './scene/SearchToAddPatient';
import PrivateQuestionPage from './scene/PrivateQuestionPage';

const AppNavigator = StackNavigator({
    Entrance: { screen: EntrancePage },
    Login: { screen: LoginPage },
    PatientList: { screen: PatientListPage },
    PatientDetail: { screen: PatientDetailPage },
    RegisterPhone: { screen: QRCodePage },
    AddQuestionSet: { screen: QuestionSetListPage },
    EditPatient: { screen: EditPatientPage },
    AddManually: { screen: AddManually },
    SearchPatient: { screen: SearchPatient },
    PrivateQuestion: { screen: PrivateQuestionPage }
});

export default () => (<AppNavigator onNavigationStateChange={null}/>);