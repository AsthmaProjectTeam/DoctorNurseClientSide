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
        fetch('http://127.0.0.1:8080/v2/initiator/profile',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',    // AsyncStorage.getItem("loginToken")
                'Accept' : 'application/json',
                'Authorization' : 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiaW5zZXJ0aW5nIjp0cnVlLCJnZXR0ZXJzIjp7fSwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsicGhvbmUiOiJyZXF1aXJlIiwic2FsdCI6InJlcXVpcmUiLCJoYXNoIjoicmVxdWlyZSIsImxhc3RfbmFtZSI6InJlcXVpcmUiLCJmaXJzdF9uYW1lIjoicmVxdWlyZSIsImVtYWlsIjoicmVxdWlyZSIsInVzZXJuYW1lIjoicmVxdWlyZSJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnt9LCJtb2RpZnkiOnt9LCJyZXF1aXJlIjp7InBob25lIjp0cnVlLCJzYWx0Ijp0cnVlLCJoYXNoIjp0cnVlLCJsYXN0X25hbWUiOnRydWUsImZpcnN0X25hbWUiOnRydWUsImVtYWlsIjp0cnVlLCJ1c2VybmFtZSI6dHJ1ZX19LCJzdGF0ZU5hbWVzIjpbInJlcXVpcmUiLCJtb2RpZnkiLCJpbml0IiwiZGVmYXVsdCIsImlnbm9yZSJdfSwicGF0aHNUb1Njb3BlcyI6e30sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfX0sImlzTmV3IjpmYWxzZSwiX2RvYyI6eyJwYXRpZW50cyI6W10sImNyZWF0ZWRfZGF0ZSI6IjIwMTctMDctMDRUMTY6MDU6NDMuOTU2WiIsInJvbGUiOiJudXJzZSIsInBob25lIjoiNjEyMTIzNjUyMyIsInNhbHQiOiIyNDM0MTk2MDk1NzYiLCJoYXNoIjoiMjhhOWQzYzIwN2NiMjkwOTJmNzZiNmU3MmZjNmE4NTAyMzlmMzA1YjE2OWFiNGVlOTBlMDc2YzkyYmFkYWZhOGNmMGQyNDViNjBjOTVlZGVjN2FhMmNhYjBmYzhhZjJjMDcwZWU3N2U2ZGY3NzNkNWQwMmE0NDc3ZGZiYzAzOTEiLCJlbWFpbCI6ImpvaG4uZEBtYWlsLmNvbSIsImxhc3RfbmFtZSI6IkQiLCJmaXJzdF9uYW1lIjoiSm9obiIsInVzZXJuYW1lIjoidGVzdHRlc3QiLCJfaWQiOjYsIl9fdiI6MH0sImlhdCI6MTQ5OTE4NDM0NCwiZXhwIjoxNDk5MjIwMzQ0fQ.vKnjP1jjGTVbwjr0epetOFCiFMY1yLK2gHDSvH8PMGA'
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