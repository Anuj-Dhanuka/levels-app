//types
import { STORE_SESSION_SCORE } from "./type";

export const currentSessionScore = (score) => {
    return (dispatch) => {
      dispatch({type: STORE_SESSION_SCORE, payload: score})
    }
  }