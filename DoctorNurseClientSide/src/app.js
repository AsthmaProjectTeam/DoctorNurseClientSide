import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import RouterComponent from './Router';
import LoginPage from './components/LoginPage';

class App extends Component {

    render(){
        return (
            <Provider store={createStore(reducers)}>
                <View style={{ flex: 1 }}>
                    <LoginPage/>
                </View>
            </Provider>
        );
    }
};

export default App;