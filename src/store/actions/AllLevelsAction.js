//Api utils
import ApiUtils from "../../utils/ApiUtils";

//types
import { SET_ALL_LEVELS_DATA, FETCH_ALL_LEVELS, FETCH_ALL_LEVELS_ERROR, SET_NUMBER_OF_QUESTIONS_DATA } from "./type";

export const allLevelsAction = () => async (dispatch) => {
    dispatch({type: FETCH_ALL_LEVELS, payload: true})
    try {
        const levelsSnapshot = await ApiUtils.getAllLeves();
    
        const levelGroups = {};
        const numberOfQuestionsGroup = [];
    
        levelsSnapshot.forEach((doc) => {
          const levelData = doc.data();
          const gameId = levelData.gameId;
    
          if (!levelGroups[gameId]) {
            levelGroups[gameId] = [];
          }
          levelGroups[gameId].push(doc.id);

          if(!numberOfQuestionsGroup) {
            numberOfQuestionsGroup = []
          }
          numberOfQuestionsGroup.push([doc.id, levelData.number_of_questions_to_show])
          
        });
        dispatch({type: SET_ALL_LEVELS_DATA, payload: levelGroups})
        dispatch({type: SET_NUMBER_OF_QUESTIONS_DATA, payload: numberOfQuestionsGroup})
        return levelGroups;
      } catch (error) {
        dispatch({type: FETCH_ALL_LEVELS_ERROR, payload: error})
        throw error;
      }
};


