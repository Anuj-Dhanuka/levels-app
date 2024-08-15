import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch} from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase/compat/app";
import Toast from "react-native-simple-toast";

// Assets
import LoginThemeSvgComponent from "../../components/svg/LoginTheme";

// Redux
import { setEmailId, setToken, setUserId } from "../../store/actions";

//context
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

// Utils
import { normalize, scaleVertical } from "../../utils/DimensionUtils";

// Componets
import Button from "../../components/buttons/Button";

//Api utils
import ApiUtils from "../../utils/ApiUtils";

function LoginScreen({ navigation }) {
  const dispatch = useDispatch();

  const { storeUserIdandTokenInContext } = useAuth();
  const { currentTheme } = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  const styles = getStyles(currentTheme);
  const timestamp = firebase?.firestore?.Timestamp?.fromDate(new Date());

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = async () => {
    if (!email) {
      Toast.show("Please enter your email", Toast.LONG);
      return;
    }
    if (!password) {
      Toast.show("Please enter your password", Toast.LONG);
      return;
    }
    setIsLoading(true);
    try {
      const response = await ApiUtils.doLogin(email, password);

      const token = await response.getIdToken();
      const userId = response.uid;

      const data = {
        timestamp: timestamp,
      };
      const whereClause = [["userId", "==", userId]];

      await ApiUtils.updateUserData(whereClause, data);
      await ApiUtils.updateUserData(whereClause, data);

      await AsyncStorage.setItem("userId", String(userId));
      await AsyncStorage.setItem("token", String(token));
      await AsyncStorage.setItem("email", String(email))

      storeUserIdandTokenInContext(userId, token);

      dispatch(setToken(token));
      dispatch(setUserId(userId));
      dispatch(setEmailId(email))
    } catch (error) {
      console.log(error);
      Toast.show(
        "We're sorry, but we couldn't log you in at the moment. Please verify your credentials and try again later. New to our platform? Feel free to sign up and start exploring!",
        Toast.LONG
      );
    } finally {
      setIsLoading(false);
    }
  };


  const handleOnSignup = () => {
    navigation.navigate("Signup");
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword", {email});
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
            size={normalize(24)}
            color={currentTheme.white}
          />
          <LoginThemeSvgComponent />
          <View style={styles.descriptionContainer}>
            <Text style={styles.title}>Own Businesses like Buffett</Text>
            <Text style={styles.titleDescription}>
              Buy Pieces local businesses and invest like a business owner
            </Text>
          </View>

          {/* design for sign in with google */}
          {/* <View style={styles.buttonContainer}>
          <LoginButton text="Continue with Google" />
          <LoginButton text="Continue with Apple" />
        </View> */}

          <View style={styles.loginInputAreaContainer}>
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
            </View>
            <Pressable onPress={toggleShowPassword} style={styles.eyeIcon}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={14}
                color={currentTheme.gray500}
              />
            </Pressable>

            <Button
              onPress={handleLogin}
              loading={isLoading}
              buttonStyle={styles.loginBtn}
            >
              Login
            </Button>
            <Text style={styles.signupText} onPress={handleForgotPassword}>
              Forgot Password
            </Text>
            <Text style={styles.signupText} onPress={handleOnSignup}>
              Don't have an account? Sign Up
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
      padding: normalize(20),
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
      marginTop: scaleVertical(10),
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
    loginInputAreaContainer: {
      width: "90%",
      alignItems: "center",
      marginTop: scaleVertical(20),
    },
    inputView: {
      width: "100%",
      backgroundColor: theme.backgroundInput,
      borderRadius: normalize(25),
      height: scaleVertical(50),
      justifyContent: "center",
      padding: normalize(20),
      marginBottom: scaleVertical(8),
    },
    inputText: {
      height: scaleVertical(50),
      color: theme.white,
    },
    loginBtn: {
      marginVertical: scaleVertical(0),
      paddingVertical: scaleVertical(7),
      borderRadius: normalize(25),
      marginTop: scaleVertical(10),
    },
    loginText: {
      color: theme.white,
      fontWeight: "bold",
    },
    signupText: {
      color: theme.white,
      marginTop: scaleVertical(5),
    },
    eyeIcon: {
      position: "absolute",
      right: normalize(20),
      top: scaleVertical(75),
    },
  });

export default LoginScreen;
