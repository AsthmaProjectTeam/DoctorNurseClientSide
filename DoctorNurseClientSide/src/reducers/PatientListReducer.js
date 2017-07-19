const INITIAL_STATE = {
    patientsList: [],
    loadError: null,
    loading: false,
    userIsSearching: false,
    searchResults: [],
    searchError: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'startListRetrieval':
            return { ...state, loading: true };
        case 'listRetrievalSuccess':
            return { ...state,
                     loadError: null,
                     patientsList: action.payload,
                     loading: false,
                     searchResults: action.payload };
        case 'listRetrievalFailed':
            return { ...state,
                     loadError: 'Patient List unavailable.',
                     patientsList: [],
                     loading: false };
        case 'searchPressed':
            return { ...state,
                     userIsSearching: true,
                     searchError: null,
                     searchResults: state.patientsList };
        case 'searchInputChanged':
            return { ...state, searchResults: [], searchError: 'No results found' };
        case 'searchMatched':
            return { ...state,
                     searchResults: state.searchResults.concat(action.payload),
                     searchError: null };
        case 'searchComplete':
            return { ...state, userIsSearching: false, searchError: null };
        default:
            return state;
    }
};