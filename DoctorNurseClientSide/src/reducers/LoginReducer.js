const INITIAL_STATE = {
    isLoggedIn: false,
    username: null,
    password: null,
    error: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'usernameTyped':
            return { ...state, username:action.payload.username, error: null };
        case 'passwordTyped':
            return { ...state, password:action.payload.password, error: null };
        case 'loginSuccess':
            return { ...INITIAL_STATE, isLoggedIn: true };
        case 'loginFail':
            return { ...state, password: null, error:'Invalid Username or Password.' };
        case 'logoutSuccess':
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};