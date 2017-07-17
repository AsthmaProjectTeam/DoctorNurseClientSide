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

    // Fetches patient's current info to act as placeholders
    componentWillMount() {
        const patientInfo = this.props.navigation.state.params.patientInfo;
        this.props.dispatch({
            type: 'componentWillMount',
            payload: {
                firstName: patientInfo.first_name,
                lastName: patientInfo.last_name,
                dateOfBirth: patientInfo.date_of_birth
            }
        });
    }

    // handles server call errors
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
        this.props.dispatch({
            type: 'cancelPressed'
        });
        this.navigateToDetail();
    }

    // Attempts to update patient's profile according to initiator input
    onSavePressed() {
        const dispatch = this.props.dispatch;
        const id = this.props.navigation.state.params.patientInfo._id;
        const doctorToken = this.props.navigation.state.params.doctorToken;
        fetch(`http://127.0.0.1:8080/v2/initiators/patients/${id}/profile`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization': `token ${doctorToken}`
            },
            body: JSON.stringify({
                'first_name': this.props.firstName,
                'last_name': this.props.lastName,
                'mrn': this.props.navigation.state.params.patientInfo.mrn,
                'date_of_birth': this.props.dateOfBirth
            })
        })
            .then(this.handleErrors)
            .then(
                dispatch({
                    type: 'saveSuccess'
                })
            )
            .then(this.navigateToDetail())
            .catch(() => {
                dispatch({
                    type: 'saveFail'
                })
            })
    }

    navigateToDetail () {
        const patientInfo = this.props.navigation.state.params.patientInfo;
        const doctorToken = this.props.navigation.state.params.doctorToken;
        this.props.navigation.navigate('PatientDetail', {
            id: patientInfo._id,
            doctorToken: doctorToken
        })
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
        const uriSource = this.props.navigation.state.params.uriSource;

        return(
            <Container>
                <Header>
                    <Left>
                        <Button transparent title={null}
                                onPress={this.onCancelPressed.bind(this)}>
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
                                            <Input placeholder={this.props.firstName}
                                                   autoCorrect={false}
                                                   onChangeText={(text) =>
                                                       this.onFirstNameChanged(text)}
                                            />
                                        </Item>
                                        <Item stackedLabel>
                                            <Label>Last Name</Label>
                                            <Input placeholder={this.props.lastName}
                                                   autoCorrect={false}
                                                   onChangeText={(text) =>
                                                       this.onLastNameChanged(text)}
                                            />
                                        </Item>
                                        <Item stackedLabel last>
                                            <Label>Date of Birth ('YYYY-MM-DD')</Label>
                                            <Input placeholder={this.sliceDoB(this.props.dateOfBirth)}
                                                   autoCapitalize='none'
                                                   autoCorrect={false}
                                                   onChangeText={(text) =>
                                                       this.onDoBChanged(text)}
                                            />
                                        </Item>
                                    </Form>
                                </Content>
                            </Body>
                        </CardItem>
                    </Card>

                    <Button success
                            title={null}
                            onPress={this.onSavePressed.bind(this)}
                            style={styles.buttonStyle} >
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