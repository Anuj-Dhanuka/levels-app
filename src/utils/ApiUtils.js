import { store } from "../store/reducers/store";

import { db } from "../config.js/firebaseConfig";
import { auth } from "../config.js/firebaseConfig";
import {
  GAMES,
  USERS,
  LEVELS,
  SESSION,
  SCORES,
  QUESTIONS,
} from "../constants/api-constants";

class ApiUtils {
  static async doSignup(email, password) {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async doLogin(email, password) {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async doResetPassword(email) {
    try {
      await auth.sendPasswordResetEmail(email);
    } catch (error) {
      throw error;
    }
  }

  

  static async doGet(collectionName, whereClauses = [] , orderByField = null, orderByDirection = null) {
    try {
      let collectionRef = db.collection(collectionName);

      if (whereClauses.length > 0) {
        whereClauses.forEach((clause) => {
          const [field, operator, value] = clause;
          collectionRef = collectionRef.where(field, operator, value);
        });
      }

      if (orderByField && orderByDirection) {
        collectionRef = collectionRef.orderBy(orderByField, orderByDirection);
      }

      const response = await collectionRef.get();
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async doPost(collectionName, data) {
    try {
      const collectionRef = db.collection(collectionName);
      const documentRef = await collectionRef.add(data);
      return { success: true, documentId: documentRef.id };
    } catch (error) {
      throw error;
    }
  }

  static async doPut(collectionName, whereClauses, data) {
    try {
      const collectionRef = db.collection(collectionName);

      if (collectionName === "User") {
        // If the collection name is 'User', check if any document exists
        let query = collectionRef;
        whereClauses.forEach((clause) => {
          query = query.where(...clause);
        });

        const querySnapshot = await query.get();
        if (!querySnapshot.empty) {
          // Document(s) exist(s), update the first matching document
          const docId = querySnapshot.docs[0].id;
          await collectionRef.doc(docId).update(data);
          return "success";
        } else {
          // No document found, return without creating a new document
          return "No documents found";
        }
      } else {
        // For other collections, proceed with the normal update/create process
        let query = collectionRef;
        whereClauses.forEach((clause) => {
          query = query.where(...clause);
        });

        const querySnapshot = await query.get();
        if (!querySnapshot.empty) {
          // Document(s) exist(s), update the first matching document
          const docId = querySnapshot.docs[0].id;
          await collectionRef.doc(docId).update(data);
          return "success";
        } else {
          // No document found, create a new one
          await collectionRef.add(data);
          return "success";
        }
      }
    } catch (error) {
      throw error;
    }
  }

  static async doDelete(url) {
    try {
      const { authToken } = store.getState().loginReducer;
      const response = await axios.delete(url, {
        headers: {
          Authorization: authToken,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async postUserData(data) {
    return await ApiUtils.doPost(USERS, data);
  }

  static async updateUserData(whereClause, data) {
    return await ApiUtils.doPut(USERS, whereClause, data);
  }

  static async getGameData() {
    return await ApiUtils.doGet(GAMES);
  }

  static async getAllLevelIdsOfActiveGame(whereClause) {
    return await ApiUtils.doGet(LEVELS, whereClause);
  }

  static async getAllLeves() {
    return await ApiUtils.doGet(LEVELS);
  }

  static async getSessionsCount(whereClause) {
    return await ApiUtils.doGet(SESSION, whereClause);
  }

  static async getQuestionData(whereClause) {
    return await ApiUtils.doGet(QUESTIONS, whereClause);
  }

  static async getHighestScores(whereClauses) {
    return await ApiUtils.doGet(SCORES, whereClauses);
  }

  static async postSession(data) {
    return await ApiUtils.doPost(SESSION, data);
  }

  static async getSoundAndHapticPermission(whereClauses) {
    return await ApiUtils.doGet(USERS, whereClauses);
  }

  static async updateHapticSetting(whereClauses, data) {
    return await ApiUtils.doPut(USERS, whereClauses, data);
  }

  static async updateSoundSetting(whereClauses, data) {
    return await ApiUtils.doPut(USERS, whereClauses, data);
  }

  static async getRankOfTheUser(orderByField, orderByDirection) {
    return await ApiUtils.doGet(SCORES, whereClauses = [], orderByField, orderByDirection)
  }
}

export default ApiUtils;
