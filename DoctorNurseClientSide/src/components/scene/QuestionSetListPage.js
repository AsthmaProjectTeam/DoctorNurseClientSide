import React, { Component } from 'react';
import { View, ListView } from 'react-native';
import { Container, Content, Body, Button, Text, Header, Left, Icon, Title, Right } from 'native-base';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';
import CheckBox from 'react-native-check-box';
import { HOST } from '../../CONST';

class QuestionSetListPage extends Component {

    static navigationOptions = {
        header: null
    };

    // Retrieves patients unassigned question lists
    componentWillMount(){
        const questionsetlist = this.props.navigation.state.params.questionsetlist;
        const isAdding = this.props.navigation.state.params.isAdding;
        this.props.dispatch({
            type: 'getQuestionsetList',
            payload: {
                questionsetlist: questionsetlist,
                isAdding: isAdding
            }
        });

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.dataSource = ds.cloneWithRows(questionsetlist);
    }

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    // Handles initiator interaction with selecting/un-selecting question sets
    onClickQset(qset){
        if(this.props.checkedqsetid.hasOwnProperty(qset._id)){
            delete this.props.checkedqsetid[qset._id];
            for(let i = 0; i < this.props.selectedquestionset.length; i++){
                if(qset._id === this.props.selectedquestionset[i]._id)
                    this.props.selectedquestionset.splice(i, 1);
            }
            this.props.dispatch({
                type: 'qsetUnselect',
                payload: {
                    checkedqsetid: {...this.props.checkedqsetid},
                    selectedquestionset: [...this.props.selectedquestionset]
                }
            })
        } else {
            this.props.selectedquestionset.push(qset);
            this.props.checkedqsetid[qset._id] = true;
            this.props.dispatch({
                type: 'qsetSelect',
                payload: {
                    checkedqsetid: {...this.props.checkedqsetid},
                    selectedquestionset: [...this.props.selectedquestionset]
                }
            })
        }
    }

    // Assigns selected question sets to patient
    addButtonOnClick() {
        const id = this.props.navigation.state.params.id;
        const navigate = this.props.navigation.navigate;
        const doctorToken = this.props.navigation.state.params.doctorToken;
        const dispatch = this.props.dispatch;
        let qsetid = [];
        for(qset of this.props.selectedquestionset){
            qsetid.push(qset._id)
        }
        fetch(HOST+'/v2/initiators/patients/question-set', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `token ${doctorToken}`
            },
            body: JSON.stringify({
                'patient_list': [id],
                'q_list': qsetid
            })
        }).then(this.handleErrors)
            .then(response => response.json())
            .then(function (response) {
                dispatch({
                    type: 'updatePatient',
                    payload: {
                        patient: response.patients[0]
                    }
                });
            })
            .then(navigate('PatientDetail', {
                id: id,
                doctorToken: doctorToken
            }))
            .catch(error => {
                    console.log(error);
                }
            )
    }

    deleteButtonOnClick(){
        const id = this.props.navigation.state.params.id;
        const navigate = this.props.navigation.navigate;
        const doctorToken = this.props.navigation.state.params.doctorToken;
        const dispatch = this.props.dispatch;
        let qsetid = [];
        for(qset of this.props.selectedquestionset){
            qsetid.push(qset._id)
        }
        fetch(HOST+`/v2/initiators/patients/${id}/question-set`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `token ${doctorToken}`
        },
            body: JSON.stringify({
                'q_list': qsetid
            })
        }).then(this.handleErrors)
            .then(response => response.json())
            .then(function (response) {
                dispatch({
                    type: 'updatePatient',
                    payload: {
                        patient: response.patient
                    }
                });
            })
            .then(navigate('PatientDetail', {
                id: id,
                doctorToken: doctorToken
            }))
                .catch(error => {
                    console.log(error);
                    }
                )
    }

    render(){
        const id = this.props.navigation.state.params.id;
        const doctorToken = this.props.navigation.state.params.doctorToken;
        const navigate = this.props.navigation.navigate;
        const { buttonStyle, checkboxStyle, listStyle, textStyle } = styles;
        return(
            <Container>
                <Content>
                    <Header>
                        <Left>
                            <Button transparent title={null} onPress={() => navigate('PatientDetail',
                            {
                                id: id,
                                doctorToken: doctorToken
                            })}>
                                <Icon name='arrow-back' />
                                <Text> Back </Text>
                            </Button>
                        </Left>
                        <Body>
                            <Title>Select Q-Sets</Title>
                        </Body>
                        <Right></Right>
                    </Header>
                    {/*<List dataArray={this.props.questionsetlist}*/}
                          {/*renderRow={(qset) => {*/}
                              {/*return(*/}
                                  {/*<ListItem>*/}
                                  {/*<CheckBox*/}
                                      {/*isChecked={this.props.checkedqsetid[qset._id]}*/}
                                      {/*onClick={() => this.onClickQset(qset)}*/}
                                      {/*style={checkboxStyle}*/}
                                  {/*/>*/}
                                  {/*<Text>{qset.title}</Text>*/}
                                  {/*</ListItem>*/}
                              {/*)*/}
                          {/*}}>*/}
                    {/*</List>*/}
                    <ListView
                        dataSource={this.dataSource}
                        renderRow={(qset) => {
                            return(
                                <View style={listStyle}>
                                    <CheckBox
                                        isChecked={this.props.checkedqsetid[qset._id]}
                                        onClick={() => this.onClickQset(qset)}
                                        style={checkboxStyle}
                                    />
                                    <Text style={textStyle}>{qset.title}</Text>
                                </View>
                            )
                        }}
                    />

                    {this.props.isAdding?
                        <Button block
                                success
                                style={buttonStyle}
                                onPress={this.addButtonOnClick.bind(this)}>
                            <Text>Add Selected Question Set(s)</Text>
                        </Button>:
                        <Button block
                                danger
                                style={buttonStyle}
                                onPress={this.deleteButtonOnClick.bind(this)}>
                            <Text>Delete Selected Question Set(s)</Text>
                        </Button>
                    }

                </Content>
            </Container>
        )
    }
}

const styles = {
    listStyle: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#dddadf',
        height: Dimensions.get('window').height*0.1

    },

    buttonStyle: {
        marginTop: 35,
        width: Dimensions.get('window').width*0.9,
        alignSelf: 'center'
    },

    checkboxStyle: {
        alignSelf: 'center',
        marginLeft: 10,
        marginRight: 5
    },

    textStyle: {
        fontSize: 18,
        alignSelf: 'center',
        letterSpacing: 2
    }
};

const mapStateToProps = state => {
    return {
        questionsetlist: state.singlepatient.questionsetlist,
        selectedquestionset: state.singlepatient.selectedquestionset,
        checkedqsetid: state.singlepatient.checkedqsetid,
        isAdding: state.singlepatient.isAdding,
        patient: state.singlepatient.patient
    };
};

export default connect(mapStateToProps)(QuestionSetListPage);