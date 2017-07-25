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

// Unedited patient info passed as prop as 'patientInfo'

class EditPatient extends Component {

    static navigationOptions = {
        header: null,
        gesturesEnabled: false
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
        this.props.navigation.goBack();
    }

    // Attempts to update patient's profile according to initiator input
    onSavePressed() {
        const dispatch = this.props.dispatch;
        const id = this.props.navigation.state.params.patientInfo._id;
        const doctorToken = this.props.doctorToken;
        fetch(HOST+`/v2/initiators/patients/${id}/profile`,{
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
            .then(Toast.show(`Successfully Edited ${this.props.firstName} ${this.props.lastName}!`, Toast.LONG))
            .then(setTimeout(
                () => { dispatch({ type: 'saveSuccess' });
                    this.props.navigation.goBack();
                }, 2000))
            .catch(() => {
                dispatch({
                    type: 'saveFail'
                })
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
                    <Thumbnail square large style={styles.thumbnailStyle} source={require('../../img/silhouette.jpg')} />
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

                    <Button success block
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
        error: state.editPatient.error,
        doctorToken: state.login.doctorToken
    };
};

export default connect(mapStateToProps)(EditPatient);