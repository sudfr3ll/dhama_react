
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";



export const firebaseConfig = {
  apiKey: "AIzaSyABydWlZKECFzO5rojqjK8JWP3s1SvOjz4",
  authDomain: "vrajamap-5d3bd.firebaseapp.com",
  projectId: "vrajamap-5d3bd",
  storageBucket: "vrajamap-5d3bd.appspot.com",
  messagingSenderId: "177990267234",
  appId: "1:177990267234:web:21fb04b5eacf4c9694bc3b",
  measurementId: "G-V7RW0C3TLQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase auth
export { auth };