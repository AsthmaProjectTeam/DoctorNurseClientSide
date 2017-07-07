import React, { Component } from 'react';
import { Image, AsyncStorage, View } from 'react-native';
import {
    Container,
    Content,
    Card,
    CardItem,
    Thumbnail,
    Text,
    Icon,
    Left,
    Body,
    Button,
    Header,
    Right,
    Title
} from 'native-base';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';

uriSource = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkXW9pUfeSh43eismrp4OnnSMGmDeoBKbLYEPRjacAmWhpjTMm';

class PatientDetailPage extends Component {

    static navigationOptions = {
        header: null
    };

    componentWillMount() {
        const id = this.props.navigation.state.params.id;
        const doctorToken = this.props.navigation.state.params.doctorToken;
        const dispatch = this.props.dispatch;
        fetch('http://127.0.0.1:8080/v2/initiators/profile',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `token ${doctorToken}`
            }
        })
            .then(this.handleErrors)
            .then(response => response.json())
            .then(response => response.profile)
            .then(response => response.patients)
            .then(function(response) {
                const index = response.findIndex(patient => patient._id === id);
                dispatch({
                    type: 'patientProfileLoaded',
                    payload: {
                        patient: response[index]
                    }
                });
            })
            .catch(error => {
                console.log(error)
            });
    }

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    getTmpToken(){
        const dispatch = this.props.dispatch;
        const id = this.props.navigation.state.params.id;
        const doctorToken = this.props.navigation.state.params.doctorToken;
        const navigate = this.props.navigation.navigate;
        fetch(`http://127.0.0.1:8080/v2/accounts/patients/${id}/register/temp-token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `token ${doctorToken}`
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
        const question_set = this.props.patient.question_set;
        const dispatch = this.props.dispatch;
        const doctorToken = this.props.navigation.state.params.doctorToken;
        const navigate = this.props.navigation.navigate;
        fetch('http://127.0.0.1:8080/v2/admin/question-set', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `token ${doctorToken}`
            }
        }).then(response => response.json())
            .then(response => response.question_set)
            .then(function (response) {
                if(question_set.length != 0){
                    let i = 0;
                    while(i < question_set.length){
                        if(question_set[i] == response[i]){
                            response.splice(i, 1);
                            i++;
                        }
                    }
                }
                dispatch({
                    type: 'getQuestionSetList',
                    payload: {
                        questionsetlist: response
                    }
                });
            })
            .then(() => navigate('AddQuestionSet'))
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        const doctorToken = this.props.navigation.state.params.doctorToken;
        const navigate = this.props.navigation.navigate;
        const patient = this.props.patient;
        const { cardStyle, listStyle, buttonStyle, buttonListStyle } = styles;

        return (
            <Container>
                <Content>
                    <Header>
                        <Left>
                            <Button transparent title={null}
                                    onPress={() => navigate('PatientList',
                                        {doctorToken: doctorToken})}>
                                <Icon name='arrow-back' />
                                <Text>Patients</Text>
                            </Button>
                        </Left>
                        <Body>
                            <Title>{patient.first_name} {patient.last_name}</Title>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <Card style={cardStyle}>
                        <CardItem>
                            <Left>
                                <Thumbnail source={{uri: uriSource}}/>
                                <Body>
                                </Body>
                            </Left>
                            <Button small block warning style={{marginTop: 10}}
                                    onPress={() => navigate('EditPatient',
                                        {
                                            uriSource: uriSource,
                                            patientInfo: patient,
                                            doctorToken: doctorToken
                                        })}>
                                <Text>Edit</Text>
                            </Button>
                        </CardItem>
                        <CardItem>
                            {/*<Image source={{uri: 'Image URL'}} style={{height: 200, width: 200, flex: 1}}/>*/}
                            <Body>
                            <Text style={listStyle}>MRN: 123123123</Text>
                            <Text style={listStyle}>First Name: {patient.first_name}</Text>
                            <Text style={listStyle}>Last Name: {patient.last_name}</Text>
                            <Text style={listStyle}>Date of Birth: 2000-08-08</Text>
                            <Text style={listStyle}>Question Sets:</Text>
                            <Text note style={listStyle}>Question Sets from Dr.Jones</Text>
                            <Text note style={listStyle}>Question Sets from Dr.Li</Text>
                            </Body>
                        </CardItem>
                    </Card>

                    <View style={buttonListStyle}>
                        <Button block info style={buttonStyle} onPress={this.getTmpToken.bind(this)}
                                title="Register Phone">
                            <Text>Register Phone</Text>
                        </Button>
                        <Button block success style={buttonStyle} onPress={this.getQuestionSetList.bind(this)}
                                title="Add Question Set">
                            <Text>Add Question Set</Text>
                        </Button>
                    </View>

                    <View style={buttonListStyle}>
                        <Button block warning style={buttonStyle} title="Make Patient Assessment">
                            <Text>Make Patient Assessment</Text>
                        </Button>
                        <Button block danger style={buttonStyle}>
                            <Text>Delete Question Set</Text>
                        </Button>
                    </View>
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
        margin: 10,
        width: Dimensions.get('window').width*0.4
    },

    buttonListStyle: {
        flexDirection: 'row',
        padding: 5,
        alignSelf: 'center'
    }
};

const mapStateToProps = state => {
    return {
        tmptoken: state.singlepatient.tmptoken,
        questionsetlist: state.singlepatient.questionsetlist,
        patient: state.singlepatient.patient,
        loading: state.singlepatient.loading
    };
};

export default connect(mapStateToProps)(PatientDetailPage);
