import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Container, Content, List, ListItem, Text, CheckBox, Body, Button } from 'native-base';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';

let selectedquestionset = [];
let checkedqsetid = {};
class QuestionSetListPage extends Component {
    static navigationOptions = {
        title: 'Select Question Set'
    };

    onclickqset(qset){
        if(checkedqsetid.hasOwnProperty(qset._id)){
            delete checkedqsetid[qset._id];
            for(let i of this.props.selectedquestionset){
                if(qset._id == i._id)
                    this.props.selectedquestionset.splice(i, 1);
            }
            this.props.dispatch({
                type: 'qsetUnselect',
                payload: {
                    checkedqsetid: checkedqsetid,
                    selectedquestionset: this.props.selectedquestionset
                }
            })
        } else {
            selectedquestionset.push(qset);
            checkedqsetid[qset._id] = true;
            this.props.dispatch({
                type: 'qsetSelect',
                payload: {
                    checkedqsetid: checkedqsetid,
                    selectedquestionset: selectedquestionset
                }
            })
        }
    }

    render(){
        const { buttonStyle } = styles;

        return(
            <Container>
                <Content>
                    <List dataArray={this.props.questionsetlist}
                          renderRow={(qset) => {
                              return(
                                  <ListItem>
                                      <CheckBox checked={checkedqsetid[qset._id]} onPress={() => this.onclickqset(qset)}/>
                                      <Body>
                                          <TouchableOpacity onPress={() => this.onclickqset(qset)}>
                                              <Text>{qset.title}</Text>
                                          </TouchableOpacity>
                                      </Body>
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
    }
};

const mapStateToProps = state => {
    return {
        questionsetlist: state.singlepatient.questionsetlist,
        selectedquestionset: state.singlepatient.selectedquestionset,
        qsetchecked: state.singlepatient.qsetchecked,
        checkedqsetid: state.singlepatient.checkedqsetid
    };
};

export default connect(mapStateToProps)(QuestionSetListPage);