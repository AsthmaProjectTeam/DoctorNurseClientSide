const INITIAL_STATE = {
    patientsList: [],
    error: null,
    loading: false,
    searchResults: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'startListRetrieval':
            return { ...state, loading: true };
        case 'listRetrievalSuccess':
            return { error: null,
                     patientsList: action.payload,
                     loading: false };
        case 'listRetrievalFailed':
            return { error: 'Patient List unavailable',
                     patientsList: [],
                     loading: false };
        case 'handleSearchResults':
            return { ...state, searchResults:action.payload};
        default:
            return state;
    }
};