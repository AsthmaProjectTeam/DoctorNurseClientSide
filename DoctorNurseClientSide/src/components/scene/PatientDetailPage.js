import React, { Component } from 'react';
import { View, ScrollView, Alert } from 'react-native';
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
    Title,
    List,
    ListItem
} from 'native-base';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';
import { HOST } from '../../CONST';

uriSource = 'https://d3n8a8pro7vhmx.cloudfront.net/themes/57d734b533893fddfc000001/attachments/original/1473881108/default-profile-pic.jpg?1473881108';

class PatientDetailPage extends Component {

    static navigationOptions = {
        header: null
    };

    // Attempts to gather patient's profile
    componentWillMount() {
        //console.log('patient detail page componentwillmount run');
        const id = this.props.navigation.state.params.id;
        const doctorToken = this.props.navigation.state.params.doctorToken;
        const dispatch = this.props.dispatch;
        const navigate = this.props.navigation.navigate;
        fetch(HOST+'/v2/initiators/profile',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `token ${doctorToken}`
            }
        })
            .then(response => globalerrorhandling(response))
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
                Alert.alert(
                    'Error',
                    'Your login info is invalid. Please login again.',
                    [
                        {text: 'OK', onPress: () => {
                            console.log('OK Pressed');
                            navigate('Login');
                        }},
                    ],
                    { cancelable: false }
                )
            });
    }

    // Produces temporary token for patient registration
    getTmpToken(){
        const dispatch = this.props.dispatch;
        const id = this.props.navigation.state.params.id;
        const doctorToken = this.props.navigation.state.params.doctorToken;
        const navigate = this.props.navigation.navigate;
        fetch(HOST+`/v2/accounts/patients/${id}/register/temp-token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `token ${doctorToken}`
            }
        }).then(response => globalerrorhandling(response))
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
                Alert.alert(
                    'Error',
                    'Your login info is invalid. Please login again.',
                    [
                        {text: 'OK', onPress: () => {
                            console.log('OK Pressed');
                            navigate('Login');
                        }},
                    ],
                    { cancelable: false }
                )
            });
    }

    // Retrieves patient's currently-assigned question list
    getQuestionSetList(){
        const question_set = this.props.patient.question_set;
        const id = this.props.navigation.state.params.id;
        const doctorToken = this.props.navigation.state.params.doctorToken;
        const navigate = this.props.navigation.navigate;
        fetch(HOST+'/v2/admin/question-set', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `token ${doctorToken}`
            }
        }).then(response => globalerrorhandling(response))
            .then(response => response.json())
            .then(response => response.question_set)
            .then(function (response) {
                if(question_set.length != 0) {
                    let indexarr = [];
                    for (q of response) {
                        indexarr.push(q._id);
                    }
                    for (i = 0; i < question_set.length; i++) {
                        let id = question_set[i]._id;
                        //find index of original array
                        let index = indexarr.indexOf(id);
                        //remove for both indexarr & response
                        indexarr.splice(index, 1);
                        response.splice(index, 1);
                    }
                }
                navigate('AddQuestionSet',
                    {
                        questionsetlist: response,
                        isAdding: true,
                        id: id,
                        doctorToken: doctorToken
                    }
                );
            })
            .catch(error => {
                console.log(error)
            });
    }

    // Removes time of day from date of birth timestamp
    sliceDoB (DoB) {
        if (typeof DoB === "string") {
            return DoB.slice(0,10);
        } else {
            return DoB;
        }
    }

    render() {
        const id = this.props.navigation.state.params.id;
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
                                <Thumbnail square
                                           large
                                           source={{uri: uriSource}}
                                           style={styles.thumbnailStyle}/>
                                <Body>
                                </Body>
                            </Left>
                            <Button block
                                    warning
                                    style={{marginTop: 10}}
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
                            <Body>
                                <Text style={listStyle}>MRN: {patient.mrn}</Text>
                                <Text style={listStyle}>First Name: {patient.first_name}</Text>
                                <Text style={listStyle}>Last Name: {patient.last_name}</Text>
                                <Text style={listStyle}>Date of Birth: {this.sliceDoB(patient.date_of_birth)}</Text>
                                <Text style={listStyle}>Question Sets:</Text>
                                <ScrollView style={{height: 45, marginLeft: 15, marginBottom: 10}}>
                                    {patient.question_set?patient.question_set.map((qset) => {
                                            return(
                                                <Text note
                                                      key={patient.question_set.indexOf(qset)}>
                                                    {qset.title}
                                                </Text>
                                            )
                                        }):<Text note>
                                                This patient has no question set
                                           </Text>}
                                </ScrollView>
                            </Body>
                        </CardItem>
                    </Card>

                    <View style={buttonListStyle}>
                        <Button block
                                info
                                style={buttonStyle}
                                onPress={this.getTmpToken.bind(this)}
                                title="Register Phone">
                            <Text>Register Phone</Text>
                        </Button>
                        <Button block
                                success
                                style={buttonStyle}
                                onPress={this.getQuestionSetList.bind(this)}
                                title="Add Question Set">
                            <Text>Add Question Set</Text>
                        </Button>
                    </View>

                    <View style={buttonListStyle}>
                        <Button block
                                warning
                                style={buttonStyle}
                                title="Make Patient Assessment"
                                onPress={() =>
                                this.props.navigation.navigate('PrivateQuestion',
                                {
                                    doctorToken: doctorToken
                                })}>
                            <Text>Make Patient Assessment</Text>
                        </Button>
                        <Button block danger style={buttonStyle} onPress={() =>
                            this.props.navigation.navigate('AddQuestionSet',
                            {
                                questionsetlist: patient.question_set,
                                isAdding: false,
                                id: id,
                                doctorToken: doctorToken
                            })}>
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
    },

    thumbnailStyle: {
        marginTop: 10,
        marginLeft: 10
    }
};

const mapStateToProps = state => {
    return {
        tmptoken: state.singlepatient.tmptoken,
        questionsetlist: state.singlepatient.questionsetlist,
        patient: state.singlepatient.patient,
        loading: state.singlepatient.loading,
        isAdding: state.singlepatient.isAdding
    };
};

export default connect(mapStateToProps)(PatientDetailPage);