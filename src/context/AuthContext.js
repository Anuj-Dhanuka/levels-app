import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const storeUserIdandTokenInContext = (userId, token) => {
    setUser({ userId, token });
  };

  const removeUserIdandTokenFromContext = () => {
    setUser(null);
  };

  const getUserIdFromStorage = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");
      if (userId !== null) {
        setUser({ userId, token });
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error retrieving User Id from AsyncStorage:", error);
      return null;
    }
  };

  useEffect(() => {
    getUserIdFromStorage()
    
  }, []);

  const value = {
    user,
    storeUserIdandTokenInContext,
    removeUserIdandTokenFromContext,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
