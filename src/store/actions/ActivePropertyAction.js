//types
import {
  SET_ACTIVE_GAME_NAME,
  SET_ACTIVE_CURRENT_LEVEL,
  SET_ACTIVE_GAME_ID,
  SET_ACTIVE_NO_OF_LEVELS,
  SET_ACTIVE_LEVEL_ID,
  SET_CURRENT_SCORE,
  SET_GAME_START_TIME,
} from "./type";

export const setActiveGameIdAndActiveNoOfLevels = (
  activeGameId,
  activeNoOfLevels,
  activeGameName,
) => {
  return (dispatch) => {
    dispatch({ type: SET_ACTIVE_GAME_ID, payload: activeGameId });
    dispatch({ type: SET_ACTIVE_NO_OF_LEVELS, payload: activeNoOfLevels });
    dispatch({ type: SET_ACTIVE_GAME_NAME, payload: activeGameName });
  };
};

export const setActiveCurrentLevel = (activeCurrentLevel) => {
  return (dispatch) => {
    dispatch({ type: SET_ACTIVE_CURRENT_LEVEL, payload: activeCurrentLevel });
  };
};

export const setActiveLevelId = (activeLevelId) => {
  return (dispatch) => {
    dispatch({type: SET_ACTIVE_LEVEL_ID, payload: activeLevelId})
  }
}

export const setCurrentScore = (currentScore) => {
  return  (dispatch) => {
    dispatch({type: SET_CURRENT_SCORE, payload: currentScore})
  }
}

export const setGameStartTime = (gameStatrtTime) => {
  return (dispatch) => {
    dispatch({type: SET_GAME_START_TIME, payload: gameStatrtTime})
  }
}