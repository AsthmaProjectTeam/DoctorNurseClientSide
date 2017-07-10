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

class AddPatient extends Component {

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

    onMrnChanged(mrn) {
        this.props.dispatch({
            type: 'mrnChanged',
            payload: mrn
        })
    }

    onConfirmPressed() {
        const doctorToken = this.props.navigation.state.params.doctorToken;
        const dispatch = this.props.dispatch;
        fetch("http://127.0.0.1:8080/v2/initiators/patients/new",{
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
            .then((response) => fetch("http://127.0.0.1:8080/v2/initiators/patients/add",{
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
            .then((response) => console.log(response))
            .then(this.handleErrors)
            .then(
                dispatch({
                    type: 'saveSuccess'
                })
            )
            .then(this.props.navigation.navigate('PatientList', {
                    doctorToken: this.props.navigation.state.params.doctorToken
                })
            )
            .catch(() => {
                dispatch({
                    type: 'saveFail'
                })
            })
    }

    onCancelPressed() {
        this.props.dispatch({
            type: 'cancelPressed'
        });
        this.props.navigation.navigate('PatientList', { doctorToken: this.props.navigation.state.params.doctorToken })
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent title={null} onPress={this.onCancelPressed.bind(this)}>
                            <Icon name='arrow-back' />
                            <Text>Cancel</Text>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Add Patient</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>

                <Content>
                    <Card style={styles.cardStyle}>
                        <CardItem>
                            <Body>
                                <Content>
                                    <Form>
                                        <Item stackedLabel>
                                            <Label>First Name</Label>
                                            <Input autoCorrect={false}
                                                   onChangeText={(text) => this.onFirstNameChanged(text)}
                                            />
                                        </Item>
                                        <Item stackedLabel>
                                            <Label>Last Name</Label>
                                            <Input autoCorrect={false}
                                                   onChangeText={(text) => this.onLastNameChanged(text)}
                                            />
                                        </Item>
                                        <Item stackedLabel>
                                            <Label>Date of Birth (YYYY-MM-DD)</Label>
                                            <Input autoCorrect={false}
                                                   onChangeText={(text) => this.onDoBChanged(text)}
                                            />
                                        </Item>
                                        <Item stackedLabel last>
                                            <Label>MRN</Label>
                                            <Input autoCorrect={false}
                                                   onChangeText={(text) => this.onMrnChanged(text)}
                                            />
                                        </Item>
                                    </Form>
                                </Content>
                            </Body>
                        </CardItem>
                    </Card>

                    <Text style={styles.errorTextStyle}>{this.props.error}</Text>

                    <Button success title={null} onPress={this.onConfirmPressed.bind(this)} style={styles.buttonStyle}>
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

export default connect(mapStateToProps)(AddPatient);