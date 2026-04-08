// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCh4QzFmbymGHQnA6iIyRs67q2bZ7rAVLE",
  authDomain: "fibree-2dd03.firebaseapp.com",
  projectId: "fibree-2dd03",
  storageBucket: "fibree-2dd03.firebasestorage.app",
  messagingSenderId: "1071836813882",
  appId: "1:1071836813882:web:4408b91e6bbb76d60f3303",
  measurementId: "G-Y08KP92X77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
const analytics = getAnalytics(app);