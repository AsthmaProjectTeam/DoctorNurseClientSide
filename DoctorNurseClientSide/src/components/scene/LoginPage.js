import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AsyncStorage } from 'react-native';
import { Container, Content, Thumbnail, Button, Form, Item, Input, Label, Text, Spinner } from 'native-base';
import Dimensions from 'Dimensions';
import { HOST } from '../../CONST';

class LoginPage extends Component {
    uriSource = 'https://s-media-cache-ak0.pinimg.com/236x/d3/66/78/d36678c183f27a176e8790390f94dcba--ppt-template-templates.jpg';

    static navigationOptions = {
        header: null,
        gesturesEnabled: false
    };

    // Handles errors for server calls
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

    // Attempts to login initiator
    onButtonPress() {
        const dispatch = this.props.dispatch;
        const navigate = this.props.navigation.navigate;
        dispatch({
            type: 'loginStarted'
        });
        fetch(HOST+'/v2/accounts/initiators/login',{
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

    renderButton() {
        if (this.props.isLoading) {
            return (<Spinner color="green"
                             animating={this.props.loading}
                             hidesWhenStopped={true}/>)
        }
        return (
            <Button block
                    success
                    style={styles.buttonStyle}
                    onPress={this.onButtonPress.bind(this)}
                    title={null}>
                <Text>Log in</Text>
            </Button>
        )
    }

    render() {
        const { containerStyle, logoStyle, formStyle, errorStyle } = styles;
        return(
            <Container style={containerStyle}>
                <Content>
                    <Thumbnail style={logoStyle}
                               square
                               source={{uri: this.uriSource }} />

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

                    {this.renderButton()}
                </Content>
            </Container>
        );
    }
}

const styles = {
    containerStyle: {
        backgroundColor: "white"
    },

    formStyle: {
        width: Dimensions.get('window').width*0.8,
        alignSelf: 'center'
    },

    logoStyle: {
        marginTop: 70,
        width: Dimensions.get('window').width/2,
        height: 236,
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
        isLoggedIn: state.login.isLoggedIn,
        isLoading: state.login.isLoading
    };
};

export default connect(mapStateToProps)(LoginPage);