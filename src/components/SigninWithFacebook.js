import axios from "axios";
import * as Facebook from 'expo-facebook';
import firebase from 'firebase';

const API_KEY = "<YOUR_FIREBASE_API_KEY>";

const authenticate = async (mode, email, password) => {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`

    const response = await axios.post(url, 
        {
            email: email,
            password: password,
            returnSecureToken: true
        }
    )
    const token = response.data.idToken
    const userId = response.data.localId
    const userInfo = {
        token: token,
        userId: userId
    }
    return userInfo
}

// Function for signing in with Facebook
//https://first-project-d387e.firebaseapp.com/__/auth/handler

async function signInWithFacebook() {
    try {
        await Facebook.initializeAsync({
            appId: 'YOUR_FACEBOOK_APP_ID',
        });

        const { type, token } = await Facebook.logInWithReadPermissionsAsync({
            permissions: ['public_profile', 'email'],
        });

        if (type === 'success') {
            // Use Facebook credentials to sign in with Firebase
            const credential = firebase.auth.FacebookAuthProvider.credential(token);
            const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
            const { user } = firebaseUserCredential;
            
            // You can customize the user object returned here based on your requirements
            const userInfo = {
                token: user.getIdToken(),
                userId: user.uid,
                // You can include additional user data here if needed
            };

            return userInfo;
        } else {
            // There was an error during login
            console.log('Login failed!');
            return null;
        }
    } catch (error) {
        console.log('Error:', error.message);
        return null;
    }
}

// Function for signup
export function createUser(email, password) {
    return authenticate('signUp', email, password)
}

// Function for login
export function login(email, password) {
    return authenticate('signInWithPassword', email, password) 
}

// Function for forgot password
export function forgotPassword(email) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`;

    return axios.post(url, {
        email: email,
        requestType: "PASSWORD_RESET"
    });
}

export default {
    createUser,
    login,
    forgotPassword,
    signInWithFacebook
};
