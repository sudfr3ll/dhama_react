import React, { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { Link, Outlet } from "react-router-dom";
import logo from "../resources/logo.jpg";
import login from "../resources/login.png";
import "../resources/css/style.css";
import firebase from "firebase/compat/app";
import "firebase/compat/auth"; 
import { firebaseConfig } from "./firebase"; 
import "firebaseui/dist/firebaseui.css"; 

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function Layout() {
  const [user, setUser] = useState(null);
  const [showAuthContainer, setShowAuthContainer] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signOutGoogle = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error(error.message);
    }
  };

  const signInWithFirebase = async () => {
    setShowAuthContainer(true);
    const firebaseui = await import("firebaseui");
    const ui = new firebaseui.auth.AuthUI(firebase.auth());

    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          setUser(authResult.user);
          localStorage.setItem("user", JSON.stringify(authResult.user));
          if (authResult.additionalUserInfo.isNewUser && authResult.user.phoneNumber) {
            // Prompt for the user's name.
            const name = window.prompt('Please enter your name');
            if (name) {
              authResult.user.updateProfile({ displayName: name });
            }
          }
          return false; // Don't redirect.
        },
        uiShown: function () {
          document.getElementById("firebaseui-auth-container").style.display = "block";
        },
        uiHidden: function () {
          document.getElementById("firebaseui-auth-container").style.display = "none";
        },
      },
      signInFlow: "popup",
      signInOptions: [
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          scopes: ["profile", "email"],
        },
        {
          provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          defaultCountry: 'IN',
          whitelistedCountries: ['IN', '+91'],
          loginHint: 'Enter phone number',
        },
      ],
      tosUrl: "http://localhost:3000/",
      signInSuccessUrl: "http://localhost:3000/",
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  };

  return (
    <>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link
            to="/Home"
            className="navbar-brand d-flex align-items-center text-dark text-decoration-none d-none d-md-block"
          >
            <img
              src={logo}
              alt="Logo"
              className="rounded-circle ms-3 me-1"
              style={{ width: 40, height: 40 }}
            />
            <span className="fs-4">Dhama</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/maps.html">
                  MAPS
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  ABOUT US
                </a>
              </li>
            </ul>
          </div>

          {user ? (
            <div className="user-profile me-2 dropdown d-flex justify-content-end">
              <img
                src={user.photoURL || logo}
                alt={user.displayName || user.phoneNumber || user.uid}
                className="profile-picture rounded-circle ms-3 me-1"
                style={{ width: 40, height: 40 }}
              />
              <span
                className="user-name btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user.displayName || user.phoneNumber}
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    to="/partnerProfile"
                    className="btn btn-outline-primary ms-3 me-3"
                  >
                    Partner Profile
                  </Link>
                </li>
                <li>
                  <a
                    className="btn btn-outline-primary ms-3 me-3"
                    href="/maps.html"
                  >
                    Map
                  </a>
                </li>
                <li>
                  <a
                    className="btn btn-outline-primary ms-3 me-3"
                    href="/dashboard"
                  >
                    Dashboard
                  </a>
                </li>
                <li
                  onClick={signOutGoogle}
                  className="btn btn-outline-danger ms-3 me-3"
                >
                  Sign out
                </li>
              </ul>
            </div>
          ) : (
            <button
              onClick={signInWithFirebase}
              className="form-inline my-2 me-2 my-lg-0"
              type="button"
            >
              <img
                id="userAvatar"
                src={login}
                alt="Login"
                className="rounded-circle ms-2 signInIcon"
              />
              <span id="login">Login</span>
            </button>
          )}
        </nav>

        {showAuthContainer && (
          <div className="auth-container" id="firebaseui-auth-container"></div>
        )}
      </div>
      <Outlet />
    </>
  );
}

export default Layout;
