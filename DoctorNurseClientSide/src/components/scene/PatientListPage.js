import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { Header,
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
  ListItem }
from 'native-base';
import Dimensions from 'Dimensions';


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
        //const doctorToken = this.props.navigation.state.params.doctorToken;
        //const dispatch = this.props.dispatch;

        fetch('http://127.0.0.1:8080/v2/initiators/profile',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `token ${this.doctorToken}`
            }
        }).then(this.handleErrors)
            .then(response => response.json())
            .then(response => response.profile)
            .then(response => response.patients)
            .then((response) => {
                 this.dispatch({
                     type: 'listRetrievalSuccess',
                     payload: response
                 })
            })
            .catch(() => {
                this.dispatch({
                    type: "listRetrievalFailed"
                });
            });
    }

    onLogOutPress() {
        //const dispatch = this.props.dispatch;
        AsyncStorage.setItem("loginToken", "")
            .then(() => {
                this.dispatch({
                    type: 'logoutSuccess'
                })
            })
            .then(() => {
                this.navigate('Login');
                //this.props.navigation.goBack();  // Improperly handles state and messes up login
            })
            //.catch... here will be handle errors function for AsyncStorage calls
    }

    render(){
        //const doctorToken = this.props.navigation.state.params.doctorToken;
        //const navigate = this.props.navigation.navigate;
        const { containerStyle, buttonStyle } = styles;

        return(
            <Container style={containerStyle}>
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
                    </Right>
                </Header>

                <Content>
                    <Card>
                        <List dataArray={this.props.patientsList}
                              renderRow={(patient) =>
                              <ListItem button
                                         onPress={() => this.navigate('PatientDetail', { id: patient._id, doctorToken: this.doctorToken })}>
                                  <Text>{patient.first_name} {patient.last_name} ... {patient._id}</Text>
                              </ListItem>
                        }>
                        </List>
                    </Card>

                    <Text style={{color: 'red'}}>{this.props.error}</Text>

                    <Button block info onPress={null} title={null} style={buttonStyle}>
                        <Text>
                            Add Patient
                        </Text>
                    </Button>
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
        hasRetrievedList: state.patients.hasRetrievedList,
        error: state.patients.error
    };
};

export default connect(mapStateToProps)(PatientListPage);