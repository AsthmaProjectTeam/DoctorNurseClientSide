const INITIAL_STATE = {
    tmptoken: null,
    questionsetlist: null,
    selectedquestionset: null,
    qsetchecked: false,
    checkedqsetid: null
};

export default (state = INITIAL_STATE, action) => {
    console.log(action.type);
    switch (action.type){
        case 'tmpToken':
            return { ...state, tmptoken: action.payload.tmptoken };
        case 'getQuestionSetList':
            return { ...state, questionsetlist: action.payload.questionsetlist };
        case 'qsetSelect':
            return { ...state,
                qsetchecked: action.payload.qsetchecked,
                selectedquestionset: action.payload.selectedquestionset,
                checkedqsetid: action.payload.checkedqsetid
            };
        case 'qsetUnselect':
            return { ...state,
                qsetchecked: action.payload.qsetchecked,
                selectedquestionset: action.payload.selectedquestionset,
                checkedqsetid: action.payload.checkedqsetid
            };
        default:
            return state;
    }
};