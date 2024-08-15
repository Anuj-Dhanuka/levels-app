import { Audio } from "expo-av";
import { useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from "lodash";

export const playSound = async (
  fileName = require("../../assets/Audios/buttonSounds/clickSound.mp3")
) => {
  const soundObject = new Audio.Sound();
  try {
    await soundObject.loadAsync(fileName);
    await soundObject.playAsync();
  } catch (error) {
    // Failed to play sound
  }
};

export const useBackButton = (routeName, params) => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            // Navigate to home screen when back button is pressed
            if(params) {
              navigation.navigate(routeName, params);
            } 
            else {
              navigation.navigate(routeName)
            }
            return true; // Prevent default behavior (e.g., exit app)
          });
      
          return () => backHandler.remove(); 
    },[navigation, routeName, params])
  )
};

export const removeUserIdAndTokenFromStorage = async () => {
  try {
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.log('Error removing userId and token from AsyncStorage:', error);
  }
};

export const findHighestScoreByLevelId = (dataArray, id) => {
  const filteredArray = _.filter(dataArray, { levelId: id });
  
  // If no matching objects are found, return null
  if (_.isEmpty(filteredArray)) {
    return null;
  }
  
  // Use lodash maxBy to find the object with the highest highestScore
  const highestScoreObject = _.maxBy(filteredArray, 'highestScore');

  return highestScoreObject;
};
