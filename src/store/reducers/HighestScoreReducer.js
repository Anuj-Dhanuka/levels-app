import {SET_HIGHEST_SCORES, FETCHING_HIGHEST_SCORES, FETCHING_HIGHEST_SCORES_ERROR} from "../actions/type";

const initialState = {
  highestScores: null,
  fetchingHighestScores: false,
  fetchingHighestScoresError: null,
};

const highestScoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_HIGHEST_SCORES:
      return {
        ...state,
        fetchingHighestScores: true,
      };
    case SET_HIGHEST_SCORES:
      return {
        ...state,
        highestScores: action.payload,
        fetchingHighestScores: false,
      };
    case FETCHING_HIGHEST_SCORES_ERROR:
      return {
        ...state,
        fetchingHighestScoresError: action.payload,
      };
    default:
      return state;
  }
};

export default highestScoreReducer;





