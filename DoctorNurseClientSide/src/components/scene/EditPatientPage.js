import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Container,
    Content,
    Card,
    Form,
    Thumbnail,
    Text,
    Item,
    Label,
    Input,
    Header,
    Right,
    Left,
    Body,
    CardItem,
    Button,
    Icon,
    Title
} from 'native-base';
import Dimensions from 'Dimensions';

class EditPatient extends Component {

    static navigationOptions = {
        header: null
    };

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    onFirstNameChanged(firstName) {
        this.props.dispatch({
            type: 'firstNameChanged',
            payload: firstName
        })
    }

    onLastNameChanged(lastName) {
        this.props.dispatch({
            type: 'lastNameChanged',
            payload: lastName
        })
    }

    onDoBChanged(dateOfBirth) {
        this.props.dispatch({
            type: 'dateOfBirthChanged',
            payload: dateOfBirth
        })
    }

    onCancelPressed() {
        patientInfo = this.props.navigation.state.params.patientInfo;
        uriSource = this.props.navigation.state.params.uriSource;
        doctorToken = this.props.navigation.state.params.doctorToken;
        this.props.dispatch({
            type: 'cancelPressed'
        });
        this.props.navigation.navigate('PatientDetail', {
            uriSource: uriSource,
            patient: patientInfo,
            doctortoken: doctorToken
        });
    }

    onSavePressed() {
        const dispatch = this.props.dispatch;
        const navigate = this.props.navigation.navigate;
        uriSource = this.props.navigation.state.params.uriSource;
        patientInfo = this.props.navigation.state.params.patientInfo;
        doctorToken = this.props.navigation.state.params.doctorToken;
        fetch(`http://127.0.0.1:8080/v2/initiators/patients/${patientInfo._id}/profile`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization': `token ${doctorToken}`
            },
            body: JSON.stringify({
                'first_name': this.props.firstName,
                'last_name': this.props.lastName,
                'mrn': '123123123',
                'date_of_birth': this.props.dateOfBirth
            }) // add MRN later when supported by all database API's
        })
            .then(this.handleErrors)
            .then(response => console.log(response))
            .then(
                dispatch({
                    type: 'saveSuccess'
                })
            )
            .then(() => navigate('PatientDetail', {
                uriSource: uriSource,
                patient: patientInfo,
                doctortoken: doctorToken
            }))
            .catch(() => {
                dispatch({
                    type: 'saveFail'
                })
            })
    }

    componentWillMount() {
        patientInfo = this.props.navigation.state.params.patientInfo;
        this.props.dispatch({
            type: 'componentWillMount',
            payload: {
                firstName: patientInfo.first_name,
                lastName: patientInfo.last_name,
                dateOfBirth: '2000-08-08'
            }
        });
    }

    componentDidMount() {
        console.log(this.props.firstName,
            this.props.lastName,
            this.props.dateOfBirth)
    }


    render() {

        patientInfo = this.props.navigation.state.params.patientInfo;
        uriSource = this.props.navigation.state.params.uriSource;

        return(
            <Container>
                <Header>
                    <Left>
                        <Button transparent title={null} onPress={this.onCancelPressed.bind(this)}>
                            <Icon name='arrow-back' />
                            <Text>Cancel</Text>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Edit Patient</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>

                <Content>
                    <Thumbnail square large style={styles.thumbnailStyle} source={{uri: uriSource}} />
                    <Text style={styles.errorTextStyle} >{this.props.error}</Text>
                    <Card style={styles.cardStyle}>
                        <CardItem>
                            <Body>
                                <Content>
                                    <Form>
                                        <Item stackedLabel>
                                            <Label>First Name</Label>
                                            <Input placeholder={patientInfo.first_name}
                                                   autoCorrect={false}
                                                   onChangeText={(text) => this.onFirstNameChanged(text)}
                                            />
                                        </Item>
                                        <Item stackedLabel last>
                                            <Label>Last Name</Label>
                                            <Input placeholder={patientInfo.last_name}
                                                   autoCorrect={false}
                                                   onChangeText={(text) => this.onLastNameChanged(text)}
                                            />
                                        </Item>
                                        <Item stackedLabel last>
                                            <Label>Date of Birth ('YYYY-MM-DD')</Label>
                                            <Input placeholder="2000-08-08"
                                                   autoCapitalize='none'
                                                   autoCorrect={false}
                                                   onChangeText={(text) => this.onDoBChanged(text)}
                                            />
                                        </Item>
                                    </Form>
                                </Content>
                            </Body>
                        </CardItem>
                    </Card>

                    <Button success title={null} onPress={this.onSavePressed.bind(this)} style={styles.buttonStyle} >
                        <Text style={{ alignSelf: 'center' }}>Save</Text>
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
    buttonStyle: {
        marginTop: 20,
        width: Dimensions.get('window').width*0.9,
        alignSelf: 'center'
    },
    thumbnailStyle: {
        marginTop: 15,
        alignSelf: 'center',
        paddingBottom: 8
    },
    errorTextStyle: {
        color: 'red',
        alignSelf: 'center',
        fontWeight: '400'
    }
};

const mapStateToProps = state => {
    return {
        firstName: state.editPatient.firstName,
        lastName: state.editPatient.lastName,
        dateOfBirth: state.editPatient.dateOfBirth,
        error: state.editPatient.error
    };
};

export default connect(mapStateToProps)(EditPatient);