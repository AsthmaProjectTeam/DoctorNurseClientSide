const INITIAL_STATE = {
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
        case 'loginFail':
            return { ...state, ...INITIAL_STATE, error:'username or password wrong' };
        default:
            return state;
    }
};