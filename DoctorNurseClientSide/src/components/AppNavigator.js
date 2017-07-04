import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import LoginPage from './scene/LoginPage';
import PatientListPage from './scene/PatientListPage';
import PatientDetailPage from './scene/PatientDetailPage';
import QRCodePage from './scene/QRCodePage';
import QuestionSetListPage from './scene/QuestionSetListPage';

const AppNavigator = StackNavigator({
    PatientDetail: { screen: PatientDetailPage },
    Login: { screen: LoginPage },
    PatientList: { screen: PatientListPage },
    RegisterPhone: { screen: QRCodePage },
    AddQuestionSet: { screen: QuestionSetListPage }
});

export default AppNavigator;