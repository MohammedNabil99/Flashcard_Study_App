// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwAQVevjV6DPp0Fxtg9A-wg9Vm23jahAM",
  authDomain: "flashcardsaas-8e8e0.firebaseapp.com",
  projectId: "flashcardsaas-8e8e0",
  storageBucket: "flashcardsaas-8e8e0.appspot.com",
  messagingSenderId: "725387230418",
  appId: "1:725387230418:web:ad03aaaee8b7544262410b",
  measurementId: "G-1ZWVG1RXWF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
