const INITIAL_STATE = {
    selectedquestions: [],
    checkedqid: {}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'questionSelect':
            return { ...state,
                selectedquestions: action.payload.selectedquestions,
                checkedqid: action.payload.checkedqid
            };
        case 'questionUnselect':
            return { ...state,
                selectedquestions: action.payload.selectedquestions,
                checkedqid: action.payload.checkedqid
            };
        default:
            return state;
    }
};