import React, { Component } from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions';

class QRCodePage extends Component {

    render(){
        const { viewStyle, messageContent, messageBox, messageBoxText } = styles;
        const data = {
            token: this.props.tmptoken
        };
        return(
            <View>
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
                            size={200}
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
        width:300,
        paddingTop:10,
        paddingBottom:20,
        paddingLeft:20,
        paddingRight:20,
        borderRadius:10
    },
    messageBoxText:{
        fontWeight:'bold',
        color:'#fff',
        textAlign:'center',
        fontSize:16
    },
};

const mapStateToProps = state => {
    return {
        tmptoken: state.singlepatient.tmptoken
    };
};

export default connect(mapStateToProps)(QRCodePage);