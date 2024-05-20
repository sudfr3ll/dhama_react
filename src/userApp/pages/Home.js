import React from 'react';
import { Link } from 'react-router-dom';
import Calendar from './calander';
import placeHolder from '../../resources/placeholder.jpg'

function Home()
{

    return(
        <main className = "container">
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
              <img src= {placeHolder} alt="Pilgrimage" className="img-fluid rounded" />
            </div>
          </div>
    
          <hr />
          <a href="partner.html" className="d-block">
                  <i className="fas fa-map-marker-alt fa-3x text-primary mb-3"></i>
                  <h3>Partner console</h3>
                </a>
          <div className="row">
            <div className="col-md-4 text-center  ">
              <div className="border p-2">
                <a href="maps.html" className="d-block">
                  <i className="fas fa-map-marker-alt fa-3x text-primary mb-3"></i>
                  <h3>Interactive Maps</h3>
                  <p>Find your way easily with detailed maps and pilgrimage route suggestions.</p>
                </a>
              </div>
            </div>
            <div className="col-md-4 text-center  ">
              <div className="border p-2">
                <a href="partnerApp.html" className="d-block">
                  <i className="fas fa-concierge-bell fa-3x text-primary mb-3"></i>
                  <h3>Purohit & Guide Services</h3>
                  <p>Connect with qualified purohits and knowledgeable tourist guides for a seamless experience.</p>
                </a>
              </div>
            </div>
            <div className="col-md-4 text-center  ">
              <div className="border p-2">
                <a href="#" className="d-block">
                  <i className="fas fa-book-open fa-3x text-primary mb-3"></i>
                  <h3>Detailed Information</h3>
                  <p>Access historical information, rituals, and cultural significance of each pilgrimage site.</p>
                </a>
              </div>
            </div>
          </div>
    
    
          <hr />
          <div id="partnerConsole" className="d-none">
            <div className="row col-md-12 text-center p-2">
              <div className="col-md-6">
                <p className="justify-content-center">
                  Manage All your Bookinks Here
                </p>
              <a href="https://play.google.com/apps/test/com.shd_gkg.dhama/12" className="btn btn-primary">console</a>
            </div>
              <div className="col-md-6  text-center" id="upcomingBookings">
                <div className="border m-2">
                <p>You don't have any upcoming bookings yet.</p>
              </div>
              </div>
            </div>
          </div>
    
          <div className="row">
            <div className="col-md-12 text-center mt-3">
              <h2>Become a Partner</h2>
              <p>Contribute to the Dhama community by registering as a:</p>
              <Link to="/partnerRegistration" className="btn btn-outline-primary me-3">Purohit</Link>
              <a href="partnerRegistration.html" className="btn btn-outline-primary">Tourist Guide</a>
            </div>
          </div>
        </main>
        <Calendar/>
      </main>
    
    
    )

}

export default Home;