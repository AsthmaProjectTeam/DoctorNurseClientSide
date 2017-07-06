import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AsyncStorage } from 'react-native';
import { Container, Content, Thumbnail, Button, Form, Item, Input, Label, Text } from 'native-base';
import Dimensions from 'Dimensions';
import { StackNavigator } from 'react-navigation';

class LoginPage extends Component {
    static navigationOptions = {
        header: null
    };

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    onChangeUsername(username) {
        this.props.dispatch({
            type: 'usernameTyped',
            payload:{
                username: username
            }
        })
    }

    onChangePassword(password) {
        this.props.dispatch({
            type: 'passwordTyped',
            payload:{
                password: password
            }
        })
    }

    onButtonPress() {
        const dispatch = this.props.dispatch;
        const navigate = this.props.navigation.navigate;
        fetch('http://127.0.0.1:8080/v2/accounts/initiators/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json'
            },
            body: JSON.stringify({
                'username':this.props.username,
                'password': this.props.password
            })
        }).then(this.handleErrors)
            .then(response => response.json())
            .then(function (response) {
                AsyncStorage.setItem("loginToken", response.token)
                    .then(
                        dispatch({
                            type:'loginSuccess'
                        })
                    )
                    .then(() => navigate('PatientList', {doctorToken: response.token}))
            })
            .catch(() => {
                dispatch({
                    type: "loginFail"
                });
        });
    }

    render() {
        const { containerStyle, logoStyle, buttonStyle, formStyle, errorStyle } = styles;
        return(
            <Container style={containerStyle}>
                <Content>
                    <Thumbnail style={logoStyle} square source={{uri: 'data:image/jpeg;base64,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'}} />

                    <Form style={formStyle}>
                        <Item floatingLabel>
                            <Label>Username</Label>
                            <Input
                                autoCapitalize='none'
                                autoCorrect={false}
                                onChangeText={(text) => this.onChangeUsername(text)}
                            />
                        </Item>
                        <Item floatingLabel last>
                            <Label>Password</Label>
                            <Input
                                secureTextEntry={true}
                                autoCorrect={false}
                                onChangeText={(text) => this.onChangePassword(text)}
                            />
                        </Item>
                    </Form>

                    <Text style={errorStyle}>
                        {this.props.error}
                    </Text>

                    <Button block success style={buttonStyle} onPress={this.onButtonPress.bind(this)} title={null}>
                        <Text>Log in</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const styles = {
    containerStyle: {
        backgroundColor: "#eee"
    },

    formStyle: {
        width: Dimensions.get('window').width*0.8,
        alignSelf: 'center'
    },

    logoStyle: {
        marginTop: 85,
        width: Dimensions.get('window').width/2,
        height: Dimensions.get('window').width/2,
        alignSelf: 'center'
    },

    buttonStyle: {
        marginTop: 35,
        width: Dimensions.get('window').width*0.8,
        alignSelf: 'center'
    },

    errorStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red',
        marginTop: 10
    }
};

const mapStateToProps = state => {
    return {
        username: state.login.username,
        password: state.login.password,
        error: state.login.error,
        isLoggedIn: state.login.isLoggedIn
    };
};

export default connect(mapStateToProps)(LoginPage);