const INITIAL_STATE = {
    show: true
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'hideAnimation':
            return { ...state, show:action.payload.show };
        default:
            return state;
    }
};