const INITIAL_STATE = {
    error: "",
    addError: "",
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
        case 'searchPressedAndBlankFields':
            return { ...state, error: 'You must provide at least one field' };
        case 'searchPressedCorrectly':
            return { ...state, error: null };
        case 'resultsRetrievalSuccess':
            return { ...state, error: null };
        case 'resultsRetrievalFailed':
            return { ...state, error: 'Unable to search for patient.'};
        case 'addPatientSuccess':
            return { ...INITIAL_STATE };
        case 'addPatientFailed':
            return { ...state, addError: 'Unable to add patient' };
        default:
            return state;
    }
}