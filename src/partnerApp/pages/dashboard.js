import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase';
import { Link } from 'react-router-dom';

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



      <h2>Profiles</h2>

      {
      profiles.map((profile, index) => (
        <div className="col-md-4 mb-3" key={profile.id}>


          <button className="btn btn-primary mb-3" onClick={() => toggleExpansion1(index)}>
            {expandedProfiles[index] ? 'Collapse Profile' : 'Expand Profile'}
          </button>
         {expandedProfiles[index] && ( // Conditionally render profile content
            <>
              <div className="card">
                <h5 className="card-title">Purohit Profile {profile.id}</h5>
                <div className="container">
                  {/* Display profile data */}
                  <p className="card-text">Leader: {profile.leader}</p>
                  <p className="card-text">Leader Contact: {profile.leaderContact}</p>
                  <p className="card-text">Sampradaya: {profile.sampradaya}</p>
                  <p className="card-text">Spiritual Master: {profile.spiritualMaster}</p>
                  <p className="card-text">Spiritual Name: {profile.spiritualName}</p>
                </div>
              </div>
            </>
          )}

      


        </div>
      ))}

<a href ="purohitApp.html" className="btn btn-primary ms-5 mb-3" >Purohit Console</a>

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
