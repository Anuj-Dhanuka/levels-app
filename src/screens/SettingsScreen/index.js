import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Pressable,
} from "react-native";
import * as Haptics from "expo-haptics";
import Toast from "react-native-simple-toast";

//vector icons
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

//context
import { useTheme } from "../../context/ThemeContext";

//Dimensions Utils
import { normalize, scaleVertical } from "../../utils/DimensionUtils";

//common utils
import { playSound } from "../../utils/CommonUtils";

//redux
import { updateHaptic, updateSound } from "../../store/actions/HapticAndSoundAction";


//Api utils
import ApiUtils from "../../utils/ApiUtils";

const SettingsScreen = ({ navigation }) => {

  const dispatch = useDispatch();

  const { currentTheme } = useTheme();

  const [isSoundOn, setIsSoundOn] = useState(false);
  const [isHapticOn, setIsHapticon] = useState(false);

  const userId = useSelector(({ authReducer }) => authReducer.userId);
  const email = useSelector(({ authReducer }) => authReducer.email);
  
  const isHapticEnabled = useSelector(({hapticAndSoundreducer}) => hapticAndSoundreducer.isHapticEnabled)
  const isSoundEnabled = useSelector(({hapticAndSoundreducer}) => hapticAndSoundreducer.isSoundEnabled)
  const styles = getStyles(currentTheme);
  const defaultSize = normalize(18);

  const updateHapticSetting = async (isHapticEnabled) => {
    try {
      const whereClauses = [["userId", "==", userId]];
      const data = { is_haptic_enable: isHapticEnabled };
      await ApiUtils.updateHapticSetting(whereClauses, data);
    } catch (error) {
      Toast.show(error, Toast.LONG);
    }
  };

  const updateSoundSetting = async (isSoundEnabled) => {
    try {
      const whereClauses = [["userId", "==", userId]];
      const data = { is_sound_enable: isSoundEnabled };
      await ApiUtils.updateSoundSetting(whereClauses, data);
    } catch (error) {
      Toast.show(error, Toast.LONG);
    }
  };

  useEffect(() => {
    setIsHapticon(isHapticEnabled);
    setIsSoundOn(isSoundEnabled);
  }, []);

  const toggleSound = async () => {
    setIsSoundOn(!isSoundOn);
    if (isSoundOn) {
      dispatch(updateSound(false));
      await updateSoundSetting(false);
    } else {
      playSound();
      dispatch(updateSound(true));
      await updateSoundSetting(true);
    }
    if (isHapticOn) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const toggleHaptic = async () => {
    setIsHapticon(!isHapticOn);
    if (isHapticOn) {
      dispatch(updateHaptic(false));
      await updateHapticSetting(false);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      dispatch(updateHaptic(true));
      await updateHapticSetting(true);
    }
    if (isSoundOn) {
      playSound();
    }
  };

  const handleClose = () => {
    navigation.navigate("Home");
    if (isHapticOn) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isSoundOn) {
      playSound();
    }
  };

  const handleFeedbackBtn = async () => {
    const url = "https://forms.gle/xKt445h4J6tVJ3DJ6";
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Toast.show(`Don't know how to open URL: ${url}`, Toast.LONG);
    }
  };

  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.settingsText}>Settings</Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <View style={styles.closeButtonContqainer}>
            <MaterialIcons
              name="close"
              size={defaultSize}
              color={currentTheme.white}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.innerContainer}>
        <View>
          <Text style={styles.sectionHeading}>ACCOUNT</Text>
          <View style={styles.sectionContainer}>
            <View style={styles.tripletsContainer}>
              <View style={styles.contentWrapper}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={defaultSize}
                  color={currentTheme.white}
                />
                <Text style={styles.contentText}>Email</Text>
              </View>

              <Text style={[styles.contentText, styles.emailAddress]}>
                {email}
              </Text>
            </View>
            <View style={styles.line}></View>

            <TouchableOpacity style={styles.contentWrapper}>
              <FontAwesome6
                name="square-plus"
                size={defaultSize}
                color={currentTheme.white}
              />
              <Text style={styles.contentText}>Build a Level</Text>
            </TouchableOpacity>
            <View style={styles.line}></View>
            <View style={styles.contentWrapper}>
              <AntDesign
                name="setting"
                size={defaultSize}
                color={currentTheme.white}
              />
              <Text style={styles.contentText}>Game Pass</Text>
              <Text style={[styles.contentText, styles.activeText]}>
                Active
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.sectionHeading}>APP</Text>
          <View style={styles.sectionContainer}>
            <View style={styles.tripletsContainer}>
              <View style={styles.contentWrapper}>
                <Ionicons
                  name="musical-notes"
                  size={defaultSize}
                  color={currentTheme.white}
                />
                <Text style={styles.contentText}>Sound</Text>
              </View>

              <TouchableOpacity onPress={toggleSound}>
                <View
                  style={[
                    styles.toggleButton,
                    isSoundOn ? styles.toggleOn : styles.toggleOff,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleCircle,
                      isSoundOn
                        ? styles.toggleCircleOn
                        : styles.toggleCircleOff,
                    ]}
                  ></View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.line}></View>
            <View style={styles.tripletsContainer}>
              <View style={styles.contentWrapper}>
                <MaterialCommunityIcons
                  name="waves"
                  size={defaultSize}
                  color={currentTheme.white}
                />
                <Text style={styles.contentText}>Haptic Feedback</Text>
              </View>
              <TouchableOpacity onPress={toggleHaptic}>
                <View
                  style={[
                    styles.toggleButton,
                    isHapticOn ? styles.toggleOn : styles.toggleOff,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleCircle,
                      isHapticOn
                        ? styles.toggleCircleOn
                        : styles.toggleCircleOff,
                    ]}
                  ></View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.sectionHeading}>Help Us Improve</Text>
          <View style={styles.sectionContainer}>
            <Pressable onPress={handleFeedbackBtn}>
              <View style={styles.contentWrapper}>
                <MaterialIcons
                  name="feedback"
                  size={defaultSize}
                  color={currentTheme.white}
                />
                <Text style={styles.contentText}>Give Feedback</Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View>
          <Text style={styles.sectionHeading}>ABOUT</Text>
          <View style={styles.sectionContainer}>
            <View style={styles.contentWrapper}>
              <AntDesign
                name="questioncircle"
                size={defaultSize}
                color={currentTheme.white}
              />
              <Text style={styles.contentText}>How to Play</Text>
            </View>
            <View style={styles.line}></View>
            <View style={styles.contentWrapper}>
              <MaterialIcons
                name="my-library-books"
                size={defaultSize}
                color={currentTheme.white}
              />
              <Text style={styles.contentText}>Terms of Use</Text>
            </View>
            <View style={styles.line}></View>
            <View style={styles.contentWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={defaultSize}
                color={currentTheme.white}
              />
              <Text style={styles.contentText}>Privacy Policy</Text>
            </View>
            <View style={styles.line}></View>
            <View style={styles.contentWrapper}>
              <Feather name="x" size={defaultSize} color={currentTheme.white} />
              <Text style={styles.contentText}>Follow us on X</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: scaleVertical(60),
    },
    innerContainer: {
      flex: 1,
      justifyContent: "space-between",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: scaleVertical(20),
    },
    settingsText: {
      color: theme.white,
      fontSize: normalize(20),
      fontWeight: "bold",
      textAlign: "center",
      flex: 1,
    },
    closeButtonContqainer: {
      backgroundColor: theme.card,
      padding: normalize(5),
      borderRadius: normalize(15),
    },
    closeButton: {
      borderRadius: normalize(20),
      padding: normalize(5),
    },
    sectionHeading: {
      color: theme.heading600,
      fontSize: normalize(14),
      lineHeight: scaleVertical(22),
      letterSpacing: -0.41,
      fontWeight: "400",
      marginLeft: normalize(26),
      marginBottom: scaleVertical(5),
    },
    sectionContainer: {
      backgroundColor: theme.card,
      paddingHorizontal: normalize(18),
    },
    contentWrapper: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: scaleVertical(5),
      padding: normalize(10),
    },
    contentText: {
      color: theme.white,
      marginLeft: normalize(10),
      fontSize: normalize(17),
      lineHeight: scaleVertical(22),
      letterSpacing: -0.41,
      fontWeight: "normal",
    },
    emailAddress: {
      fontSize: normalize(17),
      lineHeight: scaleVertical(22),
      textAlign: "right",
      letterSpacing: -0.41,
      fontWeight: "400",
      marginLeft: "auto",
      color: theme.heading500,
    },
    tripletsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      paddingRight: normalize(10),
    },
    activeText: {
      fontSize: normalize(17),
      lineHeight: scaleVertical(22),
      textAlign: "right",
      letterSpacing: -0.41,
      fontWeight: "400",
      marginLeft: "auto",
      color: theme.heading500,
    },
    toggleButton: {
      width: normalize(53),
      height: scaleVertical(32),
      borderRadius: normalize(19),
      padding: 2,
    },
    toggleOn: {
      backgroundColor: theme.green,
      justifyContent: "flex-end",
    },
    toggleOff: {
      backgroundColor: theme.gray500,
      justifyContent: "flex-start",
    },
    toggleCircle: {
      width: normalize(25),
      height: scaleVertical(28),
      borderRadius: normalize(17),
      backgroundColor: theme.white,
    },
    toggleCircleOn: {
      marginLeft: "auto",
    },
    toggleCircleOff: {
      marginRight: "auto",
    },
    line: {
      height: 1,
      backgroundColor: theme.backgroundLine,
      width: "90%",
      alignSelf: "flex-end",
    },
  });

export default SettingsScreen;
