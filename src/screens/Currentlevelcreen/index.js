import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Pressable,
  Linking,
  Share
} from "react-native";
import * as Haptics from "expo-haptics";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Toast from "react-native-simple-toast"
import _ from "lodash"

//redux
import { removeEmailId, removeToken, removeUserId } from "../../store/actions";

//global component
import PlayButton from "../../components/buttons/PlayButton";
import BackButton from "../../components/ui/BackButton";

//context
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

//Dimension utils
import { normalize, scaleVertical } from "../../utils/DimensionUtils";

//common utils
import {
  removeUserIdAndTokenFromStorage,
  playSound,
} from "../../utils/CommonUtils";
import { findHighestScoreByLevelId } from "../../utils/CommonUtils";

function Currentlevelcreen({ navigation }) {
  const dispatch = useDispatch();

  const { removeUserIdandTokenFromContext } = useAuth();

  const [isSharing, setIsSharing] = useState(false)
  const [presentRank, setRank] = useState(0)

  const isHapticEnabled = useSelector(
    ({ hapticAndSoundreducer }) => hapticAndSoundreducer.isHapticEnabled
  );
  const isSoundEnabled = useSelector(
    ({ hapticAndSoundreducer }) => hapticAndSoundreducer.isSoundEnabled
  );
  const userId = useSelector(({authReducer}) => authReducer.userId)
  const rankArray = useSelector(
    ({ rankReducer }) => rankReducer.rank
  );

  const currentLevel = useSelector(
    ({ activePropertiesReducer }) => activePropertiesReducer.activeCurrentLevel
  );
  const activeLevelId = useSelector(
    ({ activePropertiesReducer }) => activePropertiesReducer.activeLevelId
  );
  const highestScores = useSelector(
    ({ highestScoreReducer }) => highestScoreReducer.highestScores
  );
  const sessionScore = useSelector(
    ({ currentSessionReducer }) => currentSessionReducer.sessionScore
  );
  const timeOfLastUpdate = useSelector(({rankReducer}) => rankReducer.timeOfLastUpdate) 
  const currentHighestScoreObject = findHighestScoreByLevelId(
    highestScores,
    activeLevelId
  );

  const numberOfQuestionsforEachLevel = useSelector(
    ({ allLevelsReducer }) => allLevelsReducer.numberOfQuestionsGroup
  );

  const numberOfQuestion = useMemo(() => {
    return numberOfQuestionsforEachLevel.find(
      (object) => object[0] === activeLevelId
    )[1]; 
  }, [numberOfQuestionsforEachLevel, activeLevelId]);

  useEffect(() => {
    const fetchIndexByUserIdAndLevelId = (scoresByLevel, levelId, userId) => {
      const scores = scoresByLevel[levelId] || [];
      const index = scores.findIndex((score) => score.userId === userId);
      return index !== -1 ? index + 1 : scores.length + 2;
    };
    const rank = fetchIndexByUserIdAndLevelId(rankArray, activeLevelId, userId)
    setRank(rank)

  }, [rankArray, activeLevelId, userId])


  let highestScore;

  if (currentHighestScoreObject) {
    highestScore = currentHighestScoreObject.highestScore;
  } else {
    highestScore = 0;
  }

  const { currentTheme } = useTheme();
  const styles = getStyles(currentTheme);

  const handleLogout = async () => {
    if (isHapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isSoundEnabled) {
      playSound();
    }
    dispatch(removeToken());
    dispatch(removeUserId());
    dispatch(removeEmailId());
    removeUserIdandTokenFromContext();
    await removeUserIdAndTokenFromStorage();
  };

  const handlePlayButton = () => {
    if (isHapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isSoundEnabled) {
      playSound();
    }
    navigation.navigate("Game");
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

  const handleBackButton = () => {
    if (isHapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isSoundEnabled) {
      playSound();
    }
    navigation.navigate("Chapters");
  };

  const handleFeedbackButton = async () => {
    if (isHapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isSoundEnabled) {
      playSound();
    }
    const url = "https://forms.gle/xKt445h4J6tVJ3DJ6";
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Don't know how to open URL: ${url}`);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/bgImages/HomeBgImage.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <>
          <View style={styles.topOuterContainer}>
            <BackButton onPress={handleBackButton} />
            <View style={styles.topContainer}>
              <View>
                <Text style={styles.currentScore}>{sessionScore}</Text>
                <View style={styles.bestScoreContainer}>
                  <Text style={styles.bestText}>Best</Text>
                  <Text style={styles.bestScore}>{highestScore}</Text>
                </View>
              </View>
              <View style={styles.rankContainer}>
              <View style={styles.bestScoreContainer}>
                <Text style={styles.rankText}>Rank</Text>
                <Text style={styles.bestScore}>{presentRank}</Text>
              </View>
              <Text style={styles.rankDescription}>Last updated at: {timeOfLastUpdate}</Text>
              </View>
      
            </View>
          </View>

          <View>
            <Text style={styles.levelText}>Level {currentLevel}</Text>
            <Text style={styles.levelUpText}>Score {numberOfQuestion * 10} to level up.</Text>
            <Text style={styles.levelUpText} onPress={handleLogout}>
              Logout
            </Text>
          </View>

          <View style={styles.bottomContainer}>
            <View style={styles.buttonContainer}>
              <PlayButton imageType="play" onPress={handlePlayButton} />
              <PlayButton imageType="share" onPress={debouncedHandleShareBtn} />
            </View>
            <Pressable
              style={styles.feedbackTextContainer}
              onPress={handleFeedbackButton}
              disabled={isSharing}
            >
              <Text style={styles.feedbackText}>
                Give Feedback {String.fromCodePoint("0x1F64F")}
              </Text>
            </Pressable>
          </View>
        </>
      </View>
    </ImageBackground>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: "cover",
      alignItems: "center",
    },
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingTop: StatusBar.currentHeight,
      paddingHorizontal: normalize(24),
    },
    LoaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    topOuterContainer: {},
    topContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    currentScore: {
      color: theme.white,
      fontWeight: "bold",
      fontSize: normalize(36),
    },
    bestScoreContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    bestText: {
      color: theme.white,
      fontSize: normalize(20),
      marginRight: normalize(10),
    },
    bestScore: {
      color: theme.white,
      fontWeight: "bold",
      fontSize: normalize(22),
    },
    rankContainer : {
      alignItems: "flex-end",
      width: "60%",
      textAlign: "right",
    },
    rankDescription : {
      color: theme.white,
      textAlign: "right",
    },
    rankText: {
      color: theme.white,
      fontSize: normalize(16),
      marginRight: normalize(10),
      fontWeight: "bold"
    },
    middleContainer: {},
    levelText: {
      color: theme.white,
      fontWeight: "bold",
      fontSize: normalize(40),
    },
    levelUpText: {
      color: theme.white,
      fontSize: normalize(16),
    },
    bottomContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    buttonContainer: {
      width: "90%",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    feedbackTextContainer: {
      flexDirection: "row",
      width: "90%",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: scaleVertical(18),
    },
    feedbackText: {
      color: theme.white,
      textAlign: "center",
      marginRight: normalize(8),
      fontSize: normalize(18),
    },
  });

export default Currentlevelcreen;
