import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";

//redux
import { fetchFromAsyncStorage } from "../store/actions";

//context
import { useAuth } from "../context/AuthContext";

//screens
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen/index.js";

import HomeScreen from "../screens/HomeScreen";
import ChaptersScreen from "../screens/ChaptersScreen";
import Currentlevelcreen from "../screens/Currentlevelcreen";
import GameScreen from "../screens/GameScreen.js";
import GameOverScreen from "../screens/GameOverScreen/index.js";
import SettingsScreen from "../screens/SettingsScreen";


const Stack = createNativeStackNavigator();

function Navigation() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFromAsyncStorage());
  }, []);

  const { user } = useAuth();

  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Chapters" component={ChaptersScreen} />
          <Stack.Screen name="CurrentLevel" component={Currentlevelcreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="GameOver" component={GameOverScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
