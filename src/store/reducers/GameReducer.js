//types
import {
  SET_GAMES_DATA,
  FETCHING_GAMES_DATA,
  FETCHING_GAMES_DATA_ERROR,
  RESET_GAME_DATA,
} from "../actions/type";

const initialState = {
    gameData: null,
    gameDataError: null,
    fetchingGameData: false,
  };

const gameDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GAMES_DATA:
      return {
        ...state,
        gameData: action.payload,
        fetchingGameData: false,
      };
    case FETCHING_GAMES_DATA_ERROR:
      return {
        ...state,
        gameDataError: action.payload,
        fetchingGameData: false,
      };
    case FETCHING_GAMES_DATA:
      return {
        ...state,
        fetchingGameData: action.payload,
      };
    case RESET_GAME_DATA:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default gameDataReducer;
