import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";

//Api utils
import ApiUtils from "../../utils/ApiUtils";

//components
import LoginThemeSvgComponent from "../../components/svg/LoginTheme";
import Button from "../../components/buttons/Button";

//context
import { useTheme } from "../../context/ThemeContext";

//Dimension Utils
import { normalize, scaleVertical } from "../../utils/DimensionUtils";

const ForgotPasswordScreen = ({ navigation, route }) => {

  const { currentTheme } = useTheme();

  const emailThroughLogin = route.params.email
  const [email, setEmail] = useState(emailThroughLogin);
  const [isLoading, setIsLoading] = useState(false);

  const styles = getStyles(currentTheme);

  const handleForgotPassword = async () => {
    if (email === "") {
      Toast.show("Please enter your email", Toast.LONG);
      return;
    }

    setIsLoading(true);
    
    try {
      await ApiUtils.doResetPassword(email);
      Toast.show(
        "If your account exists, we'll send you a reset link shortly",
        Toast.LONG
      );

    } catch (error) {
      Toast.show(
        "Failed to send password reset email. Please try again.",
        Toast.LONG
      );

    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
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

          <View style={styles.loginInputAreaContainer}>

            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor={currentTheme.gray500}
              />
            </View>

            <Button
              onPress={handleForgotPassword}
              loading={isLoading}
              buttonStyle={styles.button}
            >
              RESET PASSWORD
            </Button>

            <Text style={styles.fpLoginText} onPress={handleLogin}>
              or login
            </Text>

          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

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
      justifyContent: "center",
      alignItems: "center",
    },
    icon: {
      alignSelf: "flex-end",
      marginBottom: scaleVertical(20),
    },
    image: {
      width: "100%",
      height: scaleVertical(200),
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
      marginBottom: scaleVertical(20),
      justifyContent: "center",
      padding: normalize(20),
    },
    inputText: {
      height: scaleVertical(50),
      color: theme.white,
    },
    fpTitle: {
      color: theme.white,
      fontSize: normalize(28),
      fontWeight: "bold",
      marginBottom: scaleVertical(30),
    },
    fpInput: {
      width: "90%",
      borderWidth: 1,
      borderColor: theme.backgroundInput,
      borderRadius: normalize(8),
      paddingVertical: scaleVertical(12),
      paddingHorizontal: normalize(20),
      marginVertical: scaleVertical(10),
      width: normalize(300),
      color: theme.white,
    },
    button: {
      marginVertical: scaleVertical(0),
      paddingVertical: scaleVertical(7),
      borderRadius: normalize(25),
    },

    fpLoginText: {
      color: theme.white,
      marginTop: scaleVertical(10),
    },
  });

export default ForgotPasswordScreen;
