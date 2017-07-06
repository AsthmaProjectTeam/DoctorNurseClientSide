const INITIAL_STATE = {
    firstName: null,
    lastName: null,
    dateOfBirth: null,
    error: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'componentWillMount':
            return { ...state,
                     firstName: action.payload.firstName,
                     lastName: action.payload.lastName,
                     dateOfBirth: action.payload.dateOfBirth,
                   };
        case 'firstNameChanged':
            return { ...state, firstName:action.payload };
        case 'lastNameChanged':
            return { ...state, lastName:action.payload };
        case 'dateOfBirthChanged':
            return { ...state, dateOfBirth:action.payload };
        case 'saveSuccess':
            return { ...INITIAL_STATE };
        case 'saveFail':
            return { ...state, error:'Failed to update profile' };
        case 'cancelPressed':
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};