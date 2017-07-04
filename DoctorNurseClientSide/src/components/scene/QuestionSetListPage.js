import React, { Component } from 'react';
import { TouchableOpacity, View, ListView } from 'react-native';
import { Container, Content, List, ListItem, CheckBox, Body, Button, Text } from 'native-base';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';

class QuestionSetListPage extends Component {

    static navigationOptions = {
        title: 'Select Question Set'
    };

    componentWillMount() {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.dataSource = ds.cloneWithRows(this.props.questionsetlist);
    }

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
        const { buttonStyle } = styles;
        const test = this.props.checkedqsetid;
        console.log('i rendered');
        return(
            <Container>
                <Content>
                {/*<ListView*/}
                    {/*dataSource={this.dataSource}*/}
                    {/*renderRow={(qset) =>{*/}
                    {/*return(*/}
                        {/*<ListItem>*/}
                            {/*<CheckBox*/}
                                {/*checked={test[qset._id]!=null}*/}
                                {/*onPress={() => this.onClickQset(qset)}*/}
                            {/*/>*/}
                            {/*<Body>*/}
                              {/*<TouchableOpacity onPress={() => this.onClickQset(qset)}>*/}
                                  {/*<Text>{qset.title}</Text>*/}
                              {/*</TouchableOpacity>*/}
                            {/*</Body>*/}
                        {/*</ListItem>*/}
                    {/*)}}*/}
                {/*>*/}
                {/*</ListView>*/}
                    <List dataArray={this.props.questionsetlist}
                          renderRow={(qset) => {
                              return(
                                  <ListItem>
                                      <TouchableOpacity onPress={() => this.onClickQset(qset)}>
                                          <Text>{qset.title}</Text>
                                      </TouchableOpacity>
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
        checkedqsetid: state.singlepatient.checkedqsetid
    };
};

export default connect(mapStateToProps)(QuestionSetListPage);