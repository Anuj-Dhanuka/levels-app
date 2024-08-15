//types
import {
  SET_TOKEN,
  SET_USER_ID,
  SET_EMAIL_ID,
  REMOVE_TOKEN,
  REMOVE_USER_ID,
  REMOVE_EMAIL_ID,
  FETCH_FROM_ASYNC_STORAGE,
} from "../actions/type";

const initialState = {
  token: null,
  userId: null,
  email: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case SET_USER_ID:
      return {
        ...state,
        userId: action.payload,
      };
    case REMOVE_TOKEN:
      return {
        ...state,
        token: null,
      };
    case REMOVE_USER_ID:
      return {
        ...state,
        userId: null,
      };
    case SET_EMAIL_ID:
      return {
        ...state,
        email: action.payload,
      };
    case REMOVE_EMAIL_ID : 
      return {
        ...state,
        email: null
      }  
    case FETCH_FROM_ASYNC_STORAGE:
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.userId,
        email: action.payload.email
      };
    default:
      return state;
  }
};

export default authReducer;
