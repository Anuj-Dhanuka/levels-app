//types
import {SET_SESSION_COUNT, FETCHING_SESSION_COUNT, UPDATE_SESSION_COUNT, FETCHING_SESSION_ERROR} from "../actions/type";
  
  const initialState = {
    SessionCount: null,
    fetchingSessionCount: false,
    sessionCountError: null,
  };
  
  const sessionsReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_SESSION_COUNT:
        return {
          ...state,
          SessionCount: action.payload,
          fetchingSessionCount: false,
        };
        case UPDATE_SESSION_COUNT:
            return {
              ...state,
              SessionCount: action.payload,
              fetchingSessionCount: false,
            }; 
      case FETCHING_SESSION_COUNT:
        return {
          ...state,
          fetchingSessionCount: action.payload,
        };
      case FETCHING_SESSION_ERROR:
        return {
          ...state,
          sessionCountError: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default sessionsReducer;
  