import React, { Component } from 'react';
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
        const dispatch = this.props.dispatch;
        const navigate = this.props.navigation.navigate;
        const token = this.props.navigation.state.params.token;
        fetch('http://127.0.0.1:8080/v2/initiator/profile',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `token ${token}`
            }
        }).then(this.handleErrors)
            .then(response => response.json())
            .then(response => response.profile)
            .then(response => response.patients)
            .then((response) => {
                 dispatch({
                     type: 'listRetrievalSuccess',
                     payload: response
                 })
            })
            .catch(() => {
                dispatch({
                    type: "listRetrievalFailed"
                });
            });
    }

    render(){
        const { containerStyle, buttonStyle } = styles;

        return(
            <Container style={containerStyle}>
                <Header>
                    <Body>
                        <Title> Patients </Title>
                    </Body>
                </Header>

                <Content>
                    <Card>
                        <List dataArray={this.props.patientsList}
                              renderRow={(item) =>
                              <ListItem button onPress={() => this.props.navigation.navigate('PatientDetail')}>
                                  <Text>{item._id}</Text>
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