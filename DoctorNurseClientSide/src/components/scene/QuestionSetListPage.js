import React, { Component } from 'react';
import { TouchableOpacity, View, ListView } from 'react-native';
import { Container, Content, List, ListItem, Body, Button, Text } from 'native-base';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';
import CheckBox from 'react-native-check-box';
class QuestionSetListPage extends Component {

    static navigationOptions = {
        title: 'Select Question Set'
    };

    onClickQset(qset){
        if(this.props.checkedqsetid.hasOwnProperty(qset._id)){
            delete this.props.checkedqsetid[qset._id];
            for(let i = 0; i < this.props.selectedquestionset.length; i++){
                if(qset._id == this.props.selectedquestionset[i]._id)
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

    submitButtonClicked() {
        this.props.dispatch({
            type: 'qsetSelect',
            payload: {
                checkedqsetid: {6:true},
            }
        })
    }

    render(){
        const { buttonStyle, checkboxStyle } = styles;
        return(
            <Container>
                <Content>
                    <List dataArray={this.props.questionsetlist}
                          renderRow={(qset) => {
                              return(
                                  <ListItem>
                                  <CheckBox
                                      isChecked={this.props.checkedqsetid[qset._id]}
                                      onClick={() => this.onClickQset(qset)}
                                      style={checkboxStyle}
                                  />
                                  <Text>{qset.title}</Text>
                                  </ListItem>
                              )
                          }}>
                    </List>

                    <Button block prime style={buttonStyle}>
                        <Text>Submit Selected Question Set(s)</Text>
                    </Button>
                </Content>
            </Container>
        )
    }
}

const styles = {
    buttonStyle: {
        marginTop: 35,
        width: Dimensions.get('window').width*0.9,
        alignSelf: 'center'
    },

    checkboxStyle: {
        paddingRight: 10,
    }
};

const mapStateToProps = state => {
    return {
        questionsetlist: state.singlepatient.questionsetlist,
        selectedquestionset: state.singlepatient.selectedquestionset,
        checkedqsetid: state.singlepatient.checkedqsetid
    };
};

export default connect(mapStateToProps)(QuestionSetListPage);