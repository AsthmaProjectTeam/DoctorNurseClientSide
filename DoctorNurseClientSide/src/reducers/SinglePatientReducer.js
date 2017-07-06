const INITIAL_STATE = {
    tmptoken: null,
    questionsetlist: null,
    selectedquestionset: [],
    checkedqsetid: {},
    patient: null,
    loading: true
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'patientProfileLoaded':
            return { ...state, patient: action.payload, loading: false};
        case 'tmpToken':
            return { ...state, tmptoken: action.payload.tmptoken };
        case 'getQuestionSetList':
            return { ...state, questionsetlist: action.payload.questionsetlist };
        case 'qsetSelect':
            return { ...state,
                selectedquestionset: action.payload.selectedquestionset,
                checkedqsetid: action.payload.checkedqsetid
            };
        case 'qsetUnselect':
            return { ...state,
                selectedquestionset: action.payload.selectedquestionset,
                checkedqsetid: action.payload.checkedqsetid
            };
        case 'test':
            return { ...state, questionsetlist: action.payload.questionsetlist };
        default:
            return state;
    }
};