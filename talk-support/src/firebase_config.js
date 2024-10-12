// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0cgR3P2JmuI3jPB5Ysaqdm1xxqg0s9_M",
  authDomain: "talksupport-b542c.firebaseapp.com",
  projectId: "talksupport-b542c",
  storageBucket: "talksupport-b542c.appspot.com",
  messagingSenderId: "869249249110",
  appId: "1:869249249110:web:a3165cbfc46e721493b0f7",
  measurementId: "G-NH3N5E2QZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
