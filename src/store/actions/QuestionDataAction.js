//types
import { ADD_QUESTION_DATA, FETCH_QUESTION_DATA, FETCH_QUESTION_DATA_ERROR } from "./type";

import ApiUtils from "../../utils/ApiUtils";

// Function to fetch questions based on gameId and levelId
export const getQuestionData = (whereClause) => async (dispatch) => {

  try {
    dispatch({type: FETCH_QUESTION_DATA, payload: true})
    const querySnapshot = await ApiUtils.getQuestionData(whereClause)
    const questions = [];
    querySnapshot.forEach(doc => {
      questions.push({ id: doc.id, ...doc.data() });
    });
    dispatch({type: ADD_QUESTION_DATA, payload: questions})
    return questions;
  } catch (error) {
    dispatch({type: FETCH_QUESTION_DATA_ERROR, payload: error})
    console.log('Error fetching questions:', error);
    throw error; // You might want to handle this error in the calling function
  }
};

