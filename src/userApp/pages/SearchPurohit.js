import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, getDocs, collection, query, orderBy, startAt, endAt } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../../commonScripts/firebase';
import { Card, Row, Col, Button, Container } from 'react-bootstrap';
import { geohashQueryBounds, distanceBetween, geohashForLocation } from 'geofire-common';

const SearchPurohit = () => {

  const [user, setUser] = useState(null);
  const [matchingDocs, setMatchingDocs] = useState([]);
  const [center, setCenter] = useState([51.5074, 0.1278]); // Default to London coordinates
  const radiusInM = 50 * 1000; // 50 km radius
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [showPurohitData, setShowPurohitData] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
        },
        (err) => {
          console.error(err.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);
  
  const searchPurohitData = async () => {
    const bounds = geohashQueryBounds(center, radiusInM);
    const matchingDocs = [];
    const promises = [];
  
    for (const b of bounds) {
      const q = query(
        collection(db, 'purohits'),
        orderBy('geohash'),
        startAt(b[0]),
        endAt(b[1])
      );
      promises.push(getDocs(q));
    }
  
    const snapshots = await Promise.all(promises);
  
    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const lat = doc.get('lat');
        const lng = doc.get('lng');
        const distanceInKm = distanceBetween([lat, lng], center);
        const distanceInM = distanceInKm * 1000;
        if (distanceInM <= radiusInM) {
          const data = doc.data();
          const updatedData = {
            ...data,
            distanceInKm: distanceInKm,
          };
          matchingDocs.push(updatedData);
          console.log('Matching document:', doc.data());
        }
      }
    }
    console.log('Matching documents:', matchingDocs);
    if(matchingDocs.dpUrl == null)
      {matchingDocs.dpUrl = ""}
    setMatchingDocs(matchingDocs);
  };

 
  const renderPurohitDetails = (doc, index) => (
    <Card key={index} className="mb-4 shadow-sm">
      <Card.Body>
        <Row>
          <Col xs={12} sm={2} className="text-center mb-3 mb-sm-0">
            <img 
              src={doc.dpUrl} 
              alt="DP" 
              className="img-fluid rounded-circle" 
              style={{ width: '100px', maxWidth: '100%' }} 
            />
          </Col>
          <Col xs={12} sm={10}>
            <Card.Header as="h5">Purohit {doc.spiritualName}</Card.Header>
            <Row className="mb-3 mt-3">
              <Col xs={12} sm={6}>
                <Card.Text><strong>Spiritual Name:</strong> {doc.spiritualName}</Card.Text>
              </Col>
              <Col xs={12} sm={6}>
                <Card.Text><strong>Contact:</strong> {doc.contactNumber}</Card.Text>
              </Col>
            </Row>
            <Row className="mb-3 mt-3">
              <Col xs={12} sm={6}>
                <Card.Text><strong>Experience:</strong> {doc.experienceYears}</Card.Text>
              </Col>
              <Col xs={12} sm={6}>
                <Card.Text><strong>City:</strong>{doc.city}<strong  className="ms-2">Country:</strong>{doc.country}</Card.Text>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={12} sm={6}>
                <Card.Text><strong>Sampradaya:</strong> {doc.sampradaya}</Card.Text>
              </Col>
              <Col xs={12} sm={6}>
                <Card.Text><strong>Spiritual Master:</strong> {doc.spiritualMaster}</Card.Text>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={12} sm={6}>
                <Card.Text><strong>Rating:</strong> {doc.rating}</Card.Text>
              </Col>
              <Col xs={12} sm={6}>
                <Card.Text><strong>Distance:</strong> {doc.distanceInKm}</Card.Text>
              </Col>
            </Row>
            <div className="text-center mt-3">
              <Button variant="primary">Book Now</Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
  
  
  const handleSearchPurohit = async () => {
    setShowPurohitData(!showPurohitData);
    if (!showPurohitData) {
      await searchPurohitData();
    }
  };

  return (
    <>
    <main className="container-fluid mt-5">
  
      <div>Search Purohit Nearby Within 50km Radius</div>
      <Button className="btn btn-primary mt-3" onClick={handleSearchPurohit}>Search Purohit</Button>
    
      {showPurohitData && (
        <div>
          <h3>Purohit Data</h3>
          {matchingDocs.map((doc, index) => renderPurohitDetails(doc, index))}
        </div>
      )}
  </main>
    </>
 
  
  );
};

export default SearchPurohit;
