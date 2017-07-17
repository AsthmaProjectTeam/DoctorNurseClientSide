import { AsyncStorage } from 'react-native';

let saveGlobalDoctorToken = function (doctorToken){
    AsyncStorage.setItem("loginToken", doctorToken)
};

let getGlobalDoctorToken = function () {
    console.log('here');
    AsyncStorage.getItem('loginToken')
        .then(
            function (result) {
                if (result === null) {
                    setTimeout(() => {
                        console.log('cannot find saved data, be ready to login screen');
                        navigate('Login');
                    }, 2800)
                } else {
                    return result;
                }
            })
        .catch((error) => {
            console.log('error:' + error.message);
        });
};

global.saveGlobalDoctorToken = saveGlobalDoctorToken;
global.getGlobalDoctorToken = getGlobalDoctorToken;