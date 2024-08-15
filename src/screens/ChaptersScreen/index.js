import React, { useCallback,  useMemo,  useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  StatusBar,
  Image,
  Platform,
  Share
} from "react-native";
import * as Haptics from "expo-haptics";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import Toast from "react-native-simple-toast"

//global component
import BackButton from "../../components/ui/BackButton";

//context
import { useTheme } from "../../context/ThemeContext";

//dimension utils
import { normalize, scaleVertical } from "../../utils/DimensionUtils";

//redux
import {
  setActiveLevelId,
  setActiveCurrentLevel,
} from "../../store/actions";

//common utils
import { playSound } from "../../utils/CommonUtils";
import { useFocusEffect } from "@react-navigation/native";

export default function ChaptersScreen({ navigation }) {
  const dispatch = useDispatch();

  const { currentTheme } = useTheme();

  const [activeSessionRef, setActiveSessionRef] = useState()
  const [activeHighestScores, setActiveHighestScores] = useState()

  const isHapticEnabled = useSelector(({hapticAndSoundreducer}) => hapticAndSoundreducer.isHapticEnabled)
  const isSoundEnabled = useSelector(({hapticAndSoundreducer}) => hapticAndSoundreducer.isSoundEnabled)
  const gameId = useSelector(
    ({ activePropertiesReducer }) => activePropertiesReducer.activeGameId
  );
  const gameType = useSelector(
    ({ activePropertiesReducer }) => activePropertiesReducer.activeGameName
  );
  const numOfLevels = useSelector(
    ({ activePropertiesReducer }) => activePropertiesReducer.activeNoOfLevels
  );
  const highestScores = useSelector(
    ({ highestScoreReducer }) => highestScoreReducer.highestScores
  );
  const sessionsCountRef = useSelector(
    ({ sessionsReducer }) => sessionsReducer.SessionCount
  );

  const result = _.find(activeSessionRef, (obj) => obj[gameId]);
  let sessionsCount = 0;
  if (result) {
    sessionsCount = result[gameId];
  }
  const levelGroups = useSelector(({allLevelsReducer}) => allLevelsReducer.levelGroups)  
  const levelsArray = _.get(levelGroups, gameId, [])

  const styles = getStyles(currentTheme);

  const getStatusBarHeight = () => {
    return Platform.OS === "android" ? StatusBar.currentHeight : 20;
  };

  useFocusEffect(
    useCallback(() => {
      setActiveSessionRef(sessionsCountRef)
      setActiveHighestScores(highestScores)
    },[sessionsCountRef, highestScores, navigation, activeHighestScores])
  )

  const findHighestScoreByGameId = () => {
    const filteredArray = _.filter(activeHighestScores, { gameId: gameId });
    if (_.isEmpty(filteredArray)) {
      return null;
    }
    const highestScoreObject = _.maxBy(filteredArray, "highestScore");
    return highestScoreObject;
  };

  const currentHighestScoreObject = findHighestScoreByGameId();
  let currentHighestScore;

  if (currentHighestScoreObject) {
    currentHighestScore = currentHighestScoreObject.highestScore;
  } else {
    currentHighestScore = 0;
  }


  const handlePlayButton = (level) => {
    const activeLevel = levelsArray[level];
    dispatch(setActiveCurrentLevel(level + 1));

    dispatch(setActiveLevelId(activeLevel));
    navigation.navigate("CurrentLevel");

    if (isHapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isSoundEnabled) {
      playSound();
    }
  };

  const renderLevelButtons = () => {
    const buttons = [];
    for (let i = 0; i < numOfLevels; i++) {
      const mylevel = i;
      buttons.push(
        <ChapterButton
          key={i}
          chapter={`Chapter ${i + 1}`}
          handlePlayButton={() => handlePlayButton(mylevel)}
        />
      );
    }
    return buttons;
  };

  const handleBackButton = () => {
    if (isHapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isSoundEnabled) {
      playSound();
    }
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/bgImages/chaptersBgImage.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={[{ marginTop: getStatusBarHeight() }]}>
            <BackButton onPress={handleBackButton} />
            <View style={[styles.topContainer]}>
              <Text style={[styles.gameName]}>{gameType}</Text>
              <Text style={styles.text}>
                You Played {sessionsCount} times till now
              </Text>
              <Text style={styles.text}>
                Highest Score: {currentHighestScore}
              </Text>
            </View>
          </View>
          <View style={styles.content}>{renderLevelButtons()}</View>
        </View>
      </View>
    </ImageBackground>
  );
}

const ChapterButton = ({ chapter, handlePlayButton }) => {
  const { currentTheme } = useTheme();

  const [isSharing, setIsSharing] = useState(false)
  const isHapticEnabled = useSelector(({hapticAndSoundreducer}) => hapticAndSoundreducer.isHapticEnabled)
  const isSoundEnabled = useSelector(({hapticAndSoundreducer}) => hapticAndSoundreducer.isSoundEnabled)

  
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


  const styles = getStyles(currentTheme);

  return (
    <View style={styles.chapterContainer}>
      <Text style={styles.chapter}>{chapter}</Text>
      <Pressable
        onPress={handlePlayButton}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: pressed
              ? "rgba(0, 0, 0, 0.1)"
              : currentTheme.transparent,
          },
        ]}
      >
        {({ pressed }) => (
          <View>
            <Image
              source={require("../../../assets/playbutton.png")}
              style={{
                width: normalize(13),
                height: scaleVertical(15),
                tintColor: pressed ? currentTheme.green : currentTheme.green,
              }}
            />
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
          <View>
            <Image
              source={require("../../../assets/shareicon.png")}
              style={{
                width: normalize(13),
                height: scaleVertical(15),
                tintColor: pressed ? currentTheme.white : currentTheme.white,
              }}
            />
          </View>
        )}
      </Pressable>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: normalize(27),
      paddingVertical: scaleVertical(0),
      justifyContent: "space-between",
    },
    backgroundImage: {
      flex: 1,
      width: "100%",
      height: "100%",
      resizeMode: "cover", // to cover the entire background
    },
    overlay: {
      flex: 1,
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.backgroundOpacity,
    },
    topContainer: {
      marginTop: normalize(10),
    },
    content: {
      alignItems: "center",
    },
    currentScore: {
      color: theme.white,
      fontWeight: "700",
      fontSize: normalize(30),
    },

    chapterContainer: {
      backgroundColor: theme.backgroundOpacity,
      padding: normalize(10),
      paddingVertical: scaleVertical(16),
      paddingHorizontal: normalize(16),
      flexDirection: "row",
      borderRadius: normalize(10),
      alignItems: "center",
      marginVertical: scaleVertical(5),
    },
    chapter: {
      flex: 1,
      fontSize: normalize(18),
      color: theme.white,
    },
    button: {
      borderWidth: normalize(1),
      borderColor: theme.gray,
      borderRadius: normalize(10),
      paddingVertical: scaleVertical(10),
      paddingHorizontal: normalize(16),
      justifyContent: "center",
      alignItems: "center",
      marginRight: normalize(10),
    },
    shareButton: {
      borderWidth: normalize(1),
      borderColor: theme.gray,
      borderRadius: normalize(10),
      paddingHorizontal: normalize(16),
      paddingVertical: scaleVertical(10),
      justifyContent: "center",
      alignItems: "center",
    },
    gameName: {
      fontSize: normalize(24),
      fontWeight: "bold",
      marginBottom: scaleVertical(10),
      color: theme.white,
    },
    text: {
      color: theme.white,
      fontSize: normalize(18),
    },
  });
