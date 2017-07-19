import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
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
    Card,
    List,
    ListItem,
    Spinner,
    Item,
    Input
} from 'native-base';
import Dimensions from 'Dimensions';
import { HOST } from '../../CONST';

// BUGS: - Newly added patients do not originally render in PatientList

class PatientListPage extends Component {

    // Component constants
    doctorToken = this.props.navigation.state.params.doctorToken; // long-term initiator token
    dispatch = this.props.dispatch;
    navigate = this.props.navigation.navigate;

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

    // Retrieve initiator's patient list using stored long-term token
    componentWillMount() {
        this.dispatch({
           type: 'startListRetrieval'
        });
        fetch(HOST+'/v2/initiators/profile',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `token ${this.doctorToken}`
            }
        })
            .then(this.handleErrors)
            .then(response => response.json())
            .then(response => response.profile)
            .then(response => response.patients)
            .then((response) => {
                 this.dispatch({
                     type: 'listRetrievalSuccess',
                     payload: response.reverse()
                 })
            })
            .catch(() => {
                this.dispatch({
                    type: "listRetrievalFailed"
                });
            });
    }

    // Log Out initiator and wipe stored long-term token
    onLogOutPress() {
        AsyncStorage.setItem("loginToken", "")
            .then(() => {
                this.dispatch({
                    type: 'logoutSuccess'
                })
            })
            .then(() => {
                this.navigate('Login');
            })
            //.catch... here will be handle errors function for AsyncStorage calls
    }

    // Removes whitespace from strings
    cleanString(text) {
        return text.toUpperCase().replace(/\s/g, '');
    }

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

    // Used to handle search input and assembling search results in state
    onSearchInputChanged(search) {
        const patientsList = this.props.patientsList;
        const cleanString = this.cleanString;
        this.dispatch({
            type: 'searchInputChanged'
        });
        for (i = 0; i < patientsList.length; i++) {
            const firstName = cleanString(patientsList[i].first_name);
            const lastName = cleanString(patientsList[i].last_name);
            if (firstName.includes(cleanString(search)) ||
                lastName.includes(cleanString(search)) ||
                (firstName+lastName).includes(cleanString(search)))
            {
                this.dispatch({
                    type: 'searchMatched',
                    payload: patientsList[i]
                });
            }
        }
    }

    // Renders component's header based on whether user is searching
    renderHeader() {
        if (this.props.userIsSearching) {      // user is searching.. display search bar
            return (
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search Patients..."
                               autoCorrect={false}
                               autoCapitalize='words'
                               onChangeText={(text) => this.onSearchInputChanged(text)}/>
                    </Item>
                    <Button transparent title={null} onPress={() => this.props.dispatch({
                        type: 'searchComplete'
                    })}>
                        <Text>Cancel</Text>
                    </Button>
                </Header>
            )
        }
        return (          // user is not searching... display default header
            <Header>
                <Left>
                    <Button transparent title={null}
                            onPress={this.onLogOutPress.bind(this)}>
                        <Icon name='arrow-back' />
                        <Text>Log out</Text>
                    </Button>
                </Left>
                <Body>
                    <Title>Patients</Title>
                </Body>
                <Right>
                    <Button transparent title={null}
                            onPress={() => this.navigate(
                                'SearchPatient', { doctorToken: this.doctorToken })}>
                        <Text>Add</Text>
                    </Button>
                </Right>
            </Header>
        )
    }

    // Renders spinner, full patient list, or search results based upon whether user is searching or
    // patient list is being loaded
    renderContent() {
        if (this.props.loading) {     // patient list fetch in progress... waiting to display patient list
            return (<Spinner color="blue"
                             animating={this.props.loading}
                             hidesWhenStopped={true}/>)
        }
        if (this.props.userIsSearching) {  // Renders patients that match search
            return (
                <Card>
                    <List dataArray={this.props.searchResults}
                          renderRow={(patient) =>
                              <ListItem button
                                        onPress={() =>
                                        {this.navigate('PatientDetail', { id: patient._id,
                                                        doctorToken: this.doctorToken });
                                                        this.dispatch({ type: 'searchComplete'})}}>
                                  <Text>{this.checkNameLength(patient.first_name)} {this.checkNameLength(patient.last_name)}</Text>
                                  <Right>
                                    <Text>{this.sliceDoB(patient.date_of_birth)}</Text>
                                  </Right>
                              </ListItem>
                          }>
                    </List>
                </Card>
            )
        }
        return (  // Renders all patients under initiator
            <Card>
                <View style={{height: 550}}>
                    <List dataArray={this.props.patientsList}
                          renderRow={(patient) =>
                              <ListItem button
                                        onPress={() => this.navigate('PatientDetail',
                                            { id: patient._id, doctorToken: this.doctorToken })}>
                                  <Text>{this.checkNameLength(patient.first_name)} {this.checkNameLength(patient.last_name)}</Text>
                                  <Right>
                                    <Text>{this.sliceDoB(patient.date_of_birth)}</Text>
                                  </Right>
                              </ListItem>
                          }>
                    </List>
                </View>
            </Card>
        )
    }

    // Shows search bar if user is not currently searching
    renderSearchButton() {
        if (this.props.userIsSearching) {
            return
        }
        return (
            <Button title={null} onPress={() => this.props.dispatch({
                type: 'searchPressed'
            })} style={{ backgroundColor: 'darkgray', alignContent: 'center' }} full >
                <Icon name="ios-search" />
                <Text>Search</Text>
            </Button>
        )
    }


    render(){
        const { containerStyle } = styles;

        return(
            <Container style={containerStyle}>
                {this.renderHeader()}

                <Content>

                    {this.renderSearchButton()}
                    {this.renderContent()}

                    <Text style={{color: 'grey', fontWeight: '400', alignSelf: 'center'}}>{this.props.searchError}</Text>

                    <Text style={{color: 'red'}}>{this.props.loadError}</Text>

                </Content>
            </Container>
        )
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
    }
};

const mapStateToProps = state => {
    return {
        patientsList: state.patients.patientsList,
        loading: state.patients.loading,
        loadError: state.patients.loadError,
        userIsSearching: state.patients.userIsSearching,
        searchResults: state.patients.searchResults,
        searchError: state.patients.searchError
    };
};

export default connect(mapStateToProps)(PatientListPage);