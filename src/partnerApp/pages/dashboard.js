import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase';
import { Link } from 'react-router-dom';
import  ProductCard from '../../commonScripts/productCard'
import purohitImage from '../../resources/purohit.jpg'
import travelGuideImage from '../../resources/travelguide.jpg'
import accomodationImage from '../../resources/accomodation.jpeg'
import prasadamImage from '../../resources/prasadam.jpeg'



const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [partnerData, setPartnerData] = useState({});
  const [profiles, setProfiles] = useState([]);
  const [bookings, setBookings] = useState([]);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpansion = () => setIsExpanded(!isExpanded);


  const [expandedProfiles, setExpandedProfiles] = useState(
    profiles.map(() => false) // Create an array with false for each profile (collapsed initially)
  );

  const toggleExpansion1 = (index) => {
    setExpandedProfiles((prevExpandedProfiles) => {
      const updatedExpandedProfiles = [...prevExpandedProfiles]; // Copy the previous state
      updatedExpandedProfiles[index] = !prevExpandedProfiles[index]; // Toggle expansion for clicked profile
      return updatedExpandedProfiles;
    });
  };


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const partnerRef = doc(db, "partners", user.uid);
        const partnerDoc = await getDoc(partnerRef);
        if (partnerDoc.exists()) {
          setPartnerData(partnerDoc.data());
          console.log(partnerDoc.data());
        }
      } catch (error) {
        console.error('Error fetching partner data:', error);
      }
    };

    const fetchProfiles = async () => {
      try {
        const q = query(collection(db, 'partners', user.uid, 'partnerProfiles'));
        const profilesSnapshot = await getDocs(q);
        const profilesData = profilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProfiles(profilesData);
        console.log(profilesData);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    if (user) {
      fetchPartnerData();
      fetchProfiles();
    }
  }, [user, db]);

  return (
    <div className="container">
      <h1 className="mt-5 text-center">Partner Dashboard</h1>
      {!partnerData.name && ( // Condition to check if partner is not registered
        <div>
          <h2>Partner Registration</h2>
          <Link to="./partnerRegistration" className="btn btn-primary mr-2 me-4">Register</Link>
        </div>
        
      )}
      {partnerData.name && (
     
      <>
      <h2>Partner Profile</h2>
      <button className="btn btn-primary mb-3" onClick={toggleExpansion}>
        {isExpanded ? 'Collapse Profile' : 'Expand Profile'}
      </button>
      {isExpanded && (
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Profile Information</h5>
                <p className="card-text">Name: {partnerData.name}</p>
                <p className="card-text">Date of Birth: {partnerData.dob}</p>
                <p className="card-text">Email: {partnerData.email}</p>
                <p className="card-text">Phone: {partnerData.phone}</p>
                <p className="card-text">Address: {partnerData.address}</p>
                <img src={partnerData.profilePicUrl} alt="Profile Pic" className="img-fluid" />
              </div>
            </div>
          </div>
          
        </div>
      )}
      <h2>Partner Profiles</h2>

      <div className="container">
      <div className="row">
      
       <a href='purohitApp.html' className="col-lg-3 col-md-6 col-sm-4 mb-4">
      <div className="card h-100" >
        <img className="card-img-top p-2" src={purohitImage} alt={purohitImage} />
        <div className="card-body">
          <h5 className="card-title text-center">Purohit</h5>
          <p className="card-text text-center">Make Your Purohit Profile</p>
          <p className="card-text  text-center">Purohit Console</p>
        </div>
      </div>
      </a>
    
    
    <a href='travelGuideApp.html' className="col-lg-3 col-md-6 col-sm-6 mb-4">
      <div className="card h-100">
        <img className="card-img-top p-2" src={travelGuideImage} alt={travelGuideImage} />
        <div className="card-body">
          <h5 className="card-title text-center">Tour Guide</h5>
          <p className="card-text text-center">Make Your Tour Guide Profile</p>
          <p className="card-text  text-center">Tour Guide Console</p>
        </div>
      </div>
    </a>
    <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
      <div className="card h-100">
        <img className="card-img-top p-2" src={prasadamImage} alt={prasadamImage} />
        <div className="card-body">
          <h5 className="card-title text-center">Prasadam Partner</h5>
          <p className="card-text text-center">Make Your Prasadam Profile</p>
          <p className="card-text  text-center">Prasadam Partner Console</p>
        </div>
      </div>
    </div>
    <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
      <div className="card h-100">
        <img className="card-img-top p-2" src={accomodationImage} alt={accomodationImage} />
        <div className="card-body">
          <h5 className="card-title text-center">Accomadation Partner</h5>
          <p className="card-text text-center">Make Your Accomadation Provider Profile</p>
          <p className="card-text  text-center">Accomadation Provider Console</p>
        </div>
      </div>
    </div>



</div>
</div>













    <ProductCard  product = {partnerData} />
      <h2>Create or Access Profiles</h2>
      <a href ="purohitApp.html" className="btn btn-primary ms-5 mb-3" >Purohit Console</a>
      <a href="travelGuideApp.html" className="btn btn-primary ms-5 mb-3">Travel Guide</a>

      <h2 className="mt-5">Bookings</h2>
      <div>
        {bookings.length === 0 ? (
          <p>No current bookings</p>
        ) : (
          bookings.map(booking => (
            <div key={booking.id}>
              {/* Display booking data using booking */}
            </div>
          ))
        )}
      </div>
      </>
      )}
    </div>
  );
};

export default Dashboard;
