import { View, Button, StyleSheet } from "react-native";

//question data util
import { questionsData1 } from "../../utils/QuestionData";

//context
import { useTheme } from "../../context/ThemeContext";

//config
import { db } from "../../config.js/firebaseConfig";

//Api utils
import ApiUtils from "../../utils/ApiUtils";

function PostQuestions() {

  const postQuestions = async() => {
    try {
      const batch = db.batch();
      questionsData1.forEach(question => {
          const docRef = db.collection("Questions").doc();
          batch.set(docRef, question);
      });
      await batch.commit();
      console.log("Questions added successfully to Firestore!");
  } catch (error) {
      console.error("Error adding questions to Firestore:", error);
  }
  }


  const { currentTheme } = useTheme();
  const styles = getStyles(currentTheme);

  const handleAdd = async () => {
    postQuestions()
  };
  return (
    <View style={styles.container}>
      <Button title="Add" onPress={handleAdd} />
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default PostQuestions;
