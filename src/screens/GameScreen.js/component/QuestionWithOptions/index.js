import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

//context
import { useTheme } from "../../../../context/ThemeContext";

//local component
import OptionButton from "../buttons/OptionButton";

//Dimension utils
import { normalize, scaleVertical } from "../../../../utils/DimensionUtils";

const QuestionWithOptions = ({
  questionData,
  checkAns,
  answerClickHandler,
  isDisable,
}) => {
  const { currentTheme } = useTheme();

  const styles = getStyles(currentTheme);

  let correctOption = null;

  if (checkAns.id != checkAns.correctAns) {
    correctOption = checkAns.correctAns;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{questionData?.question}</Text>
      <View style={[styles.fireSymbolContainer, { display: isDisable? "flex" : "none" }]}>
        <Image
          source={require("../../../../../assets/fireSymbol.png")}
          style={styles.fireSymbol}
        />
      </View>
      <View style={styles.dummyView}></View>
      <View style={styles.optionsContainer}>
        <OptionButton
          text={questionData?.options[0]}
          buttonId="1"
          answerClickHandler={answerClickHandler}
          checkAns={checkAns}
          correctOption={correctOption}
        />
        <OptionButton
          text={questionData?.options[1]}
          buttonId="2"
          answerClickHandler={answerClickHandler}
          checkAns={checkAns}
          correctOption={correctOption}
        />
      </View>
      <View style={styles.optionsContainer}>
        <OptionButton
          text={questionData?.options[2]}
          buttonId="3"
          answerClickHandler={answerClickHandler}
          checkAns={checkAns}
          correctOption={correctOption}
        />
        <OptionButton
          text={questionData?.options[3]}
          buttonId="4"
          answerClickHandler={answerClickHandler}
          checkAns={checkAns}
          correctOption={correctOption}
        />
      </View>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {},
    question: {
      color: theme.white,
      fontWeight: "700",
      fontSize: normalize(30),
      lineHeight: scaleVertical(32),
      marginBottom: scaleVertical(50),
    },
    optionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: scaleVertical(5),
    },
    fireSymbol: {
      position: "absolute",
      top: -40,
      display: "flex",
      height: scaleVertical(40),
      width: normalize(50),
      alignSelf: "center",
    },
    clockContainer: {
      width: "100%",
      alignItems: "center",
    },
    clockText: {
      color: "white",
      fontWeight: "400",
      position: "absolute",
    },
    dummyView: {
      marginTop: scaleVertical(15),
    },
  });

export default QuestionWithOptions;
