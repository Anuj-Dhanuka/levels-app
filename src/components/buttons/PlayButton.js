import React from "react";
import { Pressable, View, StyleSheet, Image } from "react-native";

//context
import { useTheme } from "../../context/ThemeContext";

//dimension utils
import { normalize, scaleVertical } from "../../utils/DimensionUtils";

const PlayButton = ({ imageType, onPress }) => {
  const { currentTheme } = useTheme();

  const styles = getStyles(currentTheme, imageType);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed
            ? "rgba(0, 0, 0, 0.1)"
            : currentTheme.transparent,
        },
      ]}
    >
      <View>
        <Image
          source={
            imageType === "play"
              ? require("../../../assets/playbutton.png")
              : require("../../../assets/shareicon.png")
          }
          style={[styles.image]}
        />
      </View>
    </Pressable>
  );
};

const getStyles = (theme, imageType) =>
  StyleSheet.create({
    button: {
      width: "45%",
      borderWidth: normalize(1),
      borderColor: theme.gray,
      borderRadius: normalize(10),
      padding: normalize(10),
      paddingVertical: scaleVertical(24),
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: normalize(25),
      height: scaleVertical(30),
      tintColor: imageType === "play" ? theme.green : theme.white,
    },
  });

export default PlayButton;
