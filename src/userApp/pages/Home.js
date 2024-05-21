import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import placeHolder from '../../resources/placeholder.jpg';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../../commonScripts/firebase';
import { Card, Row, Col, Button, Container } from 'react-bootstrap';

const Home = () => {
  const [user, setUser] = useState(null);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);



  return (
    <main className="container">
      <main className="container py-4">
        <div className="row align-items-center">
          <div className="col-md-6 text-center">
            <h1>Empowering Your Pilgrimage Journey</h1>
            <p className="justify-content-center">
              Dhama App is your one-stop companion for exploring sacred places. Discover hidden gems, navigate with
              interactive maps, and access essential services - all at your fingertips.
              Dhama App now available on Google PlayStore
            </p>
            <a href="https://play.google.com/apps/test/com.shd_gkg.dhama/12" className="btn btn-primary">Download Now</a>
          </div>
          <div className="col-md-6 pt-4">
            <img src={placeHolder} alt="Pilgrimage" className="img-fluid rounded" />
          </div>
        </div>

        <hr />
        <div className="row">
          <div className="col-md-4 text-center">
            <div className="border p-2">
              <a href="maps.html" className="d-block">
                <i className="fas fa-map-marker-alt fa-3x text-primary mb-3"></i>
                <h3>Interactive Maps</h3>
                <p>Find your way easily with detailed maps and pilgrimage route suggestions.</p>
              </a>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <div className="border p-2">
              <Link to="/dhamaServices" className="d-block">
                <i className="fas fa-concierge-bell fa-3x text-primary mb-3"></i>
                <h3>Purohit & Guide Services</h3>
                <p>Connect with qualified purohits and knowledgeable tourist guides for a seamless experience.</p>
              </Link>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <div className="border p-2">
              <a href="#" className="d-block">
                <i className="fas fa-book-open fa-3x text-primary mb-3"></i>
                <h3>Detailed Information</h3>
                <p>Access historical information, rituals, and cultural significance of each pilgrimage site.</p>
              </a>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center mt-3">
            <h2>Become a Partner</h2>
            <p>Contribute to the Dhama community by registering as a:</p>
            <a href="partnerApp.html" className="btn btn-outline-primary">Partner Console</a>
          </div>
        </div>


      </main>
    </main>
  );
};

export default Home;
