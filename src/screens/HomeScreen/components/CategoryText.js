import { Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useSelector } from "react-redux";

//context
import { useTheme } from "../../../context/ThemeContext";

//Dimension utils
import { normalize } from "../../../utils/DimensionUtils";

//common utils
import { playSound } from "../../../utils/CommonUtils";

function CategoryText({ text, id, activeID, onPress }) {
  const { currentTheme } = useTheme();

  const isHapticEnabled = useSelector(({hapticAndSoundreducer}) => hapticAndSoundreducer.isHapticEnabled)
  const isSoundEnabled = useSelector(({hapticAndSoundreducer}) => hapticAndSoundreducer.isSoundEnabled)

  const styles = getStyles(currentTheme);

  const handleOnChangeCategory = () => {
    onPress(id);
    if (isHapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isSoundEnabled) {
      playSound();
    }
  };

  return (
    <Text
      style={[styles.categoryText, activeID === id && styles.ActiveCategory]}
      onPress={handleOnChangeCategory}
    >
      {text}
    </Text>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    categoryText: {
      color: theme.white,
      fontSize: normalize(18),
      fontWeight: "400",
    },
    ActiveCategory: {
      borderBottomWidth: normalize(3),
      borderBottomColor: theme.green,
    },
  });

export default CategoryText;
