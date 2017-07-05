const INITIAL_STATE = {
    patientsList: [],
    hasRetrievedList: false,
    error: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'listRetrievalSuccess':
            return { hasRetrievedList: true,
                     error: null,
                     patientsList: action.payload };
        case 'listRetrievalFailed':
            return { hasRetrievedList: false,
                     error: 'Patient List unavailable',
                     patientsList: [] };
        default:
            return state;
    }
};