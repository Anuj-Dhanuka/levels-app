import {
  SET_SESSION_COUNT,
  FETCHING_SESSION_COUNT,
  FETCHING_SESSION_ERROR,
} from "./type";
import ApiUtils from "../../utils/ApiUtils";

export const getSessionsCount = (userId) => async (dispatch) => {
  try {
    dispatch({ type: FETCHING_SESSION_COUNT, payload: true });
    const whereClause = [["userId", "==", userId]]
    const sessionDataRef = await ApiUtils.getSessionsCount(whereClause)
    if (sessionDataRef.empty) {
      
    }
    const sessionCounts = {};

    sessionDataRef.forEach((doc) => {
      const gameId = doc.data().gameId;
      if (!sessionCounts[gameId]) {
        sessionCounts[gameId] = 1;
      } else {
        sessionCounts[gameId]++;
      }
    });

    const result = Object.entries(sessionCounts).map(([gameId, count]) => ({
      [gameId]: count,
    }));
    dispatch({ type: SET_SESSION_COUNT, payload: result });
    return numberOfSessions;
  } catch (error) {
    dispatch({ type: FETCHING_SESSION_ERROR, payload: error });
  }
};
