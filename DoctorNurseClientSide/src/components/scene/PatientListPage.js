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

// As of now, newly added patients do not originally render in PatientList

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

    renderContent() {
        if (this.props.loading) {
            return (<Spinner color="blue" animating={this.props.loading} hidesWhenStopped={true}/>)
        }
        return (<Card>
            <List dataArray={this.props.patientsList}
                  renderRow={(patient) =>
                      <ListItem button
                                onPress={() => this.navigate('PatientDetail', { id: patient._id, doctorToken: this.doctorToken })}>
                          <Text>{patient.first_name} {patient.last_name}</Text>
                      </ListItem>
                  }>
            </List>
        </Card>)
    }

    render(){
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
                        <Button transparent title={null} onPress={() => this.navigate('AddPatient', { doctorToken: this.doctorToken })}>
                            <Text> Add </Text>
                        </Button>
                    </Right>
                </Header>

                <Content>

                    <Button title={null} onPress={null} style={buttonStyle}>
                        <Text>Search</Text>
                    </Button>

                    {this.renderContent()}

                    <Text style={{color: 'red'}}>{this.props.error}</Text>

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
        error: state.patients.error
    };
};

export default connect(mapStateToProps)(PatientListPage);