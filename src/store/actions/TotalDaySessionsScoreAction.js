// actions.js
import { SET_INITIAL_ARRAY, UPDATE_SESSION_SCORE } from "./type";


export const addTotalDayScore = (gameId, levelId, scoreToAdd) => {
  return (dispatch) => {
    dispatch({ type: UPDATE_SESSION_SCORE, payload: { gameId, levelId, scoreToAdd } });
  };
};

export const setInitialArray = (initialArray) => {
    return (dispatch) => {
      dispatch({ type: SET_INITIAL_ARRAY, payload: initialArray});
    };
  };
