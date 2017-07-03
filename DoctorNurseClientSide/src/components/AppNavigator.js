import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import LoginPage from './scene/LoginPage';
import PatientListPage from './scene/PatientListPage';

const AppNavigator = StackNavigator({
    Login: { screen: LoginPage },
    PatientList: { screen: PatientListPage }
});

export default AppNavigator;