import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "@react-navigation/native";
import CircularProgress from "react-native-circular-progress-indicator";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-simple-toast";

//local component
import QuestionWithOptions from "./component/QuestionWithOptions/index.js";
import HealthBar from "./component/HealthBar/index.js";

//ThemeContext
import { useTheme } from "../../context/ThemeContext";

//DimensionUtils
import { normalize, scaleVertical } from "../../utils/DimensionUtils.js";

//common utils
import { useBackButton } from "../../utils/CommonUtils.js";
import { playSound } from "../../utils/CommonUtils.js";

//Global Components
import BackButton from "../../components/ui/BackButton.js";
import Loader from "../../components/ui/Loader.js";

//redux
import { getQuestionData } from "../../store/actions/QuestionDataAction.js";
import { setCurrentScore } from "../../store/actions/ActivePropertyAction.js";
import { setGameStartTime } from "../../store/actions/ActivePropertyAction.js";

const GameScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { currentTheme } = useTheme();

  const [randomQuestions, setRandomQuestions] = useState();
  const [questionCount, setQuestionCount] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [currentPoints, setCurrentPoints] = useState({ addScore: 0, count: 1 });
  const [progress, setProgress] = useState(0);
  const [isFetching, setIsFetching] = useState(true);
  const [checkAns, setCheckAns] = useState({
    id: null,
    ans: false,
    correctAns: null,
  });

  const isHapticEnabled = useSelector(
    ({ hapticAndSoundreducer }) => hapticAndSoundreducer.isHapticEnabled
  );
  const isSoundEnabled = useSelector(
    ({ hapticAndSoundreducer }) => hapticAndSoundreducer.isSoundEnabled
  );
  const gameId = useSelector(
    ({ activePropertiesReducer }) => activePropertiesReducer.activeGameId
  );
  const levelId = useSelector(
    ({ activePropertiesReducer }) => activePropertiesReducer.activeLevelId
  );
  const questionData = useSelector(
    ({ questionDataReducer }) => questionDataReducer.questionData
  );
  const numberOfQuestionsforEachLevel = useSelector(
    ({ allLevelsReducer }) => allLevelsReducer.numberOfQuestionsGroup
  );

  const numberOfQuestion = useMemo(() => {
    return numberOfQuestionsforEachLevel.find(
      (object) => object[0] === levelId
    )[1];
  }, [numberOfQuestionsforEachLevel, levelId]);

  const filteredQuestionData = useMemo(() => {
    return questionData.flatMap((array) =>
      array.filter((item) => item.levelId === levelId)
    );
  }, [questionData, levelId]);

  const getRandomQuestions = (questions, count) => {
    const copyOfQuestions = [...questions];
    const randomQuestions = [];

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * copyOfQuestions.length);
      const selectedQuestion = copyOfQuestions.splice(randomIndex, 1)[0];
      randomQuestions.push(selectedQuestion);
    }

    return randomQuestions;
  };

  useEffect(() => {
    const getQuestions = getRandomQuestions(filteredQuestionData, 5);
    setRandomQuestions(getQuestions)
  }, [filteredQuestionData, questionData, levelId]);


  useBackButton("CurrentLevel");
  const styles = getStyles(currentTheme);

  const animatedXValue = useRef(new Animated.Value(-10)).current;
  const progressRef = useRef(null);

  const getCurrentTime = () => {
    const gameStartTime = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    const formatter = new Intl.DateTimeFormat("en-US", options);
    const formattedStratDate = formatter.format(gameStartTime);

    return formattedStratDate;
  };

  const fetchingQuestionData = async () => {
    try {
      const whereClause = [
        ["gameId", "==", gameId],
        ["levelId", "==", levelId],
      ];

      const filteredArray = questionData?.filter((array) =>
        array.some((item) => item.levelId === levelId)
      );
      if (!(filteredArray.length > 0)) {
        dispatch(getQuestionData(whereClause));
      }
    } catch (error) {
      Toast.show(`Error fetching question data:, ${error}`, Toast.LONG);
    } finally {
      setIsFetching(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsFetching(true);
      const currentTime = getCurrentTime();
      dispatch(setGameStartTime(currentTime));
      fetchingQuestionData();
    }, [levelId, gameId])
  );

  const answerClickHandler = (id) => {
    if (isDisabled === false) {
      let updatedScore;

      setIsDisabled(true);

      setProgress(0);

      progressRef.current?.reAnimate();

      const correct_option = (
        randomQuestions[questionCount]?.correct_option + 1
      ).toString();

      if (correct_option === id) {
        setCheckAns({ id: id, ans: true, correctAns: correct_option });
        setScore((prevScore) => {
          updatedScore = prevScore + 10;
          return updatedScore;
        });

        setCurrentPoints((prevCount) => ({
          count: prevCount.count + 1,
          addScore: 75 / numberOfQuestion,
        }));
      } else {
        setCheckAns({ id: id, ans: false, correctAns: correct_option });
        setScore((prevScore) => {
          updatedScore = prevScore - 5;
          return updatedScore;
        });

        setCurrentPoints((prevCount) => ({
          count: prevCount.count + 1,
          addScore: -20 / numberOfQuestion,
        }));
      }
      setTimeout(async () => {
        if (questionCount < randomQuestions.length - 1) {
          setQuestionCount((prevCount) => prevCount + 1);
          setCheckAns({ id: null, ans: false });
          setIsDisabled(false);
        } else {
          dispatch(setCurrentScore(updatedScore));
          navigation.navigate("GameOver");
        }
      }, 3000);
    }
  };

  useEffect(() => {
    animateScore();
  }, [score]);

  const animateScore = () => {
    animatedXValue.setValue(-30);
    Animated.timing(animatedXValue, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const handleBackButton = () => {
    if (isHapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isSoundEnabled) {
      playSound();
    }
    navigation.navigate("CurrentLevel");
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/bgImages/gameScreenBgImage.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            {isFetching && (
              <View style={styles.LoaderContainer}>
                <Loader />
              </View>
            )}
            {!isFetching && (
              <>
                <View>
                  <BackButton onPress={handleBackButton} />
                  <View style={styles.healthBarContainer}>
                    <HealthBar currentPoints={currentPoints} />
                  </View>

                  <View style={styles.scoreRankContainer}>
                    <Animated.Text
                      style={[
                        styles.score,
                        { transform: [{ translateX: animatedXValue }] },
                      ]}
                    >
                      {score.toString()}
                    </Animated.Text>
                    <Text style={styles.rankText}>
                      Rank <Text style={styles.rankNumber}>2345</Text>
                    </Text>
                  </View>
                </View>

                {!!isDisabled && (
                  <View
                    style={[
                      styles.loaderWatchContainer,
                      { display: isDisabled ? "flex" : "none" },
                    ]}
                  >
                    <CircularProgress
                      ref={progressRef}
                      value={progress}
                      radius={normalize(60)}
                      maxValue={10}
                      initialValue={10}
                      progressValueColor={currentTheme.white}
                      activeStrokeWidth={normalize(15)}
                      inActiveStrokeWidth={normalize(15)}
                      duration={3000}
                      activeStrokeColor={currentTheme.green}
                    />
                  </View>
                )}
                <View>
                  {Array.isArray(questionData) &&
                    randomQuestions.length > 0 &&(
                      <View>
                        <QuestionWithOptions
                          disabled={isDisabled}
                          questionData={randomQuestions[questionCount]}
                          checkAns={checkAns}
                          answerClickHandler={answerClickHandler}
                          isDisable={isDisabled}
                        />
                      </View>
                    )}
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center",
      alignItems: "center",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.backgroundOpacity,
    },
    container: {
      flex: 1,
      width: "100%",
      justifyContent: "space-between",
      paddingTop: StatusBar.currentHeight,
      paddingVertical: scaleVertical(24),
      padding: normalize(16),
    },
    innerContainer: {
      flex: 1,
      justifyContent: "space-between",
      paddingHorizontal: normalize(12),
    },
    LoaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    healthBarContainer: {
      marginTop: scaleVertical(16),
    },
    loaderWatchContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    scoreRankContainer: {
      marginTop: scaleVertical(24),
      flexDirection: "row",
      justifyContent: "space-between",
    },
    score: {
      color: theme.white,
      fontSize: normalize(40),
      fontWeight: "700",
      lineHeight: scaleVertical(42),
    },
    rankText: {
      color: theme.white,
      fontSize: normalize(16),
      marginRight: normalize(10),
    },
    rankNumber: {
      color: theme.white,
      fontWeight: "700",
      fontSize: normalize(22),
    },
  });

export default GameScreen;
