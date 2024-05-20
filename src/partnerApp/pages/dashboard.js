import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Import your Firebase config
import { firebaseConfig } from './firebase'; // Make sure to create this file

const Dashboard = ({ user }) => {
  const [partnerType, setPartnerType] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchPartnerDetails = async () => {
      if (!user) return;

      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.isPartner) {
          setPartnerType(userData.partnerType);
          setIsRegistered(true);
          fetchBookings(userData.partnerType);
        } else {
          setIsRegistered(false);
        }
      }
    };

    fetchPartnerDetails();
  }, [user]);

  const fetchBookings = async (partnerType) => {
    setIsLoading(true);
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const bookingsSnapshot = await db.collection(`${partnerType}Bookings`).where('userId', '==', user.uid).get();
    const bookingData = bookingsSnapshot.docs.map(doc => doc.data());
    setBookings(bookingData);
    setIsLoading(false);
  };

  const renderBookings = () => {
    return (
      <>
        <h2>{`${partnerType} Bookings`}</h2>
        <ul>
          {bookings.map((booking, index) => (
            <li key={index}>{/* Render booking details */}</li>
          ))}
        </ul>
      </>
    );
  };

  const renderPartnerRegistration = () => {
    return (
      <div>
        <p>Please register to access your bookings.</p>
        <div className="row">
          <div className="col-md-12 text-center mt-3">
            <h2>Become a Partner</h2>
            <p>Contribute to the Dhama community by registering as a:</p>
            <Link to="/partnerApp.html/travelGuideRegistration" className="btn btn-outline-primary me-3">Travel Guide</Link>
            <Link to="/partnerApp.html/prasadamProviderRegistration" className="btn btn-outline-primary me-3">Prasadam Provider</Link>
            <Link to="/partnerApp.html/purohitRegistration" className="btn btn-outline-primary me-3">Purohit</Link>
            <Link to="/partnerApp.html/partnerRegistration" className="btn btn-outline-primary me-3">Partner Registration</Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {isRegistered ? renderBookings() : renderPartnerRegistration()}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
