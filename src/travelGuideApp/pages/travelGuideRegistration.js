import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { geohashForLocation } from 'geofire-common';
import { firebaseConfig } from "../../commonScripts/firebase";

const TravelGuideRegistration = () => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [sampradaya, setSampradaya] = useState("");
  const [spiritualMaster, setSpiritualMaster] = useState("");
  const [spiritualName, setSpiritualName] = useState("");
  const [leader, setLeader] = useState("");
  const [leaderContact, setLeaderContact] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [filePurohitPics, setFilePurohitPics] = useState([]);
  const [contactNumber, setContactNumber] = useState("");
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [hash, setHash] = useState(null);
  const [dpUrl, setDpUrl] = useState(null);
  const [addressStreet, setAddressStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");
  const [iskconMember, setIskconMember] = useState(true);
  const [dhama, setDhama] = useState("");

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setHash(geohashForLocation([position.coords.latitude, position.coords.longitude]));
          setError(null);
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchPartnerData = async () => {
      if (!user) return;

      try {
        const partnerDpRef = doc(db, "partners", user.uid);
        const partnerDpDoc = await getDoc(partnerDpRef);
        if (partnerDpDoc.exists()) {
          setDpUrl(partnerDpDoc.data().profilePicUrl || null);
        } else {
          console.log("Profile pic URL not found!");
        }
      } catch (error) {
        console.error("Error fetching profile pic URL from Firestore:", error);
      }

      try {
        const partnerRef = doc(db, "partners", user.uid, "partnerProfiles", "travelGuide");
        const partnerDoc = await getDoc(partnerRef);

        if (partnerDoc.exists()) {
          const data = partnerDoc.data();
          setName(data.name || "");
          setSampradaya(data.sampradaya || "");
          setSpiritualName(data.spiritualName || "");
          setExperienceYears(data.experienceYears || "");
          setContactNumber(data.contactNumber || "");
          setAddressStreet(data.addressStreet || "");
          setCity(data.city || "");
          setState(data.state || "");
          setPincode(data.pincode || "");
          setCountry(data.country || "");
          setIskconMember(data.iskconMember || true);
          setDhama(data.dhama || "");
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log("Error fetching partner data:", error);
      }
    };

    fetchPartnerData();
  }, [user, db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const travelGuideInfo = {
      contactNumber,
      dpUrl,
      userId: user.uid,
      name,
      spiritualName,
      experienceYears,
      geohash: hash,
      lat: location.latitude,
      lng: location.longitude,
      verified: false,
      addressStreet,
      city,
      state,
      pincode,
      country,
      dhama,
      iskconMember,
      createdAt: new Date().getTime()
    };

    const userId = user.uid;
    const partnerRef = doc(db, "partners", userId, "partnerProfiles", "travelGuide");
    const travelGuideRef = doc(db, "travelGuides", userId);

    await setDoc(partnerRef, travelGuideInfo, { merge: true });
    await setDoc(travelGuideRef, { ...travelGuideInfo, verified: true }, { merge: true });

    // Clear form fields
    setName("");
    setSampradaya("");
    setSpiritualMaster("");
    setLeader("");
    setLeaderContact("");
    setExperienceYears("");
    setDpUrl("");
    setFilePurohitPics([]);
    setContactNumber("");
    setLocation({ latitude: null, longitude: null });
    setHash(null);
    setAddressStreet("");
    setCity("");
    setState("");
    setPincode("");
    setCountry("");
    setIskconMember(true);
    setDhama("");
  };

  return (
    <div className="container">
      <h2 className="mt-4 mb-4">Register as a travelGuide</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="dhama">Select Dhama for you want to become Travel Guide:</label>
            <select className="form-select" aria-label="Default select example" onChange={(e) => {
              const selectedOptionText = e.target.options[e.target.selectedIndex].text;
              setDhama(selectedOptionText);
            }}>
              <option value="">Open this select menu</option>
              <option value="1">Vrindavan and Braja Mandal</option>
              <option value="2">Mayapur and Gaur Mandal</option>
              <option value="3">Haridwar, Rishikesh</option>
            </select>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <label htmlFor="spiritualName">Spiritual Name:</label>
            <input
              type="text"
              id="spiritualName"
              name="spiritualName"
              value={spiritualName}
              onChange={(e) => setSpiritualName(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <div className="form-check form-switch">
              <label className="form-check-label" htmlFor="flexSwitchCheckChecked"> Are You Member Of ISKCON: </label>
              <input
                className="form-check-input ms-3"
                type="checkbox"
                id="flexSwitchCheckChecked"
                onChange={(e) => setIskconMember(e.target.checked)}
                checked={iskconMember}
              />
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <label htmlFor="contactNumber">Your Contact Number On Display:</label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="experienceYears">Experience (in years):</label>
            <input
              type="text"
              id="experienceYears"
              name="experienceYears"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              className="form-control"
              required
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <label htmlFor="address">Address</label>
            <div className="form-group">
              <label htmlFor="addressStreet">Street and House No.:</label>
              <input
                type="text"
                id="addressStreet"
                name="addressStreet"
                value={addressStreet}
                onChange={(e) => setAddressStreet(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="city">City:</label>
              <input
                type="text"
                id="city"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">State:</label>
              <input
                type="text"
                id="state"
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="pincode">Pincode:</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country:</label>
              <input
                type="text"
                id="country"
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <label htmlFor="GSPLocation">Your GPS Location:</label>
            <button className="btn btn-outline-primary ms-2" type='button' onClick={getLocation}>Get Location</button>
            <div className="mt-2">
              <span>Latitude: {location.latitude}</span>
              <span className='ms-2'>Longitude: {location.longitude}</span>
              <span className='ms-2'>Hash: {hash}</span>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <button className="btn btn-primary" type="submit">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TravelGuideRegistration;
