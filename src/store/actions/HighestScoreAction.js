//Api utils
import ApiUtils from "../../utils/ApiUtils";

//types 
import {SET_HIGHEST_SCORES, FETCHING_HIGHEST_SCORES, FETCHING_HIGHEST_SCORES_ERROR} from "./type";


// Action Creators
export const getHighestScores = (whereClauses) => async (dispatch) => {
    dispatch({type: FETCHING_HIGHEST_SCORES, payload: true})
    try {
        const querySnapshot = await ApiUtils.getHighestScores(whereClauses);
        const scores = [];
        querySnapshot.forEach(doc => {
          scores.push({
            gameId: doc.data().gameId,
            levelId: doc.data().levelId,
            highestScore: doc.data().highest_score
          });
        });
        dispatch({type: SET_HIGHEST_SCORES, payload: scores})
      } catch (error) {
        dispatch({type: FETCHING_HIGHEST_SCORES_ERROR, payload: error})
        console.log("Error fetching scores: ", error);
        return [];
      }
};


