//types
import { SET_INITIAL_ARRAY, UPDATE_SESSION_SCORE } from "../actions/type";

const initialState = {
  totalScoreCount: [],
};

const totalDaySessionScoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INITIAL_ARRAY:
      return {
        ...state,
        totalScoreCount: action.payload,
      };
      case UPDATE_SESSION_SCORE:
        const { gameId, levelId, scoreToAdd } = action.payload;
        if (state.scores.hasOwnProperty(gameId)) {
          if (state.scores[gameId].hasOwnProperty(levelId)) {
            return {
              ...state,
              scores: {
                ...state.scores,
                [gameId]: {
                  ...state.scores[gameId],
                  [levelId]: state.scores[gameId][levelId] + scoreToAdd
                }
              }
            };
          } else {
            console.log(`LevelId ${levelId} does not exist for gameId ${gameId}`);
            return state;
          }
        } else {
          console.log(`GameId ${gameId} does not exist`);
          return state;
        }  
  }
};

export default totalDaySessionScoreReducer;
