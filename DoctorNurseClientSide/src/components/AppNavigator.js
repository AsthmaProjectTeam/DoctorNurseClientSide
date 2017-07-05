import React from 'react';
import { StackNavigator } from 'react-navigation';
import LoginPage from './scene/LoginPage';
import PatientListPage from './scene/PatientListPage';
import PatientDetailPage from './scene/PatientDetailPage';
import QRCodePage from './scene/QRCodePage';
import QuestionSetListPage from './scene/QuestionSetListPage';
import EditPatientPage from './scene/EditPatientPage';

const AppNavigator = StackNavigator({
    Login: { screen: LoginPage },
    PatientList: { screen: PatientListPage },
    PatientDetail: { screen: PatientDetailPage },
    RegisterPhone: { screen: QRCodePage },
    AddQuestionSet: { screen: QuestionSetListPage },
    EditPatient: { screen: EditPatientPage }
});

export default AppNavigator;