import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase/compat/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";

//global component
import LoginThemeSvgComponent from "../../components/svg/LoginTheme";
import Button from "../../components/buttons/Button";

//API Utils
import ApiUtils from "../../utils/ApiUtils";

//reducers
import { setToken, setUserId, setEmailId } from "../../store/actions/AuthAction";

//context
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

//DimensionUtils
import { normalize, scaleVertical } from "../../utils/DimensionUtils";

function SignupScreen({ navigation }) {
  const dispatch = useDispatch();

  const { currentTheme } = useTheme();
  const { storeUserIdandTokenInContext } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [showconfirmPassword, setShowconfirmPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const styles = getStyles(currentTheme);
  const timestamp = firebase?.firestore?.Timestamp?.fromDate(new Date());

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowconfirmPassword = () => {
    setShowconfirmPassword(!showconfirmPassword);
  };

  const handleSignup = async () => {
    
    if (email === "") {
      Toast.show("Please enter your email", Toast.LONG);
      return;
    }
  
    if (password === "") {
      Toast.show("Please enter your password", Toast.LONG);
      return;
    }
  
    if (confirmPassword === "") {
      Toast.show("Please confirm your password", Toast.LONG);
      return;
    }
  
    if (password !== confirmPassword) {
      Toast.show("Password and confirm password do not match", Toast.LONG);
      return;
    }
  
    try {
      setIsLoading(true);
  
      const response = await ApiUtils.doSignup(email, password);
  
      const token = await response.getIdToken();
      const userId = response.uid;
  
      const data = {
        userId: userId,
        timestamp: timestamp,
        is_haptic_enable: false,
        is_sound_enable: false,
      };
  
      await ApiUtils.postUserData(data);
      
      await AsyncStorage.setItem("userId", String(userId));
      await AsyncStorage.setItem("token", String(token));
      await AsyncStorage.setItem("email", String(email))
  
      storeUserIdandTokenInContext(userId, token); //context

      dispatch(setToken(token))
      dispatch(setUserId(userId))
      dispatch(setEmailId(email))
  
    } catch (error) {
      Toast.show(
        "Cannot create user, please check your input and try again",
        Toast.LONG
      );
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleOnLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.innerContainer}>
          <AntDesign
            style={styles.icon}
            name="close"
            size={24}
            color={currentTheme.white}
          />
          <LoginThemeSvgComponent />
          <View style={styles.descriptionContainer}>
            <Text style={styles.title}>Own Businesses like Buffett</Text>
            <Text style={styles.titleDescription}>
              Buy Pieces local businesses and invest like a business owner
            </Text>
          </View>

          <View style={styles.signinInputAreaContainer}>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                placeholderTextColor={currentTheme.gray500}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Password"
                placeholderTextColor={currentTheme.gray500}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                secureTextEntry={showPassword}
              />
              <Pressable onPress={toggleShowPassword} style={styles.eyeIcon}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={normalize(14)}
                  color={currentTheme.gray500}
                />
              </Pressable>
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Confirm Password"
                placeholderTextColor={currentTheme.gray500}
                value={confirmPassword}
                onChangeText={setconfirmPassword}
                autoCapitalize="none"
                secureTextEntry={showconfirmPassword}
              />
              <Pressable
                onPress={toggleShowconfirmPassword}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showconfirmPassword ? "eye-off" : "eye"}
                  size={normalize(14)}
                  color={currentTheme.gray500}
                />
              </Pressable>
            </View>
            <Button
              onPress={handleSignup}
              loading={isLoading}
              buttonStyle={styles.sigupBtn}
            >
              SIGNUP
            </Button>
            <Text style={styles.loginText} onPress={handleOnLogin}>
              Already have an account? Login
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: normalize(20),
      backgroundColor: theme.backgroundSecondary,
    },
    innerContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      paddingBottom: scaleVertical(16),
    },
    icon: {
      alignSelf: "flex-end",
      marginBottom: scaleVertical(20),
    },
    descriptionContainer: {
      alignItems: "center",
      marginTop: scaleVertical(6),
      padding: normalize(20),
    },
    title: {
      fontSize: normalize(40),
      fontWeight: "bold",
      color: theme.white,
      marginBottom: scaleVertical(10),
      textAlign: "center",
    },
    titleDescription: {
      color: theme.white,
      fontSize: normalize(18),
      textAlign: "center",
    },
    signinInputAreaContainer: {
      width: "90%",
      alignItems: "center",
      marginTop: scaleVertical(10),
    },

    inputView: {
      width: "100%",
      backgroundColor: theme.backgroundInput,
      borderRadius: normalize(25),
      height: scaleVertical(50),
      marginBottom: scaleVertical(8),
      justifyContent: "center",
      padding: normalize(20),
    },
    inputText: {
      height: scaleVertical(50),
      color: theme.white,
    },
    sigupBtn: {
      marginVertical: scaleVertical(0),
      paddingVertical: scaleVertical(7),
      borderRadius: normalize(25),
      marginTop: scaleVertical(10),
    },
    signupText: {
      color: theme.white,
      fontWeight: "bold",
    },
    loginText: {
      color: theme.white,
      marginTop: scaleVertical(10),
    },
    eyeIcon: {
      position: "absolute",
      right: normalize(20),
    },
  });

export default SignupScreen;
