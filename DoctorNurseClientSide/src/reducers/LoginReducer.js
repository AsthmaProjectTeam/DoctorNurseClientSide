const INITIAL_STATE = {
    isLoggedin: false,
    username: null,
    password: null,
    error: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'usernameTyped':
            return { ...state, username:action.payload.username };
        case 'passwordTyped':
            return { ...state, password:action.payload.password };
        case 'loginSuccess':
            return { ...state, error: null, isLoggedin: true };
        case 'loginFail':
            return { ...state, ...INITIAL_STATE, error:'invalid username or password' };
        default:
            return state;
    }
};