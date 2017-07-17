import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import AppNavigator from './components/AppNavigator';
import globalerrorhandling from './components/GlobalErrorHandler';
import saveGlobalDoctorToken from './components/GlobalDataStorage';
import getGlobalDoctorToken from './components/GlobalDataStorage';

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