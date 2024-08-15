import { combineReducers } from "redux";

//reducers
import gameDataReducer from "./GameReducer";
import activePropertiesReducer from "./ActivePropertiesReducer";
import authReducer from "./AuthReducer";
import sessionsReducer from "./SessionsReducer";
import highestScoreReducer from "./HighestScoreReducer";
import questionDataReducer from "./QuestionDataReducer";
import hapticAndSoundreducer from "./HapticAndSoundReducer";
import allLevelsReducer from "./AllLevelsReducer";
import currentSessionReducer from "./CurrentSessionScoreReducer";
import rankReducer from "./RankReducer";

export default combineReducers({
  gameDataReducer: gameDataReducer,
  activePropertiesReducer: activePropertiesReducer,
  authReducer: authReducer,
  sessionsReducer: sessionsReducer,
  questionDataReducer: questionDataReducer,
  highestScoreReducer: highestScoreReducer,
  hapticAndSoundreducer: hapticAndSoundreducer,
  allLevelsReducer: allLevelsReducer,
  currentSessionReducer: currentSessionReducer,
  rankReducer: rankReducer,
});