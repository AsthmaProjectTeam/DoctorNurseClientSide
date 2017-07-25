const INITIAL_STATE = {
    isLoggedIn: false,
    username: "",
    password: "",
    error: null,
    isLoading: false,
    doctorToken: null,
    tokenFoundAtEntrance: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'usernameTyped':
            return { ...state, username:action.payload.username, error: null };
        case 'passwordTyped':
            return { ...state, password:action.payload.password, error: null };
        case 'loginStarted':
            return { ...state, error: null, isLoading: true };
        case 'loginSuccess':
            return { ...state, isLoggedIn: true, doctorToken: action.payload };
        case 'loginFail':
            return { ...state, isLoading: false, password: "", error:'Invalid Username or Password.' };
        case 'logoutSuccess':
            return { ...state,
                     isLoggedIn: false,
                     error: null,
                     isLoading: false,
                     doctorToken: null,
                     tokenFoundAtEntrance: false };
        case 'tokenFound':
            return { ...state,
                     isLoggedIn: true,
                     doctorToken: action.payload,
                     tokenFoundAtEntrance: true };
        default:
            return state;
    }
};