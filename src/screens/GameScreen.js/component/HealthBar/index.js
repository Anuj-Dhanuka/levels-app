import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated, Image, Dimensions } from "react-native";

//Dimensions utils
import { normalize, scaleVertical } from "../../../../utils/DimensionUtils";

//context
import { useTheme } from "../../../../context/ThemeContext";

export default function HealthBar({ currentPoints }) {
  const [score, setScore] = useState(25);
  const [animatedWidth] = useState(new Animated.Value(0));

  const { currentTheme } = useTheme();

  const styles = getStyles(currentTheme);

  const { count, addScore } = currentPoints;
  const updateScore = () => {
    if (score + addScore < 100) {
      setScore((prevScore) => prevScore + addScore);
    } else {
      setScore(100);
    }
  };

  useEffect(() => {
    updateScore();
  }, [addScore, count]);

  const screenWidth =
    Dimensions.get("window").width -
    Dimensions.get("window").width * (27 / 100);

  useEffect(() => {
    const toValue = ((score) / 100) * screenWidth;
    Animated.timing(animatedWidth, {
      toValue: toValue,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [score, screenWidth, addScore]);

  return (
    <View style={styles.topView}>
      <View style={styles.container}>
        <View style={styles.healthBarContainer}>
          <Animated.View style={[styles.healthBar, { width: animatedWidth }]}>
            <Image
              source={require("../../../../../assets/blueflame.png")}
              style={styles.icon}
            />
          </Animated.View>
        </View>
      </View>
      <Image
        style={{ height: scaleVertical(20), width: normalize(25) }}
        source={require("../../../../../assets/loveicon.png")}
      />
      <Image
        style={styles.plusSymbol}
        source={require("../../../../../assets/plussymbol.png")}
      />
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    topView: {
      flexDirection: "row",
      alignItems: "center",
    },
    container: {
      flex: 1,
    },
    healthBarContainer: {
      width: "90%",
      height: scaleVertical(10),
      backgroundColor: theme.gray,
      borderRadius: normalize(10),
      marginRight: normalize(10),
    },
    healthBar: {
      height: "100%",
      backgroundColor: theme.blue,
      borderRadius: normalize(10),
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
    },
    icon: {
      width: normalize(20),
      height: scaleVertical(30),
      position: "absolute",
      right: 0,
      top: -15,
    },

    plusSymbol: {
      height: scaleVertical(12),
      width: normalize(12),
      position: "absolute",
      right: 1,
      top: scaleVertical(8),
    },
  });
