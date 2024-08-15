//types
import {
  SET_ACTIVE_GAME_NAME,
  SET_ACTIVE_CURRENT_LEVEL,
  SET_ACTIVE_GAME_ID,
  SET_ACTIVE_NO_OF_LEVELS,
  SET_ACTIVE_LEVEL_ID,
  SET_CURRENT_SCORE,
  SET_GAME_START_TIME
} from "../actions/type";

const initialState = {
  activeGameName: null,
  activeCurrentLevel: null,
  activeGameId: null,
  activeNoOfLevels: null,
  activeLevelId: null,
  currentScore: null,
  gameStartTime: null,
};

const activePropertiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_CURRENT_LEVEL:
      return {
        ...state,
        activeCurrentLevel: action.payload,
      };
    case SET_ACTIVE_GAME_ID:
      return {
        ...state,
        activeGameId: action.payload,
      };
    case SET_ACTIVE_NO_OF_LEVELS:
      return {
        ...state,
        activeNoOfLevels: action.payload,
      };
    case SET_ACTIVE_GAME_NAME:
      return {
        ...state,
        activeGameName: action.payload,
      };
    case SET_ACTIVE_LEVEL_ID:
      return {
        ...state,
        activeLevelId: action.payload
      } 
    case  SET_CURRENT_SCORE :
      return {
        ...state,
        currentScore: action.payload
      }
    case SET_GAME_START_TIME :
      return {
        ...state,
        gameStartTime: action.payload
      }     
    default:
      return state;
  }
};

export default activePropertiesReducer;
