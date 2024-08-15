
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// import * as firebase from 'firebase';
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAcxaZAf6ZlGhbmu7E-LmXqIaxQaugxoAU",
  authDomain: "first-project-d387e.firebaseapp.com",
  databaseURL:
    "https://first-project-d387e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "first-project-d387e",
  storageBucket: "first-project-d387e.appspot.com",
  messagingSenderId: "717370174275",
  appId: "1:717370174275:web:41b38698a262bd587c9df6",
  measurementId: "G-5S7QJYLK9D",
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();