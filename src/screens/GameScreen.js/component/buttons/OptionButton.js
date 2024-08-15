import React, { useState } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useSelector } from "react-redux";

//context
import { useTheme } from "../../../../context/ThemeContext";

//dimension utils
import { normalize, scaleVertical } from "../../../../utils/DimensionUtils";

//common utils
import { playSound } from "../../../../utils/CommonUtils";

const OptionButton = ({
  text,
  buttonId,
  answerClickHandler,
  checkAns,
  correctOption,
}) => {
  
  const { currentTheme } = useTheme();

  const isHapticEnabled = useSelector(({hapticAndSoundreducer}) => hapticAndSoundreducer.isHapticEnabled)
  const isSoundEnabled = useSelector(({hapticAndSoundreducer}) => hapticAndSoundreducer.isSoundEnabled)
  let hasGreenBorder = false;

  if (buttonId === correctOption) {
    hasGreenBorder = true;
  }

  const styles = getStyles(currentTheme, hasGreenBorder);

  let btnBackgroundColor = "transparent";
  let btnBorderWidth = hasGreenBorder ? scaleVertical(4) : scaleVertical(2);
  
  if (checkAns.id === buttonId) {
    btnBorderWidth = 0;
    if (checkAns.ans) {
      btnBackgroundColor = currentTheme.green;
    } else {
      btnBackgroundColor = currentTheme.red;
    }
  }
  const [isPressed, setIsPressed] = useState(false);


  const handlePress = () => {
    if (isHapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isSoundEnabled) {
      playSound();
    }
    setIsPressed(!isPressed);
    answerClickHandler(buttonId);
  };

  return (
    <Pressable
      style={[
        styles.optionButton,
        { backgroundColor: btnBackgroundColor, borderWidth: btnBorderWidth },
      ]}
      onPress={handlePress}
      id={buttonId}
    >
      <Text style={styles.optionText}>{text}</Text>
    </Pressable>
  );
};

const getStyles = (theme, hasGreenBorder) =>
  StyleSheet.create({
    optionButton: {
      height: scaleVertical(94),
      borderWidth: normalize(2),
      borderColor: hasGreenBorder ? theme.green : theme.gray,
      backgroundColor: theme.transparent,
      marginVertical: scaleVertical(5),
      borderRadius: normalize(14),
      alignItems: "center",
      justifyContent: "center",
      width: scaleVertical(340 / 2),
      padding: normalize(4),
    },
    optionText: {
      fontSize: normalize(20),
      color: theme.white,
      fontWeight: "700",
      textAlign: "center",
    },
  });

export default OptionButton;
