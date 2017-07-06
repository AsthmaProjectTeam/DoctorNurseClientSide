const INITIAL_STATE = {
    isLoggedIn: false,
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
            return { ...INITIAL_STATE, isLoggedIn: true };
        case 'loginFail':
            return { ...INITIAL_STATE, error:'Invalid Username or Password.' };
        case 'logoutSuccess':
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};