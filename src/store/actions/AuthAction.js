import AsyncStorage from "@react-native-async-storage/async-storage";

//types
import { SET_TOKEN, SET_USER_ID, REMOVE_TOKEN, REMOVE_USER_ID, FETCH_FROM_ASYNC_STORAGE, SET_EMAIL_ID, REMOVE_EMAIL_ID } from "./type";

export const setToken = (token) => ({
  type: SET_TOKEN,
  payload: token,
});

export const setUserId = (userId) => ({
  type: SET_USER_ID,
  payload: userId,
});

export const setEmailId = (email) => ({
  type: SET_EMAIL_ID,
  payload: email,
})

export const removeToken = () => ({
  type: REMOVE_TOKEN,
});

export const removeUserId = () => ({
  type: REMOVE_USER_ID,
});

export const removeEmailId = () => ({
  type: REMOVE_EMAIL_ID
})

export const fetchFromAsyncStorage = () => {
  return async dispatch => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      const email = await AsyncStorage.getItem('email')
      dispatch({ type: FETCH_FROM_ASYNC_STORAGE, payload: { userId, token, email } });
    } catch (error) {
      console.log('Error fetching data from AsyncStorage:', error);
    }
  };
};