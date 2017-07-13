import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
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
    Card,
    List,
    ListItem,
    Spinner,
    Item,
    Input
} from 'native-base';
import Dimensions from 'Dimensions';

// BUGS: - Newly added patients do not originally render in PatientList
//       - Search Error is delayed one key-press

class PatientListPage extends Component {

    doctorToken = this.props.navigation.state.params.doctorToken;
    dispatch = this.props.dispatch;
    navigate = this.props.navigation.navigate;

    static navigationOptions = {
        header: null
    };

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    componentWillMount() {
        this.props.dispatch({
           type: 'startListRetrieval'
        });
        fetch('http://127.0.0.1:8080/v2/initiators/profile',{
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

    cleanString(text) {
        return text.toUpperCase().replace(/\s/g, '');
    }

    checkNameLength(text) {
        if (text.length > 14) {
            return text.slice(0,10) + '...'
        } else {
            return text
        }
    }

    sliceDoB (DoB) {
        if (typeof DoB === "string") {
            return DoB.slice(0,10);
        } else {
            return DoB;
        }
    }

    onSearchInputChanged(search) {
        const dispatch = this.props.dispatch;
        const patientsList = this.props.patientsList;
        dispatch({
            type: 'searchInputChanged'
        });
        for (i = 0; i < patientsList.length; i++) {
            if (this.cleanString(patientsList[i].first_name).includes(this.cleanString(search)) ||
                this.cleanString(patientsList[i].last_name).includes(this.cleanString(search)) ||
                this.cleanString(patientsList[i].first_name +
                                 patientsList[i].last_name).includes(this.cleanString(search)))
            {
                dispatch({
                    type: 'searchMatched',
                    payload: patientsList[i]
                });
            }
        }
    }

    renderHeader() {
        if (this.props.userIsSearching) {
            return (
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search Patients"
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
        return (
            <Header>
                <Left>
                    <Button transparent title={null} onPress={this.onLogOutPress.bind(this)}>
                        <Icon name='arrow-back' />
                        <Text> Log out </Text>
                    </Button>
                </Left>
                <Body>
                <Title> Patients </Title>
                </Body>
                <Right>
                    <Button transparent title={null} onPress={() => this.navigate('AddPatient', { doctorToken: this.doctorToken })}>
                        <Text> Add </Text>
                    </Button>
                </Right>
            </Header>
        )
    }

    renderContent() {
        if (this.props.loading) {
            return (<Spinner color="blue" animating={this.props.loading} hidesWhenStopped={true}/>)
        }
        if (this.props.userIsSearching) {
            return (
                <Card>
                    <List dataArray={this.props.searchResults}
                          renderRow={(patient) =>
                              <ListItem button
                                        onPress={() => {this.navigate('PatientDetail', { id: patient._id, doctorToken: this.doctorToken });
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
        return (
            <Card>
                <List dataArray={this.props.patientsList}
                      renderRow={(patient) =>
                          <ListItem button
                                    onPress={() => this.navigate('PatientDetail', { id: patient._id, doctorToken: this.doctorToken })}>
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

                    <Text style={{color: 'grey', fontWeight: '400', alignSelf: 'center'}}>
                        {this.props.searchError}
                    </Text>

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