// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB708PrsFXeYASYJ_MXZ5JFmakLQK3je3M",
  authDomain: "momentos-eternos-5e14f.firebaseapp.com",
  projectId: "momentos-eternos-5e14f",
  storageBucket: "momentos-eternos-5e14f.appspot.com",
  messagingSenderId: "692980463024",
  appId: "1:692980463024:web:7e1a6e98fbc1634efa5275",
  measurementId: "G-3QGQB1ZJ6B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { fireDB, auth, storage}
