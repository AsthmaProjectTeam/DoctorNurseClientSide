import React, { Component } from 'react';
import { View } from 'react-native';
import Entrance from './Entrance';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux';

class EntrancePage extends Component {

    static navigationOptions = {
        header: null
    };

    componentWillMount(){
        const navigate = this.props.navigation.navigate;

        AsyncStorage.getItem('loginToken')
            .then(
                function (result) {
                    if (result === null) {
                        setTimeout(() => {
                            console.log('cannot find saved data, be ready to login screen');
                            navigate('Login');
                        }, 2800)
                    } else {
                        console.log("access to saved data, be ready to patient list page");
                        setTimeout(() => {
                            navigate('PatientList', {doctorToken: result});
                        }, 2800);
                    }
                })
            .catch((error) => {
                console.log('error:' + error.message);
            });
    }

    _hideEntrance() {
        this.props.dispatch({
            type: 'hideAnimation',
            payload: {
                show: false
            }
        })
    }

    render(){
        let entrance = this.props.show? <Entrance hideThis={()=> this._hideEntrance()}/>:<View></View>

        return (
            <View>
                {entrance}
            </View>
        )
    }
}

const mapStateToProps = state => {
  return {
      show: state.entrance.show
  }
};

export default connect(mapStateToProps)(EntrancePage);