import React, { Component } from 'react';
import { View, ScrollView, ActivityIndicator, ListView } from 'react-native';
import { Button, Icon, Right, Text } from 'native-base';
import CheckBox from 'react-native-check-box';
import Dimensions from 'Dimensions';
import { connect } from 'react-redux';
import Toast from 'react-native-simple-toast';

class PrivateQuestionPage extends Component{
    static navigationOptions = {
        title: "Private Questions",
        gesturesEnabled: false
    };

    componentWillMount(){
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.dataSource = ds.cloneWithRows(
            [
                {
                    _id: 0,
                    value: "Patient has called for assistance"
                },
                {
                    _id: 1,
                    value: "Patient has asked to be repositioned"
                },
                {
                    _id: 2,
                    value: "Patient has self-medicated"
                },
                {
                    _id: 3,
                    value: "Patient has expressed discomfort"
                },
                {
                    _id: 4,
                    value: "You have moved the patient"
                }
            ]);
    }

    // Handles initiator interaction with selecting/un-selecting questions
    onClickQuestion(q){
        if(this.props.checkedqid.hasOwnProperty(q._id)){
            delete this.props.checkedqid[q._id];
            for(let i = 0; i < this.props.selectedquestions.length; i++){
                if(q._id === this.props.selectedquestions[i]._id)
                    this.props.selectedquestions.splice(i, 1);
            }
            this.props.dispatch({
                type: 'questionUnselect',
                payload: {
                    checkedqid: {...this.props.checkedqid},
                    selectedquestions: [...this.props.selectedquestions]
                }
            })
        } else {
            this.props.selectedquestions.push(q);
            this.props.checkedqid[q._id] = true;
            this.props.dispatch({
                type: 'questionSelect',
                payload: {
                    checkedqid: {...this.props.checkedqid},
                    selectedquestions: [...this.props.selectedquestions]
                }
            })
        }
    }

    submitButtonClicked(){
        Toast.show('Form Successfully Submitted!', Toast.SHORT);
        const doctorToken = this.props.navigation.state.params.doctorToken;
        this.props.navigation.navigate('PatientList', {doctorToken: doctorToken});
    }

    render(){
        const { listStyle, listTextStyle, checkboxStyle, buttonStyle } = styles;

        return(
            <View>
                <ListView
                    dataSource={this.dataSource}
                    renderRow={(q) => {
                            return(
                                <View key={q._id} style={listStyle}>
                                    <CheckBox
                                        isChecked={false}
                                        onClick={() => this.onClickQuestion(q)}
                                        style={checkboxStyle}
                                    />
                                    <Text style={listTextStyle}>{q.value}</Text>
                                </View>
                            )
                        }}
                />

                <Button block
                        success
                        onPress={this.submitButtonClicked.bind(this)}
                        style={buttonStyle}>
                    <Text>Submit</Text>
                </Button>
            </View>

        )
    }
}

const styles = {
    buttonStyle: {
        marginTop: 35,
        width: Dimensions.get('window').width*0.9,
        alignSelf: 'center'
    },
    listStyle: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#dddadf',
        height: Dimensions.get('window').height*0.1

    },
    checkboxStyle: {
        alignSelf: 'center',
        marginLeft: 10,
        marginRight: 5
    },
    listTextStyle: {
        fontSize: 18,
        alignSelf: 'center'
    }
};

const mapStateToProps = state => {
    return {
        selectedquestions: state.privateQuestions.selectedquestions,
        checkedqid: state.privateQuestions.checkedqid
    };
};

export default connect(mapStateToProps)(PrivateQuestionPage);