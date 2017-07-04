const INITIAL_STATE = {
    patientsList: [],
    hasRetrievedList: false,
    error: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'listRetrievalSuccess':
            return { ...state,
                     hasRetrievedList: true,
                     error: null,
                     patientsList: action.payload.patientsList };
        case 'listRetrievalFailed':
            return { ...state,
                     hasRetrievedList: false,
                     error: 'Patient List unavailable',
                     patientsList: [] };
        default:
            return state;
    }
};