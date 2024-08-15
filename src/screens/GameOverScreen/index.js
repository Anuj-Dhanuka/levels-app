import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
  StatusBar,
  Share
} from "react-native";
import * as Haptics from "expo-haptics";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import firebase from "firebase/compat/app";
import _ from "lodash"
import Toast from "react-native-simple-toast"

//context
import { useTheme } from "../../context/ThemeContext";

//dimension utils
import { normalize, scaleVertical } from "../../utils/DimensionUtils";

//Api utils
import ApiUtils from "../../utils/ApiUtils";

//CommonUtils
import { useBackButton } from "../../utils/CommonUtils";
import { playSound } from "../../utils/CommonUtils";
import { findHighestScoreByLevelId } from "../../utils/CommonUtils";

//redux
import { getHighestScores } from "../../store/actions/HighestScoreAction";
import { getSessionsCount } from "../../store/actions";
import { currentSessionScore } from "../../store/actions/CurrentSessionScoreAction";
import { addTotalDayScore } from "../../store/actions/TotalDaySessionsScoreAction";

const GameOverScreen = ({navigation }) => {
 
  const { currentTheme } = useTheme();

  const dispatch = useDispatch()

  const [isSharing, setIsSharing] = useState(false)
  
  const isHapticEnabled = useSelector(({hapticAndSoundreducer}) => hapticAndSoundreducer.isHapticEnabled)
  const isSoundEnabled = useSelector(({hapticAndSoundreducer}) => hapticAndSoundreducer.isSoundEnabled)
  
  const userId = useSelector(({authReducer}) => authReducer.userId)
  const gameId = useSelector(({activePropertiesReducer}) => activePropertiesReducer.activeGameId)
  const levelId = useSelector(({activePropertiesReducer}) => activePropertiesReducer.activeLevelId)
  const updatedScore = useSelector(({activePropertiesReducer}) => activePropertiesReducer.currentScore)
  const gameStartTime = useSelector(({activePropertiesReducer}) => activePropertiesReducer.gameStartTime)
  const highestScores = useSelector(({highestScoreReducer}) => highestScoreReducer.highestScores)

  const currentHighestScoreObject = findHighestScoreByLevelId(highestScores, levelId)
  const highestScore = currentHighestScoreObject ? currentHighestScoreObject.highestScore : 0

  let currentHighestScore = highestScore;
  
  const styles = getStyles(currentTheme);
  useBackButton('CurrentLevel')
  const defaultSize = 18;

  const getGameEndTime = () => {

    const currentDate = new Date();

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
    const gameEndTime = formatter.format(currentDate);
    return gameEndTime;
  };

  //transfer useEffect
  if (updatedScore > highestScore) {
    currentHighestScore = updatedScore;
  }

  const updateSession = async() => {
    const gameEndTime = getGameEndTime()
    const data = 
      {
        userId: userId,
        gameId: gameId,
        levelid: levelId,
        time_started: gameStartTime,
        time_ended: gameEndTime,
        score: updatedScore,
      }

      await ApiUtils.postSession(data)
  }

  async function updateScore() {
    try {
      
      const collectionName = 'Scores';
      const whereClause = [['userId', '==', userId], ["gameId", "==", gameId ], ["levelId", "==", levelId]];
      const data = {
        gameId: gameId,
        levelId: levelId,
        userId: userId,
        total_score: updatedScore,
        highest_score: currentHighestScore,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };

      await ApiUtils.doPut(collectionName, whereClause, data);
    } catch (error) {
      console.log('Error updating score:', error);
    }
  }

  const updateCurrentHighestScoreInRedux = () => {
    if (updatedScore > highestScore) {
      const highestScoreWhereClause = [["userId", "==", userId]]
      dispatch(getHighestScores(highestScoreWhereClause))
    }
  }

  useEffect(() => {
    updateSession()
    updateScore();
    dispatch(getSessionsCount(userId))
    dispatch(currentSessionScore(updatedScore))
    dispatch(addTotalDayScore(gameId, levelId, updatedScore))
  }, []);

  useEffect(() => {
    updateCurrentHighestScoreInRedux()
  },[updateScore])

  const onClose = () => {
    navigation.navigate("Home")
    if (isHapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isSoundEnabled) {
      playSound();
    }
  };

  const onRetry = () => {
    
    if (isHapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isSoundEnabled) {
      playSound();
    }
    navigation.replace("Game", {
      highestScore,
      key: `Game-${Date.now()}`,
    });
  };

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


  const handleReportBtn = () => {
    if (isHapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isSoundEnabled) {
      playSound();
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/bgImages/gameOverScreen.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Top Container */}
          <View style={styles.topContainer}>
            {/* Cross button */}
            <TouchableOpacity onPress={onClose} style={styles.crossButton}>
              <MaterialIcons
                name="close"
                size={defaultSize}
                color={currentTheme.white}
              />
            </TouchableOpacity>
            {/* Scores for three levels */}
            <View style={styles.scoresContainer}>
              <View style={styles.scoreTextContainer}>
                <Text style={styles.scoreText}>12,464</Text>
                <Image
                  source={require("../../../assets/images/bgImages/gameOverScreen.png")}
                  style={styles.smallImage}
                />
              </View>
              <View style={styles.scoreTextContainer}>
                <Text style={styles.scoreText}>2,464</Text>
                <Image
                  source={require("../../../assets/gameOver2.png")}
                  style={styles.smallImage}
                />
              </View>
              <View style={styles.scoreTextContainer}>
                <Text style={styles.scoreText}>634</Text>
                <Image
                  source={require("../../../assets/images/bgImages/chaptersBgImage.png")}
                  style={styles.smallImage}
                />
              </View>
            </View>
          </View>

          <View style={styles.bottomContainer}>
            <Text style={styles.gameOverText}>Game Over</Text>
            <View style={styles.infoContainer}>
              <View style={styles.scoreBestScoreContainer}>
                <Text style={styles.infoText}>Score:</Text>
                <Text style={styles.scoreValue}>{updatedScore}</Text>
              </View>
              <View style={styles.scoreBestScoreContainer}>
                <Text style={styles.infoText}>Best: </Text>
                <Text style={styles.scoreValue}>{currentHighestScore}</Text>
              </View>
            </View>

            <View style={styles.outerButtonContainer}>
              <View style={styles.buttonsContainer}>
                <Pressable
                  onPress={onRetry}
                  style={({ pressed }) => [
                    styles.playButton,
                    {
                      backgroundColor: pressed
                        ? "rgba(0, 0, 0, 0.1)"
                        : currentTheme.transparent,
                    },
                  ]}
                >
                  {({ pressed }) => (
                    <View style={styles.playButtonContainer}>
                      <Image
                        source={require("../../../assets/playbutton.png")}
                        style={{
                          width: normalize(25),
                          height: scaleVertical(30),
                          tintColor: pressed
                            ? currentTheme.green
                            : currentTheme.green,
                        }}
                      />
                      <Text style={styles.retryText}>Retry</Text>
                    </View>
                  )}
                </Pressable>
                <Pressable
                  onPress={debouncedHandleShareBtn}
                  disabled={isSharing}
                  style={({ pressed }) => [
                    styles.shareButton,
                    {
                      backgroundColor: pressed
                        ? "rgba(0, 0, 0, 0.1)"
                        : currentTheme.transparent,
                    },
                  ]}
                >
                  {({ pressed }) => (
                    <View style={styles.shareButtonContainer}>
                      <Image
                        source={require("../../../assets/shareicon.png")}
                        style={{
                          width: normalize(25),
                          height: scaleVertical(30),
                          tintColor: pressed
                            ? currentTheme.white
                            : currentTheme.white,
                        }}
                      />
                      <Text style={styles.shareText}>Share</Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>

            <View style={styles.reportContainer}>
              <Text style={styles.reportText} onPress={handleReportBtn}>
                Report Lesson
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    background: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center",
    },
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingTop: StatusBar.currentHeight,
    },
    topContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingHorizontal: normalize(20),
      marginTop: scaleVertical(10),
    },
    overlay: {
      flex: 1,
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.backgroundOpacity,
    },
    LoaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    crossButton: {
      padding: normalize(10),
    },
    scoresContainer: {},
    scoreTextContainer: {
      marginTop: scaleVertical(10),
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    scoreText: {
      color: theme.white,
      fontWeight: "700",
      fontSize: normalize(15),
      lineHeight: scaleVertical(16),
      textAlign: "right",
      marginRight: normalize(6),
    },
    smallImage: {
      width: normalize(21),
      height: scaleVertical(21),
      borderRadius: normalize(9),
    },
    scoreValue: {
      color: theme.white,
      fontSize: normalize(35),
      fontWeight: "700",
      lineHeight: scaleVertical(53),
    },
    bottomContainer: {
      alignItems: "flex-start",
      paddingHorizontal: normalize(30),
      paddingBottom: scaleVertical(10),
      width: "100%",
    },
    gameOverText: {
      color: theme.white,
      fontSize: normalize(55),
      marginBottom: scaleVertical(20),
      fontWeight: "bold",
      textAlign: "center",
      width: "100%",
    },
    scoreBestScoreContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    infoContainer: {
      flexDirection: "row",
      marginBottom: scaleVertical(20),
      justifyContent: "space-between",
      width: "100%",
    },
    infoText: {
      color: theme.white,
      fontSize: normalize(26),
      lineHeight: scaleVertical(39),
      fontWeight: "400",
    },
    outerButtonContainer: {
      width: "100%",
    },
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "90%",
      paddingBottom: scaleVertical(50),
      marginTop: scaleVertical(16),
      alignSelf: "center",
    },
    playButton: {
      width: normalize(132),
      height: scaleVertical(77),
      borderRadius: normalize(18),
      borderRadius: normalize(10),
      justifyContent: "center",
      alignItems: "center",
    },
    playButtonContainer: {
      backgroundColor: theme.white,
      flex: 1,
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: normalize(18),
    },
    retryText: {
      fontWeight: "700",
      fontSize: normalize(20),
      lineHeight: scaleVertical(21),
      textAlign: "center",
      color: theme.green,
      marginLeft: normalize(6),
    },
    shareButton: {
      width: normalize(132),
      height: scaleVertical(77),
      borderRadius: normalize(18),
      borderWidth: normalize(2),
      borderColor: theme.gray,
    },
    shareButtonContainer: {
      flex: 1,
      width: "100%",
      borderRadius: normalize(18),
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    shareText: {
      fontWeight: "700",
      fontSize: normalize(20),
      lineHeight: scaleVertical(21),
      textAlign: "center",
      color: theme.white,
      marginLeft: normalize(6),
    },
    reportContainer: {
      alignSelf: "center",
    },
    reportText: {
      color: theme.white,
      fontWeight: "400",
      fontSize: normalize(16),
      lineHeight: scaleVertical(17),
      textAlign: "center",
      marginBottom: scaleVertical(10),
    },
  });

export default GameOverScreen;
