import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
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
import { HOST } from '../../CONST';

class SearchPatient extends Component {

    static navigationOptions = {
        header: null
    };

    // Handles errors with server fetch calls
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

    onCancelPressed = () => {
        this.props.dispatch({
            type: 'cancelPressed'
        });
        this.props.navigation.navigate('PatientList', {doctorToken: this.props.navigation.state.params.doctorToken});
    };

    onSearchPressed() {
        const doctorToken = this.props.navigation.state.params.doctorToken;
        const dispatch = this.props.dispatch;
        if (this.props.firstName.length === 0 && this.props.lastName.length === 0) {
            dispatch({
                type: 'searchPressedWithBlankFields'
            });
            console.log("Error should be displaying")
        }
        else {
            dispatch({
                type: 'searchPressedCorrectly'
            });
            fetch(HOST + "/v2/initiators/patients/query", {
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
                        type: 'resultsRetrievalSuccess',
                        payload: response
                    });
                })
                .catch(() => dispatch({
                    type: 'resultsRetrievalFailed'
                }))
        }
    }

    onAddPressed(patient) {
        const doctorToken = this.props.navigation.state.params.doctorToken;
        const dispatch = this.props.dispatch;
        const navigate = this.props.navigation.navigate;
        const id = patient._id;
        fetch(HOST + "/v2/initiators/patients/add",{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization': `token ${doctorToken}`
            },
            body: JSON.stringify({
                'patients_id': [ id ]
            })
        })
            .then(this.handleErrors)
            .then(() => dispatch({
                type: 'addPatientSuccess'
            }))
            .then(() => navigate('PatientList', {doctorToken: doctorToken }))
            .catch(() => dispatch({
                type: 'addPatientFailed'
            }))
    }

    onSearchAgainPressed = () => {
        this.props.dispatch({
            type: 'searchAgainPressed'
        })
    };

    onAddManuallyPressed = () => {
        this.props.navigation.navigate('AddManually', {doctorToken: this.props.navigation.state.params.doctorToken})
    };

    // Truncates strings too long for display
    checkNameLength(text) {
        if (text.length > 14) {
            return text.slice(0,10) + '...'
        } else {
            return text
        }
    }

    // Removes time of day from date of birth timestamp
    sliceDoB (DoB) {
        if (typeof DoB === "string") {
            return DoB.slice(0,10);
        } else {
            return DoB;
        }
    }

    renderSearchButton() {
        if (this.props.isLoading) {
            return (<Spinner color="blue"
                            animating={this.props.isLoading}
                            hidesWhenStopped={true}/>
            )
        }
        return(
            <Button info title={null}
                    onPress={this.onSearchPressed.bind(this)}
                    style={styles.buttonStyle}>
                <Text>Search</Text>
            </Button>
        )
    }

    renderOptionButtons(){
        return (
            <Content style={{height:270}}>
                <Button success style={{width: Dimensions.get('window').width*0.8, alignSelf: 'center'}} title={null} onPress={this.onAddManuallyPressed.bind(this)}>
                    <Text style={{textAlign: 'center'}}>Add Manually</Text>
                </Button>
                <Text style={{textAlign:'center',color:'dodgerblue',paddingBottom:5}}>or</Text>
                <Button success style={styles.buttonStyle} title={null} onPress={this.onSearchAgainPressed.bind(this)}>
                    <Text style={{textAlign:'center'}}>Search Again</Text>
                </Button>
            </Content>
        )
    }

    renderList() {
        if (this.props.searchResults.length===0) {
            return(
                <Content>
                    <Text style={{...styles.textStyle,fontSize:20,paddingBottom:30,color:'mediumorchid'}}>Sorry, no results matched your search...</Text>
                    {this.renderOptionButtons()}
                </Content>
            )
        }
        return (
            <Content>
                <Text style={styles.textStyle}>
                    Displaying results for "{this.props.firstName} {this.props.lastName}":
                </Text>
                <Card>
                    <View style={{flex:1,height:230}}>
                        <List dataArray={this.props.searchResults}
                              renderRow={(patient) =>
                                  <ListItem>
                                      <Text>
                                          {`${this.checkNameLength(patient.first_name)} ${this.checkNameLength(patient.last_name)}\n${patient.mrn}\n${this.sliceDoB(patient.date_of_birth)}`}
                                      </Text>
                                      <Right>
                                          <Button info small title={null} onPress={this.onAddPressed.bind(this, patient)}>
                                              <Text>Add</Text>
                                          </Button>
                                      </Right>
                                  </ListItem>
                              }>
                        </List>
                    </View>
                </Card>

                <Text style={styles.errorTextStyle}>{this.props.addError}</Text>

                <Text style={{...styles.textStyle, paddingTop:5}}>Don't see your intended patient?</Text>
                {this.renderOptionButtons()}
            </Content>
        )
    }

    renderContent() {
        if (this.props.isSearching) {
            return(
                <Content>
                    <Text style={styles.textStyle}>Search Patient you wish to add.</Text>

                    <Content>
                        <Card style={styles.cardStyle}>
                            <CardItem>
                                <Body>
                                <Content>
                                    <Form style={styles.formStyle}>
                                        <Item floatingLabel >
                                            <Label>First Name</Label>
                                            <Input autoCorrect={false}
                                                   onChangeText={(text) =>
                                                       this.onFirstNameChanged(text)}
                                            />
                                        </Item>
                                        <Item floatingLabel >
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

                        <Text style={styles.errorTextStyle}>{this.props.blankFieldsError}</Text>

                        {this.renderSearchButton()}
                    </Content>
                </Content>
            )
        }
        return(
            <Content>
                {this.renderList()}
            </Content>
        )

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

                {this.renderContent()}

            </Container>
        );
    }
}

const styles = {
    containerStyle: {
        backgroundColor: 'white'
    },
    buttonStyle: {
        marginBottom: 10,
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
        paddingTop: 3,
        paddingBottom: 3,
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
        paddingTop:10,
        paddingBottom:5
    }
};

const mapStateToProps = state => {
    return {
        isSearching: state.searchToAdd.isSearching,
        searchResults: state.searchToAdd.searchResults,
        addError: state.searchToAdd.addError,
        addSuccess: state.searchToAdd.addSuccess,
        blankFieldsError: state.searchToAdd.blankFieldsError,
        firstName: state.searchToAdd.firstName,
        lastName: state.searchToAdd.lastName,
        searchError: state.searchToAdd.searchError,
        isLoading: state.searchToAdd.isLoading
    };
};

export default connect(mapStateToProps)(SearchPatient);