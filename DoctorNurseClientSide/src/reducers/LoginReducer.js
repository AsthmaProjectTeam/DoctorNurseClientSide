const INITIAL_STATE = {
    isLoggedIn: false,
    username: null,
    password: null,
    error: null,
    isLoading: false
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
            return { ...state, isLoggedIn: true };
        case 'loginFail':
            return { ...state, isLoading: false, password: null, error:'Invalid Username or Password.' };
        case 'logoutSuccess':
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};