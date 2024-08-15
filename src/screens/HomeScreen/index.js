import React, { useEffect, useRef } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Pressable,
  Image,
} from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Haptics from "expo-haptics";
import _ from "lodash";
import Toast from "react-native-simple-toast"
import { SafeAreaView } from "react-native-safe-area-context";

// Context
import { useTheme } from "../../context/ThemeContext";

// Components
import Loader from "../../components/ui/Loader";
import CategoryText from "./components/CategoryText";
import SmallShareButton from "./components/buttons/SmallShareButton";

//common Utils
import { playSound } from "../../utils/CommonUtils";
import { normalize, scaleVertical } from "../../utils/DimensionUtils";

//redux
import { getGameData } from "../../store/actions";
import { setActiveGameIdAndActiveNoOfLevels } from "../../store/actions/ActivePropertyAction";
import { getHighestScores } from "../../store/actions/HighestScoreAction";
import { getSessionsCount } from "../../store/actions";
import { getSoundAndHapticPermission } from "../../store/actions/HapticAndSoundAction";
import { allLevelsAction } from "../../store/actions/AllLevelsAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setInitialArray } from "../../store/actions/TotalDaySessionsScoreAction";
import { getRankOfTheUser } from "../../store/actions/RankAction";

function HomeScreen({ navigation }) {
  const { currentTheme } = useTheme();

  const dispatch = useDispatch();

  const timerRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState("Football");

  const userId = useSelector(({authReducer}) => authReducer.userId)
  const isHapticEnabled = useSelector(
    ({ hapticAndSoundreducer }) => hapticAndSoundreducer.isHapticEnabled
  );
  const isSoundEnabled = useSelector(
    ({ hapticAndSoundreducer }) => hapticAndSoundreducer.isSoundEnabled
  );
  const gameData = useSelector(
    ({ gameDataReducer }) => gameDataReducer.gameData
  );
  const fetchingGameData = useSelector(
    ({ gameDataReducer }) => gameDataReducer.fetchingGameData
  );
  const levelGroups = useSelector(
    ({ allLevelsReducer }) => allLevelsReducer.levelGroups
  );
  const highestScores = useSelector(
    ({ highestScoreReducer }) => highestScoreReducer.highestScores
  );

  const styles = getStyles(currentTheme);

  let gameObject;
  if (gameData) {
    gameObject = gameData.find((item) => item.name === activeCategory);
  }

  function transformGameData() {
    return _.mapValues(levelGroups, (levels) => {
      return _.zipObject(levels, _.fill(Array(levels.length), 0));
    });
  }

  const fetchRankData = () => {
    dispatch(getRankOfTheUser());
  };

  useEffect(() => {
    fetchRankData();
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      fetchRankData();
    }, 1000 * 60 * 60); 
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const getUserIdFromStorage = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId !== null) {
          // userId is retrieved successfully
          dispatch(getGameData());
          const highestScoreWhereClause = [["userId", "==", userId]];
          dispatch(getHighestScores(highestScoreWhereClause));
          dispatch(getSessionsCount(userId));
          dispatch(getSoundAndHapticPermission(userId));
          dispatch(allLevelsAction());
          const initialArray = transformGameData();
          dispatch(setInitialArray(initialArray))
          return userId;
        } else {
          Toast.show(`userId is not stored`, Toast.LONG)
          return null;
        }
      } catch (error) {
        // Error retrieving userId
        Toast.show(`Error retrieving userId from AsyncStorage: ${error}`, Toast.LONG);
        return null;
      }
    };
    getUserIdFromStorage();
  }, [navigation]);

  useEffect(() => {
    dispatch(
      setActiveGameIdAndActiveNoOfLevels(
        gameObject?.id,
        gameObject?.levels,
        gameObject?.name
      )
    );
  }, [gameObject]);


  const findHighestScoreByGameId = () => {
    const filteredArray = _.filter(highestScores, { gameId: gameObject?.id });
    if (_.isEmpty(filteredArray)) {
      return null;
    }
    const highestScoreObject = _.maxBy(filteredArray, "highestScore");
    return highestScoreObject?.highestScore;
  };

  const handleCategory = (id) => {
    setActiveCategory(id);
  };

  const handleSettingBtn = () => {
    navigation.navigate("Settings");
    if (isHapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isSoundEnabled) {
      playSound();
    }
  };

  const handlePlayButton = () => {
    if (isHapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isSoundEnabled) {
      playSound();
    }
    navigation.navigate("Chapters");
  };

  const highestScore = findHighestScoreByGameId();

  return (
    <ImageBackground
      source={require("../../../assets/images/bgImages/chaptersBgImage.png")}
      style={styles.backgroundImage}
    >
      {/* TODO: This is how to use safe area context */}
      {/* <SafeAreaView
        edges={['top', 'right', 'left']}
        style={[
          styles.webviewContainer,
          {backgroundColor: userContext.uiColors.backgroundColorNew, flex: 1,},
        ]}> */}
      <View style={styles.overlay}>
        <View style={styles.container}>
          <>
            <View style={styles.categoriesContainer}>
              <CategoryText
                text="Cricket"
                id="Cricket"
                onPress={handleCategory}
                activeID={activeCategory}
              />
              <CategoryText
                text="Football"
                id="Football"
                onPress={handleCategory}
                activeID={activeCategory}
              />
              <CategoryText
                text="Nature"
                id="Nature"
                onPress={handleCategory}
                activeID={activeCategory}
              />
              <Pressable style={styles.button} onPress={handleSettingBtn}>
                <View style={styles.buttonContent}></View>
              </Pressable>
            </View>
            {fetchingGameData && (
              <View style={styles.LoaderContainer}>
                <Loader />
              </View>
            )}
            {!fetchingGameData && (
              <View>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{activeCategory}</Text>
                </View>
                <Text style={styles.description}>
                  {gameObject?.description}
                </Text>
                <View style={styles.shareButtonContainer}>
                  <SmallShareButton text="share" />
                  <Pressable
                    onPress={handlePlayButton}
                    style={({ pressed }) => [
                      {
                        backgroundColor: pressed
                          ? "rgba(1, 0, 0, 0.2)"
                          : currentTheme.transparent,
                      },
                      styles.playButtonContainer,
                    ]}
                  >
                    {({ pressed }) => (
                      <View style={styles.playButtonInnerContainer}>
                        <Image
                          source={require("../../../assets/playbutton.png")}
                          style={[
                            styles.playButtonIcon,
                            {
                              tintColor: pressed
                                ? currentTheme.white
                                : currentTheme.green,
                            },
                          ]}
                        />
                      </View>
                    )}
                  </Pressable>
                </View>
              </View>
            )}
          </>
        </View>
      </View>
      {/* </SafeAreaView> */}
    </ImageBackground>
  );
}

export default HomeScreen;

const getStyles = (theme) =>
  StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
      padding: normalize(27),
      justifyContent: "space-between",
      paddingBottom: scaleVertical(27),
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
    categoriesContainer: {
      marginTop: scaleVertical(16),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    button: {
      padding: normalize(10),
      borderWidth: normalize(2),
      borderColor: theme.white,
      borderRadius: normalize(30),
    },
    buttonContent: {
      backgroundColor: theme.white,
      height: scaleVertical(10),
      width: scaleVertical(10),
      borderRadius: normalize(20),
    },
    titleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: normalize(36),
      fontWeight: "700",
      color: theme.white,
    },
    score: {
      fontSize: normalize(20),
      fontWeight: "600",
      color: theme.white,
    },
    description: {
      fontSize: normalize(20),
      color: theme.white,
      marginVertical: scaleVertical(10),
    },
    shareButtonContainer: {
      flexDirection: "row",
      marginTop: scaleVertical(10),
      justifyContent: "space-between",
      alignItems: "center",
    },
    playButtonContainer: {
      backgroundColor: theme.white,
      height: normalize(40.33),
      width: normalize(40.33),
      borderRadius: normalize(21.87),
      justifyContent: "center",
      alignItems: "center",
    },
    playButtonInnerContainer: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    playButtonIcon: {
      width: normalize(13),
      height: scaleVertical(15),
    },
  });
