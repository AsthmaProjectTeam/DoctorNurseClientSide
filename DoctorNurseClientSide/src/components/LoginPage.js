import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import Input from './common/Input';
import Button from './common/Button';
import Card from './common/Card';
import CardSection from './common/CardSection';

class LoginPage extends Component {
    onChangeUsername(username){
        this.props.dispatch({
            type: 'usernameTyped',
            payload:{
                username: username
            }
        })
    }

    onChangePassword(password){
        this.props.dispatch({
            type: 'passwordTyped',
            payload:{
                password: password
            }
        })
    }

    render(){
        console.log(this.props);
        return(
            <Card>
                <CardSection>
                    <Input
                        placeholder="username"
                        label="Username"
                        value={this.props.username}
                        onChangeText={() => this.onChangeUsername(username)}
                    />
                </CardSection>

                <CardSection>
                    <Input
                        secureTextEntry
                        placeholder="password"
                        label="Password"
                        value={this.props.password}
                        onChangeText={() => this.onChangePassword(password)}
                    />
                </CardSection>

                <CardSection>
                    <Button>
                        Log in
                    </Button>
                </CardSection>
            </Card>
        );
    }
}

const mapStateToProps = state => {
    return {
        username: state.login.username,
        password: state.login.password
    };
};

export default connect(mapStateToProps)(LoginPage);