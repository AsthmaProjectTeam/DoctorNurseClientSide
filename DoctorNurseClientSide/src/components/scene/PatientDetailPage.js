import React, { Component } from 'react';
import { Image, AsyncStorage } from 'react-native';
import { Container, Content, Card, CardItem, Thumbnail, Text, Icon, Left, Body, Button } from 'native-base';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';

const doctortoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsicGhvbmUiOiJpbml0Iiwic2FsdCI6ImluaXQiLCJoYXNoIjoiaW5pdCIsImxhc3RfbmFtZSI6ImluaXQiLCJmaXJzdF9uYW1lIjoiaW5pdCIsImVtYWlsIjoiaW5pdCIsInVzZXJuYW1lIjoiaW5pdCIsInBhdGllbnRzIjoiaW5pdCIsImNyZWF0ZWRfZGF0ZSI6ImluaXQiLCJyb2xlIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJfaWQiOiJpbml0In0sInN0YXRlcyI6eyJpZ25vcmUiOnt9LCJkZWZhdWx0Ijp7fSwiaW5pdCI6eyJfX3YiOnRydWUsInBhdGllbnRzIjp0cnVlLCJjcmVhdGVkX2RhdGUiOnRydWUsInJvbGUiOnRydWUsInBob25lIjp0cnVlLCJzYWx0Ijp0cnVlLCJoYXNoIjp0cnVlLCJlbWFpbCI6dHJ1ZSwibGFzdF9uYW1lIjp0cnVlLCJmaXJzdF9uYW1lIjp0cnVlLCJ1c2VybmFtZSI6dHJ1ZSwiX2lkIjp0cnVlfSwibW9kaWZ5Ijp7fSwicmVxdWlyZSI6e319LCJzdGF0ZU5hbWVzIjpbInJlcXVpcmUiLCJtb2RpZnkiLCJpbml0IiwiZGVmYXVsdCIsImlnbm9yZSJdfSwiZW1pdHRlciI6eyJkb21haW4iOm51bGwsIl9ldmVudHMiOnt9LCJfZXZlbnRzQ291bnQiOjAsIl9tYXhMaXN0ZW5lcnMiOjB9fSwiaXNOZXciOmZhbHNlLCJfZG9jIjp7InBhdGllbnRzIjpbNTEsNTIsNTMsNTQsNTUsNTYsNTddLCJjcmVhdGVkX2RhdGUiOiIyMDE3LTA2LTI4VDE2OjM2OjU1LjIyMloiLCJyb2xlIjoibnVyc2UiLCJfX3YiOjcsInBob25lIjoiNjEyMTIzNjUyMyIsInNhbHQiOiIxOTEzMDk0ODQ3NjQiLCJoYXNoIjoiZTg3OTg3YWY3NTk1ODIxNTBmNmYxYzE4OWEwOGViOGE1MjQ5OGYwYTY2MjcxYzc2NDY5N2JjNDMxZDk3MmE0YTc5ZWY1MTQzYjMwYTJjYzE5MWFhNjA5MTk2MTFiYmQxMTQ0OWY5ZDEwZjFhMjkyOGUwMTg2MDA2NjFmNDg1YTkiLCJlbWFpbCI6InRlc3RhLlRAbWFpbC5jb20iLCJsYXN0X25hbWUiOiJUIiwiZmlyc3RfbmFtZSI6InRlc3RhIiwidXNlcm5hbWUiOiJ0ZXN0YSIsIl9pZCI6Mn0sIiRpbml0Ijp0cnVlLCJpYXQiOjE0OTkxOTQwNDcsImV4cCI6MTQ5OTE5NzY0N30.5Sia-aKWvJxv6spZ30pKdgL1IYzu6rrkcsRX2bK-5Fg';
class PatientDetailPage extends Component {
    static navigationOptions = {
        title: "Patient's Profile"
    };

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    getTmpToken(){
        //const token = AsyncStorage.getItem('loginToken');
        const dispatch = this.props.dispatch;
        const navigate = this.props.navigation.navigate;
        fetch('http://127.0.0.1:8080/v2/accounts/patient/register/temp-token', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                //'Authorization': `token ${token}`
                'Authorization': `token ${doctortoken}`
            }
        }).then(this.handleErrors)
            .then(response => response.json())
            .then(response => response.token)
            .then(function (response) {
                dispatch({
                    type: 'tmpToken',
                    payload: {
                        tmptoken: response
                    }
                })
            })
            .then(() => navigate('RegisterPhone'))
            .catch(error => {
                console.log(error)
            });
    }

    getQuestionSetList(){
        const dispatch = this.props.dispatch;
        const navigate = this.props.navigation.navigate;
        fetch('http://127.0.0.1:8080/v2/admin/question-set', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `token ${doctortoken}`
            }
        }).then(response => response.json())
            .then(response => response.question_set)
            .then(function (response) {
                dispatch({
                    type: 'getQuestionSetList',
                    payload: {
                        questionsetlist: response
                    }
                })
            })
            .then(() => navigate('AddQuestionSet'))
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        const { cardStyle, listStyle, buttonStyle } = styles;
        return (
            <Container>
                <Content>
                    <Card style={cardStyle}>
                        <CardItem>
                            <Left>
                                <Thumbnail source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkXW9pUfeSh43eismrp4OnnSMGmDeoBKbLYEPRjacAmWhpjTMm'}} />
                                <Body>
                                <Text>(patient name)</Text>
                                </Body>
                            </Left>
                                <Button small block warning style={{marginTop: 10}}>
                                    <Text>Edit</Text>
                                </Button>
                        </CardItem>
                        <CardItem>
                            {/*<Image source={{uri: 'Image URL'}} style={{height: 200, width: 200, flex: 1}}/>*/}
                            <Body>
                            <Text style={listStyle}>MRN: 12321312421312412</Text>
                            <Text style={listStyle}>First Name: Minion</Text>
                            <Text style={listStyle}>Last Name: Li</Text>
                            <Text style={listStyle}>Date of Birth: 2000/08/08</Text>
                            <Text style={listStyle}>Question Sets:</Text>
                            <Text note style={listStyle}>Question Sets from Dr.Jones</Text>
                            <Text note style={listStyle}>Question Sets from Dr.Li</Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Button block info style={buttonStyle} onPress={this.getTmpToken.bind(this)}>
                        <Text>Register Phone</Text>
                    </Button>
                    <Button block success style={buttonStyle} onPress={this.getQuestionSetList.bind(this)}>
                        <Text>Add Question Set</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const styles = {
    cardStyle: {
        marginTop: 15,
        alignSelf: 'center',
        width: Dimensions.get('window').width*0.9,
        backgroundColor: '#ddd',
        borderRadius: 5
    },

    listStyle: {
        padding: 10
    },

    buttonStyle: {
        marginTop: 35,
        width: Dimensions.get('window').width*0.9,
        alignSelf: 'center'
    }
};

const mapStateToProps = state => {
    return {
        tmptoken: state.singlepatient.tmptoken,
        questionsetlist: state.singlepatient.questionsetlist
    };
};

export default connect(mapStateToProps)(PatientDetailPage);
