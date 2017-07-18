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

// gets 'results' as search results prop
// gets 'doctorToken' prop


class SearchResults extends Component {

    static navigationOptions = {
        header: null
    };

    onAddPressed(patient) {
        const doctorToken = this.props.navigation.state.params.doctorToken;
        const dispatch = this.props.dispatch;
        const navigate = this.props.navigation.navigate;
        const id = patient._id;
        fetch("http://127.0.0.1:8080/v2/initiators/patients/add",{
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
            .then(dispatch({
                type: 'addPatientSuccess'
            }))
            .then(navigate('PatientList', {doctorToken: doctorToken }))
            .catch(dispatch({
                type: 'addPatientFailed'
            }))
    }


    onAddManuallyPressed() {
        this.props.navigation.navigate('AddManually', {doctorToken: this.props.navigation.state.params.doctorToken})
    }

    onSearchPressed() {
        this.props.navigation.navigate('SearchPatient', {doctorToken: this.props.navigation.state.params.doctorToken});
    }

    // Removes time of day from date of birth timestamp
    sliceDoB (DoB) {
        if (typeof DoB === "string") {
            return DoB.slice(0,10);
        } else {
            return DoB;
        }
    }

    // Truncates strings too long for display
    checkNameLength(text) {
        if (text.length > 14) {
            return text.slice(0,10) + '...'
        } else {
            return text
        }
    }

    renderMessage() {
        return (
            <Text style={styles.textStyle}>
                Displaying results for "{this.props.firstName} {this.props.lastName}"
            </Text>
        )
    }

    renderContent() {
        return (
            <Content>
                <Card>
                    <List dataArray={this.props.navigation.state.params.results}
                          renderRow={(patient) =>
                              <ListItem>
                                  <Text>
                                      {/*{`${this.checkNameLength(patient.first_name)} ${this.checkNameLength(patient.last_name)}*/}
                                      {/*"\n"${patient.mrn}"\n"${this.sliceDoB(patient.date_of_birth)}`}*/}
                                      {patient.first_name} {patient.last_name}
                                  </Text>
                                  <Right>
                                      <Button info small title={null} onPress={this.onAddPressed(patient).bind(this)}>
                                          <Text>Add</Text>
                                      </Button>
                                  </Right>
                              </ListItem>
                          }>
                    </List>
                </Card>

                <Text style={styles.errorTextStyle}>{this.props.addError}</Text>

                <Text style={styles.textStyle}>Don't see your intended patient?</Text>
                <Button success style={styles.buttonStyle} title={null} onPress={this.onAddManuallyPressed.bind(this)}>
                    <Text>Add Manually</Text>
                </Button>
            </Content>
        )
    }

    render() {
        return (
            <Container style={styles.containerStyle}>
                <Header>
                    <Left>
                        <Button transparent title={null} onPress={this.onSearchPressed.bind(this)}>
                            <Icon name='arrow-back' />
                            <Text>Search</Text>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Add Patient</Title>
                    </Body>
                    <Right></Right>
                </Header>

                {this.renderMessage()}
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
    textStyle: {
        textAlign:'center',
        color:'dodgerblue',
        paddingTop:30
    }
};

mapStateToProps = state => {
    return {
        firstName: state.searchToAdd.firstName,
        lastName: state.searchToAdd.lastName,
        error: state.searchToAdd.error,
        addError: state.searchToAdd.addError
    };
};

export default connect(mapStateToProps)(SearchResults);