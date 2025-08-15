// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  updateProfile,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4187JbVe_PAiEhVO6KVYbFK2XPtYJEdw",

  authDomain: "starbound-conquest-a1adc.firebaseapp.com",

  projectId: "starbound-conquest-a1adc",

  storageBucket: "starbound-conquest-a1adc.firebasestorage.app",

  messagingSenderId: "633304307229",

  appId: "1:633304307229:web:8f9421b404e42d67f2d8f4",

  measurementId: "G-RVKT69QFBM",
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const FIREBASE_DB = getFirestore(FIREBASE_APP); // <-- this is Firestore Database
const FIREBASE_STORE = getStorage(FIREBASE_APP);
// Export instances for use
export {
  FIREBASE_APP,
  FIREBASE_AUTH,
  FIREBASE_STORE,
  ref,
  uploadBytes,
  getDownloadURL,
  updateProfile,
  FIREBASE_DB,
};
