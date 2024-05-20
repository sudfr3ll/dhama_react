import React from 'react';
import ReactDOM from 'react-dom/client';
import './pages/index.css';
import App from './app.js';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from './pages/firebase.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);