import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Header,
    Container,
    Text,
    Content,
    Button,
    Left,
    Body,
    Right,
    Icon,
    Title,
    Form,
    Label,
    Card,
    CardItem,
    List,
    ListItem,
    Spinner,
    Item,
    Input
} from 'native-base';
import Dimensions from 'Dimensions';

class SearchPatient extends Component {

    static navigationOptions = {
        header: null
    };

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

    onCancelPressed() {
        this.props.dispatch({
            type: 'cancelPressed'
        });
        this.props.navigation.navigate('PatientList', {doctorToken: this.props.navigation.state.params.doctorToken});
    }

    onSearchPressed() {
        const navigate = this.props.navigation.navigate;
        const doctorToken = this.props.navigation.state.params.doctorToken;
        const dispatch = this.props.dispatch;
        if (this.props.firstName === "" && this.props.lastName === "") {
            dispatch({
                type: 'searchPressedWithBlankFields'
            })
        }
        else {
            dispatch({
                type: 'searchPressedCorrectly'
            });
            fetch("http://127.0.0.1:8080/v2/initiators/patients/query", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `token ${doctorToken}`
                },
                body: JSON.stringify({
                    'first_name': this.props.firstName,
                    'last_name': this.props.lastName
                })
            })
                .then(this.handleErrors)
                .then(response => response.json())
                .then(response => response.patients)
                .then(response => {
                    dispatch({
                        type: 'resultsRetrievalSuccess'
                    });
                    navigate('SearchResults', { results: response, doctorToken: doctorToken})
                })
                .catch(dispatch({
                    type: 'resultsRetrievalFailed'
                }))
        }
    }

    render() {
        return(
            <Container style={styles.containerStyle}>
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
                    <Right></Right>
                </Header>

                <Content>
                    <Text style={styles.textStyle}>Search Patient you wish to add.</Text>

                    <Content>
                        <Card style={styles.cardStyle}>
                            <CardItem>
                                <Body>
                                <Content>
                                    <Form style={styles.formStyle}>
                                        <Item floatingLabel={true} >
                                            <Label>First Name</Label>
                                            <Input autoCorrect={false}
                                                   onChangeText={(text) =>
                                                       this.onFirstNameChanged(text)}
                                            />
                                        </Item>
                                        <Item floatingLabel={true} >
                                            <Label>Last Name</Label>
                                            <Input autoCorrect={false}
                                                   onChangeText={(text) =>
                                                       this.onLastNameChanged(text)}
                                            />
                                        </Item>
                                    </Form>
                                </Content>
                                </Body>
                            </CardItem>
                        </Card>

                        <Text style={styles.errorTextStyle}>{this.props.error}</Text>

                        <Button info title={null}
                                onPress={this.onSearchPressed.bind(this)}
                                style={styles.buttonStyle}>
                            <Text>Search</Text>
                        </Button>
                    </Content>
                </Content>
            </Container>
        );
    }
}

const styles = {
    containerStyle: {
        backgroundColor: 'white'
    },
    buttonStyle: {
        marginTop: 10,
        width: Dimensions.get('window').width*0.8,
        alignSelf: 'center'
    },
    cardStyle: {
        marginTop: 15,
        alignSelf: 'center',
        width: Dimensions.get('window').width*0.9,
        backgroundColor: '#ddd',
        borderRadius: 5
    },
    errorTextStyle: {
        color: 'red',
        alignSelf: 'center',
        fontWeight: '400'
    },
    formStyle: {
        width: Dimensions.get('window').width*0.8,
        alignSelf: 'center'
    },
    textStyle: {
        textAlign:'center',
        color:'dodgerblue',
        paddingTop:30
    }
};

const mapStateToProps = state => {
    return {
        firstName: state.searchToAdd.firstName,
        lastName: state.searchToAdd.lastName,
        error: state.searchToAdd.error
    };
};

export default connect(mapStateToProps)(SearchPatient);