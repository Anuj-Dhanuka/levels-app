//Api Utils
import ApiUtils from "../../utils/ApiUtils";

//types
import {
  SET_GAMES_DATA,
  FETCHING_GAMES_DATA,
  FETCHING_GAMES_DATA_ERROR,
} from "./type";

export const fetchGamesDataError = () => ({
  type: FETCHING_GAMES_DATA_ERROR,
  payload: null,
});

export const getGameData = () => async (dispatch) => {
  try {
    dispatch({ type: FETCHING_GAMES_DATA, payload: true });

    const response = await ApiUtils.getGameData();

    const data = response.docs.map((doc) => ({
      id: doc.id,
      description: doc.data().description,
      levels: doc.data().levels,
      name: doc.data().name,
    }));

    dispatch({ type: SET_GAMES_DATA, payload: data });

    return data;
  } catch (error) {

    dispatch({
      type: FETCHING_GAMES_DATA_ERROR,
      payload: error?.response?.data || "Failed to fetch services offered data",
    });
    
  }
};
