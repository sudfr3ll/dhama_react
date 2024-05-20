import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, getDocs, collection, query } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../../commonScripts/firebase';
import { Link } from 'react-router-dom';
import {  Card, Row, Col, Button, Container  } from 'react-bootstrap';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [partnerData, setPartnerData] = useState({});
  const [profile, setProfile] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedSection, setSelectedSection] = useState('personal');

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

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
        setProfile(profilesData);
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

  const renderPersonalDetails = () => (
    <Container>
    <Row>
      <Col md={6}>
        <Card className="mb-3">
          <Card.Body>
          <Row className="mb-3 mt-3">
            <Col>
            <Card.Header as="h5">Personal Details</Card.Header>
            </Col>
          </Row>
            <Row className="mb-3">
            <Card.Text>Name: {partnerData.name}</Card.Text>
            </Row>
            <Row className="mb-3">
              <Col>
            <Card.Text>Date of Birth: {partnerData.dob}</Card.Text>
            </Col>
            <Col>
            <Card.Text>Email: {partnerData.email}</Card.Text>
            </Col>
            </Row>
            
            <Row className="mb-3">
            <Col>
            <Card.Text>Phone: {partnerData.phone}</Card.Text>
            </Col>
            <Col>
            <Card.Text>Address: {partnerData.address}</Card.Text>
            </Col>
            </Row>
            <img src={partnerData.profilePicUrl} 
            alt="Profile Pic" className="img-fluid img-fluid rounded-circle"
             style={{ width: '100px'}} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
  );

  const renderPurohitDetails = () => (
    <div key={profile[0]?.id}>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
        <Card.Header as="h5">Purohit Profile {profile[0]?.id}</Card.Header>
          <Row className="mb-3 mt-3">
            <Col>
              <Card.Text><strong>Leader:</strong> {profile[0]?.leader}</Card.Text>
            </Col>
            <Col>
              <Card.Text><strong>Leader Contact:</strong> {profile[0]?.leaderContact}</Card.Text>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Card.Text><strong>Sampradaya:</strong> {profile[0]?.sampradaya}</Card.Text>
            </Col>
            <Col>
              <Card.Text><strong>Spiritual Master:</strong> {profile[0]?.spiritualMaster}</Card.Text>
            </Col>
          </Row>
          <Card.Text className="mb-3"><strong>Spiritual Name:</strong> {profile[0]?.spiritualName}</Card.Text>
          <Row className="mb-3 text-center">
            
              <img src={profile[0]?.purohitPicUrls[0]} alt="Profile Pic" className="img-fluid rounded-circle" style={{ width: '100px' }} />
              <img src={profile[0]?.purohitPicUrls[1]} alt="Profile Pic" className="img-fluid rounded-circle" style={{ width: '100px' }} />
              <img src={profile[0]?.purohitPicUrls[2]} alt="Profile Pic" className="img-fluid rounded-circle" style={{ width: '100px' }} />
            
          </Row>
          <div className="text-center">
            <Link to="./purohitRegistration">
              <Button variant="primary" className="mr-4 me-4">Edit</Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  return (
    <>
      <div className="container">
        <h1 className="mt-5 text-center">Purohit Dashboard</h1>
        {!partnerData.name && (
          <div>
            <h2>Partner Registration</h2>
            <Link to="./partnerRegistration" className="btn btn-primary mr-2 me-4">Register</Link>
          </div>
        )}

        <div>
          <div className="mb-3 mt-6 ">
            <Button className="btn btn-primary me-2" onClick={() => setSelectedSection('personal')}>Personal Details</Button>
            <Button className="btn btn-primary" onClick={() => setSelectedSection('purohit')}>Purohit Details</Button>
          </div>
          {selectedSection === 'personal' && renderPersonalDetails()}
          {selectedSection === 'purohit' && renderPurohitDetails()}
        </div>

        <h2>Create Profiles</h2>
        <div>
          <Link to="./purohitRegistration" className="btn btn-primary mr-2 me-4">Purohit Service</Link>
        </div>

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
      </div>
    </>
  );
};

export default Dashboard;
