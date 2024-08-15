//types
import { act } from "react";
import {
  SET_HAPTIC_AND_SOUND,
  FETCH_HAPTIC_AND_SOUND,
  FETCH_HAPTIC_AND_SOUND_ERROR,
  SET_SOUND_ENABLED,
  SET_HAPTIC_ENABLED,
} from "../actions/type";


const initialState = {
  loading: false,
  isHapticEnabled: null,
  isSoundEnabled: null,
  error: null,
};

const hapticAndSoundreducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_HAPTIC_AND_SOUND:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_HAPTIC_AND_SOUND:
      return {
        ...state,
        loading: false,
        isHapticEnabled: action.payload.isHapticEnabled,
        isSoundEnabled: action.payload.isSoundEnabled,
      };
    case FETCH_HAPTIC_AND_SOUND_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case SET_SOUND_ENABLED:
      return {
        ...state,
        isSoundEnabled: action.payload,
      };
    case SET_HAPTIC_ENABLED:
      return {
        ...state,
        isHapticEnabled: action.payload,
      };
    default:
      return state;
  }
};

export default hapticAndSoundreducer;
