import React, { Component } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';
import { Header, Left, Right, Title, Button, Icon, Body, Text } from 'native-base';

class QRCodePage extends Component {

    static navigationOptions = {
        header: null,
        gesturesEnabled: false
    };

    render(){
        const { viewStyle, messageContent, messageBox, messageBoxText } = styles;
        const data = {
            token: this.props.tmptoken
        };
        return(
            <View>
                <Header>
                    <Left>
                        <Button transparent title={null}
                                onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' />
                            <Text>Back</Text>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Register</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <View style={messageContent}>
                    <View style={messageBox}>
                        <View>
                            <Text style={messageBoxText}>Scan the QR Code below to Register.</Text>
                        </View>
                    </View>
                </View>
                <View style={viewStyle}>
                    {
                        this.props.tmptoken?
                        <QRCode
                            value={JSON.stringify(data) }
                            size={Dimensions.get('window').width*0.53}
                            bgColor='#804000'
                            fgColor='white'
                        />:<Text>Loading...</Text>
                    }

                </View>
            </View>

        )
    }
}

const styles = {
    viewStyle: {
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        marginTop: Dimensions.get('window').height*0.1
    },
    messageContent:{
        marginTop: Dimensions.get('window').height*0.1,
        alignItems:'center'
    },
    messageBox:{
        backgroundColor:'#ffb366',
        width: Dimensions.get('window').width*0.8,
        paddingTop:10,
        paddingBottom:Dimensions.get('window').height*0.03,
        paddingLeft:Dimensions.get('window').height*0.03,
        paddingRight:Dimensions.get('window').height*0.03,
        borderRadius:10
    },
    messageBoxText:{
        fontWeight:'bold',
        color:'#fff',
        textAlign:'center',
        fontSize: Dimensions.get('window').height*0.024
    },
};

const mapStateToProps = state => {
    return {
        tmptoken: state.singlepatient.tmptoken
    };
};

export default connect(mapStateToProps)(QRCodePage);