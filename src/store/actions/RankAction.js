//Api Utils
import ApiUtils from "../../utils/ApiUtils";
import Toast from "react-native-simple-toast";
import moment from "moment";

//types
import {
  FETCH_RANK_ERROR,
  SET_RANK_ARRAY,
  FETCH_RANK,
  TIME_OF_UPDATE,
} from "./type";

export const getRankOfTheUser = () => async (dispatch) => {
  dispatch({ type: FETCH_RANK, payload: true });
  try {
    const response = await ApiUtils.getRankOfTheUser("total_score", "desc");

    const scoresByLevel = {};

    response.forEach((doc) => {
      const { userId, levelId, total_score } = doc.data();
      if (!scoresByLevel[levelId]) {
        scoresByLevel[levelId] = [];
      }
      scoresByLevel[levelId].push({ userId, total_score });
    });
    dispatch({ type: SET_RANK_ARRAY, payload: scoresByLevel });
     dispatch({ type: TIME_OF_UPDATE, payload: moment().format("HH:mm") });
  } catch (error) {
    dispatch({ type: FETCH_RANK_ERROR, payload: error });
    Toast.show(error, Toast.LONG);
  }
};


function YourComponent() {
  const [scoresByLevel, setScoresByLevel] = useState([]);

  useEffect(() => {
    const fetchScoresByLevel = async () => {
      try {
        const snapshot = await db
          .collection('Scores')
          .orderBy('total_score', 'desc')
          .get();

        const scoresByLevelMap = new Map();

        snapshot.forEach((doc) => {
          const { userId, levelId, total_score } = doc.data();
          if (!scoresByLevelMap.has(levelId)) {
            scoresByLevelMap.set(levelId, []);
          }
          scoresByLevelMap.get(levelId).push({ userId, total_score });
        });

        const scoresByLevelArray = Array.from(scoresByLevelMap.entries()).map(
          ([levelId, scores]) => ({
            levelId,
            scores,
          })
        );

        setScoresByLevel(scoresByLevelArray);
      } catch (error) {
        console.error('Error fetching scores by level:', error);
      }
    };

    fetchScoresByLevel();
  }, []);

  return (
    <div>
      <h1>Scores By Level</h1>
      <ul>
        {scoresByLevel.map((level) => (
          <li key={level.levelId}>
            <h2>Level ID: {level.levelId}</h2>
            <ul>
              {level.scores.map((score) => (
                <li key={score.userId}>
                  User ID: {score.userId}, Total Score: {score.total_score}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default YourComponent;
