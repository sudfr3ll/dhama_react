import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, getDocs, collection, query } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../../commonScripts/firebase';
import { Link } from 'react-router-dom';
import {  Card, Row, Col, Button, Container  } from 'react-bootstrap';
import { set } from 'firebase/database';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [partnerData, setPartnerData] = useState({});
  const [profile, setProfile] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedSection, setSelectedSection] = useState('personal');
  var fetchPartnerData = [];
  var fetchProfiles = [];
  var fetchPackages = [];

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
    fetchPartnerData = async () => {
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

    fetchProfiles = async () =>{
      try{
        const q = doc(db, 'partners', user.uid, 'partnerProfiles', 'travelGuide');
       const profileData = await getDoc(q);
       setProfile(profileData.data());
       console.log(profileData.data()); 
      }
      catch(error){
        console.error('Error fetching profiles:', error);
      }
    }

    fetchPackages = async () => {
      try {
        const q = query(collection(db, 'partners', user.uid,'partnerProfiles', 'travelGuide', 'tourPackages'));
        const profilesSnapshot = await getDocs(q);
        const packagesData = profilesSnapshot.docs.map(doc => ({ packageName: doc.packageName, ...doc.data() }));
        setPackages(packagesData);
        console.log(packagesData);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    if (user) {
      fetchPartnerData();
      fetchPackages();
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

  const renderTravelGuideDetails = () => (
    <div >
      <Card className="mb-4 shadow-sm">
        <Card.Body>
        <Card.Header as="h5">Travel Guide Details</Card.Header>
          <Card.Text><strong>Travel Agency Address:</strong> {profile.addressStreet}, {profile.city}, {profile.country}</Card.Text>
          <Row className="mb-3 mt-3">
            <Col>
              <Card.Text><strong>Currently Active In :</strong> {profile.dhama}</Card.Text>
            </Col>
            <Col>
              <Card.Text><strong>ISKCON Affiliated :</strong> {profile.iskconMember}</Card.Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card.Text><strong>Name Of Owner :</strong> {profile.name}</Card.Text>
            </Col>
            <Col>
              <Card.Text><strong>Spiritual Name :</strong> {profile.spiritual}</Card.Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card.Text><strong>Phone :</strong> {profile.contactNumber}</Card.Text>
            </Col>
          </Row>
          <Row className="mb-3 text-center">
              <img src={profile.dpUrl} alt="Profile Pic" className="img-fluid rounded-circle" style={{ width: '100px' }} />    
          </Row>
        </Card.Body>
      </Card>
    </div>
  );

  return (
    <>
      <div className="container">
        <h1 className="mt-5 text-center">Travel Guide Dashboard</h1>
        {!partnerData.name && (
          <div>
            <h2>TravelGuideRegistration</h2>
            <Link to="./travelGuideRegistration" className="btn btn-primary mr-2 me-4">Register</Link>
          </div>
        )}
      {!fetchPartnerData.isNotEmpty && (
       <>
        <div>
          <div className="mb-3 mt-6 ">
            <Button className="btn btn-primary me-2" onClick={() => setSelectedSection('personal')}>Personal Details</Button>
            <Button className="btn btn-primary" onClick={() => setSelectedSection('travelGuide')}>Travel Guide Details</Button>
          </div>
          {selectedSection === 'personal' && renderPersonalDetails()}
          {selectedSection === 'travelGuide' && renderTravelGuideDetails()}
        </div>

        <h2>Create Profiles</h2>
        <div>
          <Link to="./uploadPackage" className="btn btn-primary mr-2 me-4">Add Travel Package +</Link>
        </div>


        {!fetchPackages.isNotEmpty && (
          <div className='container mt-5 mb-5 items-center'>
              {packages.map(profile =>
                <div className='card ms-5 me-5 mb-5'>
                  <p>Package name: {profile.name}</p>
                  <p>Package description: {profile.description}</p>
                  <p>Package price: {profile.price}</p>
                  <p>Number Of People: {profile.numPeople}</p>
                  <p>Vehicle: {profile.transport}</p>
                  <p>Package Images</p>
                  {
                  profile.travelPackageImages.map(image => (
                    <img src={image} style={{ width: '100px', shape: 'circle', margin: '10px'}} alt="Package Image" />
                  ))
                  }
                  </div>
              )}
          </div>
        )}
        </>
      )}
      </div>
    </>
  );
};

export default Dashboard;
