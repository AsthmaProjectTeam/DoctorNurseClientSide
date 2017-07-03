import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import { connect } from 'react-redux';
import RouterComponent from './Router';
import LoginPage from './components/scene/LoginPage';
import secondPage from './components/scene/PatientListPage';
import AppNavigator from './components/AppNavigator';

class App extends Component {

    render(){
        return (
            <Provider store={createStore(reducers)}>
                <View style={{flex:1}}>
                    <AppNavigator />
                </View>
            </Provider>
        );
    }
}

export default App;