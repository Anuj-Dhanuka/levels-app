//types
import { FETCH_ALL_LEVELS, SET_ALL_LEVELS_DATA, FETCH_ALL_LEVELS_ERROR, SET_NUMBER_OF_QUESTIONS_DATA } from "../actions/type";

const initialState = {
  loading: false,
  levelGroups: {},
  numberOfQuestionsGroup: [],
  error: null
};

const allLevelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_LEVELS:
      return {
        ...state,
        loading: action.payload,
        error: null
      };
    case SET_ALL_LEVELS_DATA:
      return {
        ...state,
        loading: false,
        levelGroups: action.payload,
        error: null
      };
    case FETCH_ALL_LEVELS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      case SET_NUMBER_OF_QUESTIONS_DATA:
        return {
          ...state,
          loading: false,
          numberOfQuestionsGroup: action.payload
        };  
    default:
      return state;
  }
};

export default allLevelsReducer;

