import { Alert } from 'react-native';
import RNExitApp from 'react-native-exit-app';

let globalerrorhandling = function (res) {
    if(!res.ok){
        if(res.status == 401){
            throw Error(res.statusText);
        } else if(res.status == 400){
            console.log('400 error');
            throw Error(res.statusText);
        } else if(res.status == 500){
            Alert.alert(
                'Error',
                'Internal Database Error. You may be forced to exit app.',
                [
                    {text: 'OK', onPress: () => {
                        RNExitApp.exitApp();
                    }},
                ],
                { cancelable: false }
            );
        } else {
            console.log('i do not know what error this is');
            throw Error(res.statusText);
        }
    }else{
        return res;
    }

};

global.globalerrorhandling = globalerrorhandling;