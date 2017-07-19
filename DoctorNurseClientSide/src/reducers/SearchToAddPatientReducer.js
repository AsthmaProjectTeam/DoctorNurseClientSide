const INITIAL_STATE = {
    isLoading: false,
    isSearching: true,
    searchResults: [],
    searchError: null,
    addError: null,
    addSuccess: false,
    blankFieldsError: null,
    firstName: "",
    lastName: ""
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'firstNameChanged':
            return { ...state, firstName: action.payload };
        case 'lastNameChanged':
            return { ...state, lastName: action.payload };
        case 'cancelPressed':
            return { ...INITIAL_STATE };
        case 'searchPressedWithBlankFields':
            return { ...state, blankFieldsError: 'You must provide at least one field.' };
        case 'searchPressedCorrectly':
            return { ...state, isLoading: true, blankFieldsError: null, searchError: null };
        case 'resultsRetrievalSuccess':
            return { ...state, searchResults: action.payload, isLoading: false, isSearching: false };
        case 'resultsRetrievalFailed':
            return { ...state, isLoading: false, searchError: 'Unable to search for patient.' };
        case 'addPressed':
            return { ...state, isLoading: true, addError: null };
        case 'addPatientSuccess':
            return { ...INITIAL_STATE };
        case 'addPatientFailed':
            return { ...state, isLoading: false, addError: 'Unable to add patient.' };
        case 'searchAgainPressed':
            return { ...INITIAL_STATE };
        default:
            return state;
    }
}