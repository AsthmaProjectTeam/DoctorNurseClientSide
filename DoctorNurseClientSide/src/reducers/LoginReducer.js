const INITIAL_STATE = {
    username: null,
    password: null
};

export default (state = INITIAL_STATE, action) => {
    console.log(action.type);
    switch (action.type){
        case 'usernameTyped':
            return { ...state, username:action.payload.username };
        case 'passwordTyped':
            return { ...state, password:action.payload.password }
        default:
            return state;
    }
};