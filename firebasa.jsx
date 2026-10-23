// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHo1XBl5ESCW9ty-SjXbN55vtOSj5_wKI",
  authDomain: "app-ruben.firebaseapp.com",
  projectId: "app-ruben",
  storageBucket: "app-ruben.firebasestorage.app",
  messagingSenderId: "697084124226",
  appId: "1:697084124226:web:677d57da6cbd666b7be1db",
  measurementId: "G-V8C4VMY5ZG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);