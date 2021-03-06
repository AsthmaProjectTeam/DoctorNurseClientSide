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
import Toast from 'react-native-simple-toast';
import Dimensions from 'Dimensions';
import { HOST } from '../../CONST';

class AddManually extends Component {

    static navigationOptions = {
        headerTitle: 'Add Patient',
        headerBackTitle: "Results",  // This does not show...
        gesturesEnabled: false
    };

    // Fixes bug: error is displayed when returning to 'AddPatientPage'
    componentWillMount () {
        this.props.dispatch({
            type: 'clearError'
        })
    }

    // Handles server call errors
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

    onMrnChanged(mrn) {
        this.props.dispatch({
            type: 'mrnChanged',
            payload: mrn
        })
    }

    // Attempts to add patient to database AND to initiator's profile
    onConfirmPressed() {
        const doctorToken = this.props.navigation.state.params.doctorToken;
        const dispatch = this.props.dispatch;
        const navigate = this.props.navigation.navigate;
        fetch(HOST+"/v2/initiators/patients/new",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization': `token ${doctorToken}`
            },
            body: JSON.stringify({
                'first_name': this.props.firstName,
                'last_name': this.props.lastName,
                'mrn': this.props.mrn,
                'date_of_birth': this.props.dateOfBirth
            })
        })
            .then(this.handleErrors)
            .then(response => response.json())
            .then(response => response.patient)
            .then(response => response._id)
            .then((response) => fetch(HOST+"/v2/initiators/patients/add",{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    'Authorization': `token ${doctorToken}`
                },
                body: JSON.stringify({
                    'patients_id': [ response ]
                })
            }))
            .then(this.handleErrors)
            .then(Toast.show(`Successfully Added ${this.props.firstName} ${this.props.lastName}!`, Toast.LONG))
            .then(setTimeout(
                () => { dispatch({type: 'saveSuccess'});
                        navigate('PatientList', { doctorToken: doctorToken });
                      }, 2000))
            .catch(() => {
                dispatch({
                    type: 'saveFail'
                })
            })
    }

    render() {
        return (
            <Container>
                <Content>
                    <Card style={styles.cardStyle}>
                        <CardItem>
                            <Body>
                                <Content>
                                    <Form>
                                        <Item stackedLabel>
                                            <Label>First Name</Label>
                                            <Input autoCorrect={false}
                                                   placeholder="John"
                                                   onChangeText={(text) =>
                                                       this.onFirstNameChanged(text)}
                                            />
                                        </Item>
                                        <Item stackedLabel>
                                            <Label>Last Name</Label>
                                            <Input autoCorrect={false}
                                                   placeholder="Smith"
                                                   onChangeText={(text) =>
                                                       this.onLastNameChanged(text)}
                                            />
                                        </Item>
                                        <Item stackedLabel>
                                            <Label>Date of Birth (YYYY-MM-DD)</Label>
                                            <Input autoCorrect={false}
                                                   placeholder="1980-01-01"
                                                   onChangeText={(text) =>
                                                       this.onDoBChanged(text)}
                                            />
                                        </Item>
                                        <Item stackedLabel last>
                                            <Label>MRN</Label>
                                            <Input autoCorrect={false}
                                                   placeholder="123456789"
                                                   onChangeText={(text) =>
                                                       this.onMrnChanged(text)}
                                            />
                                        </Item>
                                    </Form>
                                </Content>
                            </Body>
                        </CardItem>
                    </Card>

                    <Text style={styles.errorTextStyle}>{this.props.error}</Text>

                    <Button success block title={null}
                            onPress={this.onConfirmPressed.bind(this)}
                            style={styles.buttonStyle}>
                        <Text>Confirm</Text>
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
    errorTextStyle: {
        color: 'red',
        alignSelf: 'center',
        fontWeight: '400'
    }
};

const mapStateToProps = state => {
    return {
        firstName: state.addPatient.firstName,
        lastName: state.addPatient.lastName,
        dateOfBirth: state.addPatient.dateOfBirth,
        error: state.addPatient.error,
        mrn: state.addPatient.mrn
    };
};

export default connect(mapStateToProps)(AddManually);