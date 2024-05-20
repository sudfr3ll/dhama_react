
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals


// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyABydWlZKECFzO5rojqjK8JWP3s1SvOjz4",
  authDomain: "vrajamap-5d3bd.firebaseapp.com",
  projectId: "vrajamap-5d3bd",
  storageBucket: "vrajamap-5d3bd.appspot.com",
  messagingSenderId: "177990267234",
  appId: "1:177990267234:web:21fb04b5eacf4c9694bc3b",
  measurementId: "G-V7RW0C3TLQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);