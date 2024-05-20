import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, getDocs, collection, query, orderBy, startAt, endAt } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../../commonScripts/firebase';
import { Card, Row, Col, Button, Container } from 'react-bootstrap';
import { geohashQueryBounds, distanceBetween, geohashForLocation } from 'geofire-common';


const DhamaServices = () => {   

    return(
<>
        <div className='container-fluid'>
        <h1 className='text-center mt-5'>Dhama Services</h1> 
        </div>
        <div className='mt-5 ms-2 text-center'>
        <div className='row mb-2'>
          <div className='col-4'>
            Book Your Purohit
          </div>
          <div className='ms-auto col-8'>
            <Link to="/searchPurohit" className='btn btn-outline-primary col-4'>Purohit</Link>
          </div>
        </div>
        <div className='row mb-2'>
          <div className='col-4'>
            Book Your Trip
          </div>
          <div className='ms-auto col-8'>
            <Link to="/searchTravelGuide" className='btn btn-outline-primary col-4'>Trip</Link>
          </div>
        </div>
        <div className='row mb-2'>
          <div className='col-4'>
            Search Prasadam Nearby
          </div>
          <div className='col-8'>
            <Link to="/searchPrasadam" className='btn btn-outline-primary col-4'>Prasadam</Link>
          </div>
        </div>
      </div>
      </>
    );
}

export default DhamaServices;