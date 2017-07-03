import React, { Component } from 'react';
import { View, Text } from 'react-native';

class PatientListPage extends Component {
    static navigationOptions = {
        headerBackTitle: null
    };
    render(){
        return(
            <View>
                <Text>
                    haha this is second page
                </Text>
            </View>
        )
    }
}

export default PatientListPage;