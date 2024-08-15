import ApiUtils from "../../utils/ApiUtils";

// Action types
import { SET_HAPTIC_AND_SOUND, FETCH_HAPTIC_AND_SOUND , FETCH_HAPTIC_AND_SOUND_ERROR, SET_HAPTIC_ENABLED, SET_SOUND_ENABLED} from "./type";


export const getSoundAndHapticPermission = (userId) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_HAPTIC_AND_SOUND, payload: true });
    const whereClauses = [['userId', '==', userId]];
    const response = await ApiUtils.getSoundAndHapticPermission(whereClauses);
    if (!response.empty) {
      const userData = response.docs[0].data();
      const { is_haptic_enable, is_sound_enable } = userData;
      dispatch({ type: SET_HAPTIC_AND_SOUND, payload: { isHapticEnabled: is_haptic_enable, isSoundEnabled: is_sound_enable } });
    } else {
      dispatch({ type: FETCH_HAPTIC_AND_SOUND_ERROR, error: 'No user found with the provided userId' });
    }
  } catch (error) {
    dispatch({ type: FETCH_HAPTIC_AND_SOUND_ERROR, payload: error.message });
  }
};


export const updateHaptic = (isEnabled) => {
    
  return dispatch => {
      dispatch({ type: SET_HAPTIC_ENABLED, payload: isEnabled });
  };
};

export const updateSound = (isEnabled) => {
  return dispatch => {
      dispatch({ type: SET_SOUND_ENABLED, payload: isEnabled });
  };
};