import React from 'react';
import ReactDOM from 'react-dom/client';
import './pages/index.css';
import App from './app.js';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const firebaseConfig = {
  apiKey: "AIzaSyCaALwKF261OTm8a6rebAIvH6XIpWFA6d8",
  authDomain: "vrajamap-5d3bd.firebaseapp.com",
  projectId: "vrajamap-5d3bd",
  storageBucket: "vrajamap-5d3bd.appspot.com",
  messagingSenderId: "177990267234",
  appId: "1:177990267234:web:93f6ed246a552e5094bc3b",
  measurementId: "G-MDKGZEVF53"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);