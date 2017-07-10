const INITIAL_STATE = {
    tmptoken: null,
    questionsetlist: null,
    selectedquestionset: [],
    checkedqsetid: {},
    patient: { first_name: "",
               last_name: "",
               _id: null,
               question_set: null},
    isAdding: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case 'getQuestionsetList':
            return { ...state,
                questionsetlist: action.payload.questionsetlist,
                isAdding: action.payload.isAdding
            };
        case 'patientProfileLoaded':
            return { ...state,
                patient: action.payload.patient,
                checkedqsetid: {},
                selectedquestionset: []
            };
        case 'tmpToken':
            return { ...state, tmptoken: action.payload.tmptoken };
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
        case 'updatePatient':
            return { ...state, patient: action.payload.patient };
        default:
            return state;
    }
};