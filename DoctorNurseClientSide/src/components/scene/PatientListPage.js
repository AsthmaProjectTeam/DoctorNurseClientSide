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

    listRetrievalSuccess(patientsList) {
        this.props.dispatch({
            type: 'listRetrievalSuccess',
            payload:{
                patientsList: patientsList
            }
        })
    }

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
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : 'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiaW5zZXJ0aW5nIjp0cnVlLCJnZXR0ZXJzIjp7fSwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsicGhvbmUiOiJyZXF1aXJlIiwic2FsdCI6InJlcXVpcmUiLCJoYXNoIjoicmVxdWlyZSIsImxhc3RfbmFtZSI6InJlcXVpcmUiLCJmaXJzdF9uYW1lIjoicmVxdWlyZSIsImVtYWlsIjoicmVxdWlyZSIsInVzZXJuYW1lIjoicmVxdWlyZSJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnt9LCJtb2RpZnkiOnt9LCJyZXF1aXJlIjp7InBob25lIjp0cnVlLCJzYWx0Ijp0cnVlLCJoYXNoIjp0cnVlLCJsYXN0X25hbWUiOnRydWUsImZpcnN0X25hbWUiOnRydWUsImVtYWlsIjp0cnVlLCJ1c2VybmFtZSI6dHJ1ZX19LCJzdGF0ZU5hbWVzIjpbInJlcXVpcmUiLCJtb2RpZnkiLCJpbml0IiwiZGVmYXVsdCIsImlnbm9yZSJdfSwicGF0aHNUb1Njb3BlcyI6e30sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfX0sImlzTmV3IjpmYWxzZSwiX2RvYyI6eyJwYXRpZW50cyI6W10sImNyZWF0ZWRfZGF0ZSI6IjIwMTctMDctMDNUMTk6MjQ6NDIuNTIzWiIsInJvbGUiOiJudXJzZSIsInBob25lIjoiNjEyMTIzNjUyMyIsInNhbHQiOiIxNzYxNzI5Mzc2NDAiLCJoYXNoIjoiOWQ2NmUwZTJkMDEyNDRkYWI0NmY4MzBjMGFmNTRiYzk3NjY2NTA0ODdjZjYwM2ZkNzQyZDE0NDUyOWJhMTRjNTcwMzEyNmIxNjY2MGYxZThhOTcwYjZmYTU2MDhkY2ZiYzMwYWM3ZjY4MWY2OWY5ZTM4YzY3MDE4Nzg3ZmMxOGIiLCJlbWFpbCI6IkpvaG4uSm9uZXNAbWFpbC5jb20iLCJsYXN0X25hbWUiOiJKb25lcyIsImZpcnN0X25hbWUiOiJKb2huIiwidXNlcm5hbWUiOiJkb2N0b3IiLCJfaWQiOjMsIl9fdiI6MH0sImlhdCI6MTQ5OTEwOTg4MiwiZXhwIjoxNDk5MTQ1ODgyfQ.cCDFBeMESa4HSiQgFZ_qmxg6RC7fJbLRKbo2mpMZokE'
            }
        }).then(this.handleErrors)
            .then(response => console.log(response))
            .then(response => response.json())          // this is being returned as undefined and breaking everything and it's very annoying
            .then(response => console.log(response))
            //.then(response => response.profile)
            //.then(response => console.log(response))
            //.then(response => response.patients)
            // .then(function (response) {
            //     this.listRetrievalSuccess(response)
            // })
            .catch((response) => {
                console.log(response);
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
                        <List button
                              dataArray={this.props.patientsList}
                              renderRow={(item) =>
                              <ListItem>
                                  <Text>{item._id}</Text>
                              </ListItem>
                        }>
                        </List>
                    </Card>

                    <Text>{this.props.error}</Text>

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