//types 
import { ADD_QUESTION_DATA, FETCH_QUESTION_DATA, FETCH_QUESTION_DATA_ERROR } from "../actions/type";

const initialState = {
    questionData: [],
    questionDataFetching: false,
    questionDataError: null
}

const questionDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_QUESTION_DATA:
            return {
                ...state,
                questionDataFetching: true,
                questionDataError: null
            };
        case ADD_QUESTION_DATA:
            return {
                ...state,
                questionDataFetching: false,
                questionData: [...state.questionData, action.payload],
                questionDataError: null
            };
        case FETCH_QUESTION_DATA_ERROR:
            return {
                ...state,
                questionDataFetching: false,
                questionDataError: action.payload
            };
        default:
            return state;
    }
};

export default questionDataReducer;


