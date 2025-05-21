// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdpX2VuX7sMwy1VbFmGZ1oBm0A2ykFZRM",
  authDomain: "sendmoneyapp-f9119.firebaseapp.com",
  projectId: "sendmoneyapp-f9119",
  storageBucket: "sendmoneyapp-f9119.firebasestorage.app",
  messagingSenderId: "12907570665",
  appId: "1:12907570665:web:591c7e38023b9319d59778"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log("auth", auth);

export { auth };