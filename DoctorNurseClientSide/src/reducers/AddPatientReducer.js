const INITIAL_STATE = {
    firstName: null,
    lastName: null,
    dateOfBirth: null,
    mrn: null,
    error: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'firstNameChanged':
            return { ...state, firstName:action.payload };
        case 'lastNameChanged':
            return { ...state, lastName:action.payload };
        case 'dateOfBirthChanged':
            return { ...state, dateOfBirth:action.payload };
        case 'mrnChanged':
            return { ...state, mrn:action.payload };
        case 'saveSuccess':
            return { ...INITIAL_STATE };
        case 'saveFail':
            return { ...state, error:'Failed to add patient' };
        case 'cancelPressed':
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};