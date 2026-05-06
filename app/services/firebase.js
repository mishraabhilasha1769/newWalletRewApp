// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjD_-9SmjcHrJcLYnthjKHc8uPEl7OF1Y",
  authDomain: "rewardapp-26291.firebaseapp.com",
  projectId: "rewardapp-26291",
  storageBucket: "rewardapp-26291.firebasestorage.app",
  messagingSenderId: "715890797469",
  appId: "1:715890797469:web:d90b40858c0fcc7e42dd74",
  measurementId: "G-T2SH3DMCVH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;