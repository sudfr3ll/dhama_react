import React, { useState, useEffect} from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

import "./firebase.js"; // Assuming this is the correct path to your firebase.js file
import { Outlet, Link } from "react-router-dom";
import logo from "../../resources/logo.jpg"
import login from "../../resources/login.png"



function Layout() {
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);

  //user = localStorage.getItem('user');
  useEffect(() => {
    // Check for existing user data on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const signOutGoogle = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link
            to="/Home"
            className="navbar-brand d-flex align-items-center  text-dark text-decoration-none d-none d-md-block"
          >
            <img
              src= {logo}
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
                src={user.photoURL}
                alt={user.displayName}
                className="profile-picture signInIcon me-2"
              />
              <span
                className="user-name btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user.displayName}
              </span>
              <ul className="dropdown-menu">
              <li>
                <Link to="/partnerProfile" className="btn btn-outline-primary ms-3 me-3">Partner Profile</Link>
                </li>
                <li>
                  <a className ="btn btn-outline-primary ms-3 me-3"  href="/maps.html">map</a>
                </li>
                <li>
                  <a className ="btn btn-outline-primary ms-3 me-3"  href="/dashboard">Dashboard</a>
                </li>
                <li onClick={signOutGoogle} className="btn btn-outline-danger  ms-3 me-3">Sign out</li>
              
              </ul>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
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
      </div>

      <Outlet />
    </>
  );
}

export default Layout;
