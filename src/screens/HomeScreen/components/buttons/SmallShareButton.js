import { useCallback, useState } from "react";
import { Pressable, View, Text, Image, StyleSheet, Share } from "react-native";
import { useSelector } from "react-redux";
import * as Haptics from "expo-haptics";
import Toast from "react-native-simple-toast"
import _ from "lodash"

//context
import { useTheme } from "../../../../context/ThemeContext";

//Dimension utils
import { scaleVertical, normalize } from "../../../../utils/DimensionUtils";

//common utils
import { playSound } from "../../../../utils/CommonUtils";

function SmallShareButton({ text }) {
  const { currentTheme } = useTheme();

  const [isSharing, setIsSharing] = useState(false);

  const isHapticEnabled = useSelector(
    ({ hapticAndSoundreducer }) => hapticAndSoundreducer.isHapticEnabled
  );
  const isSoundEnabled = useSelector(
    ({ hapticAndSoundreducer }) => hapticAndSoundreducer.isSoundEnabled
  );

  const styles = getStyles(currentTheme);

  const handleShareBtn = useCallback(async () => {
    setIsSharing(true)
    if (isHapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isSoundEnabled) {
      playSound();
    }
    try {
        await Share.share({
        message: "Check out this awesome levels app!",
      });
    } catch (error) {
      Toast.show(`Error sharing:: ${error.message}`, Toast.LONG);
    } finally {
      setIsSharing(false)
    }
  }, [isSharing, isHapticEnabled, isSoundEnabled, playSound]);

  const debouncedHandleShareBtn = useCallback(_.debounce(handleShareBtn, 2000, { leading: true, trailing: false }), [handleShareBtn]);

  return (
    <Pressable
      onPress={debouncedHandleShareBtn}
      style={({ pressed }) => [
        styles.shareButton,
        {
          backgroundColor: pressed ? "rgba(0, 0, 0, 0.1)" : "transparent",
        },
      ]}
    >
      {({ pressed }) => (
        <View style={styles.buttonContainer}>
          <Image
            source={require("../../../../../assets/shareicon.png")}
            style={[
              styles.shareIcon,
              { tintColor: pressed ? currentTheme.white : currentTheme.white },
            ]}
          />
          {text && <Text style={styles.shareText}>{text}</Text>}
        </View>
      )}
    </Pressable>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    shareButton: {
      borderWidth: 1,
      borderColor: theme.gray,
      borderRadius: normalize(10),
      width: normalize(79),
      height: scaleVertical(34),
      justifyContent: "center",
      alignItems: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    shareIcon: {
      width: normalize(14),
      height: scaleVertical(15),
    },

    shareText: {
      color: theme.white,
      marginLeft: normalize(6),
      fontSize: normalize(12),
      fontWeight: "700",
    },
  });

export default SmallShareButton;
