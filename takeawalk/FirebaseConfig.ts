// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpHHGGYqmhXNntwSjlmF3oCs6nHsWuRMU",
  authDomain: "takeawalk-67969.firebaseapp.com",
  projectId: "takeawalk-67969",
  storageBucket: "takeawalk-67969.appspot.com",
  messagingSenderId: "200427027271",
  appId: "1:200427027271:web:57baaa1c856746d7a16a62",
  measurementId: "G-HNX360KWMF"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);

const analytics = getAnalytics(FIREBASE_APP);