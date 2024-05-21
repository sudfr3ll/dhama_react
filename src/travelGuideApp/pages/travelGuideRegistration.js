import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { geofire,geohashForLocation} from 'geofire-common';
import { firebaseConfig } from "../../commonScripts/firebase"; 
import {Row} from 'react-bootstrap'

const PurohitRegistration = () => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
 
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [sampradaya, setSampradaya] = useState("");
  const [spiritualMaster, setSpiritualMaster] = useState("");
  const [leader, setLeader] = useState("");
  const [leaderContact, setLeaderContact] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [filePurohitPics, setFilePurohitPics] = useState([]);
  const [contactNumber, setContactNumber] = useState("");
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [hash,setHash] = useState(null);
  const [dpUrl, setDpUrl] = useState(null);
  const [addressStreet, setAddressStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry ] = useState("");
  

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

      try
      {

      const partnerDpRef = doc(db, "partners", user.uid)
      const partnerDpDoc = await getDoc(partnerDpRef);
      if (partnerDpDoc.exists())
        {setDpUrl(partnerDpDoc.data().profilePicUrl || null);}
        else  {console.log("profile pic url not found!");}
       }catch (error) {
        console.error("Error fetching profile pic URL from Firestores:", error);
      }
      
      try {
      
        const partnerRef = doc(db, "partners", user.uid, "partnerProfiles", "purohitInfo");
        const partnerDoc = await getDoc(partnerRef);
       

        if (partnerDoc.exists()) {
          const data = partnerDoc.data();
          setName(data.spiritualName || "");
          setSampradaya(data.sampradaya || "");
          setSpiritualMaster(data.spiritualMaster || "");
          setLeader(data.leader || "");
          setLeaderContact(data.leaderContact || "");
          setExperienceYears(data.experienceYears || "");
          setContactNumber(data.contactNumber || "");
          setAddressStreet(data.addressStreet || "");
          setCity(data.city || "");
          setState(data.state || "");
          setPincode(data.pincode || "");
          setCountry(data.country || "");
          console.log("profile pic url:",partnerDpDoc.data().profilePicUrl)
        } else {
          console.log("No such document!");
        } 
      } catch (error) {
        console.error("Error fetching partner data:", error);
      }
    };

    fetchPartnerData();
  }, [user, db]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    handleLoadAvatar(file);
  };

  const handleLoadAvatar = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
      
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const MAX_WIDTH = 300; // Maximum width for resized image
        const MAX_HEIGHT = 300; // Maximum height for resized image

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Calculate new dimensions to maintain aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw the resized image on the canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get the resized image as a data URL
        const dataURL = canvas.toDataURL("image/png");

        // Convert dataURL to file and add to the state
        const newFile = dataURLtoFile(dataURL, file.name);
        setFilePurohitPics(prevFiles => [...prevFiles, newFile]);
      };
    };
  };

  const dataURLtoFile = (dataURL, filename) => {
    const [header, base64Data] = dataURL.split(",");
    const mimeString = header.split(":")[1].split(";")[0];
    const byteString = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    return new File([intArray], filename, { type: mimeString });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (filePurohitPics.length < 3) {
      console.error("Please upload at least 3 pictures.");
      return;
    }

    // Upload purohit pictures
    const uploadTasks = filePurohitPics.map((file, index) => {
      const profilePicRef = ref(storage, `images/purohit/${user.uid}/purohit${index + 1}`);
      return uploadBytesResumable(profilePicRef, file, { contentType: file.type });
    });

    const uploadUrls = await Promise.all(uploadTasks.map(task => {
      return new Promise((resolve, reject) => {
        task.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Upload error:", error);
            reject(error);
          },
          () => {
            getDownloadURL(task.snapshot.ref).then(resolve).catch(reject);
          }
        );
      });
    }));



    const purohitInfo = {
      contactNumber: contactNumber,
      dpUrl: dpUrl,
      userId: user.uid,
      spiritualName: name,
      sampradaya: sampradaya,
      spiritualMaster: spiritualMaster,
      leader: leader,
      contactNumber: contactNumber,
      leaderContact: leaderContact,
      experienceYears: experienceYears,
      geohash: hash,
      lat: location.latitude,
      lng: location.longitude,
      purohitPicUrls: uploadUrls,
      verified: false,
      addressStreet: addressStreet,
      city: city,
      state: state,
      pincode: pincode,
      country: country,
      createdAt: new Date().getTime()
    };

    const userId = user.uid;
    const partnerRef = doc(db, "partners", userId, "partnerProfiles", "purohitInfo");
    const purohitRef = doc(db, "purohits", userId);

    await setDoc(partnerRef, purohitInfo, { merge: true });
    await setDoc(purohitRef, { ...purohitInfo, verified: true },{merge: true});


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

  };

  return (
    <>
      <div className="container">
        <h2 className="mt-4 mb-4">Register as Purohit</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="name">Spiritual Name:</label>
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
              <label htmlFor="sampradaya">Sampradaya:</label>
              <input
                type="text"
                id="sampradaya"
                name="sampradaya"
                value={sampradaya}
                onChange={(e) => setSampradaya(e.target.value)}
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-6">
              <label htmlFor="spiritualMaster">Spiritual Master:</label>
              <input
                type="text"
                id="spiritualMaster"
                name="spiritualMaster"
                value={spiritualMaster}
                onChange={(e) => setSpiritualMaster(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="leader">Leader:</label>
              <input
                type="text"
                id="leader"
                name="leader"
                value={leader}
                onChange={(e) => setLeader(e.target.value)}
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-6">
              <label htmlFor="leaderContact">Leader Phone:</label>
              <input
                type="text"
                id="leaderContact"
                name="leaderContact"
                value={leaderContact}
                onChange={(e) => setLeaderContact(e.target.value)}
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
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <label htmlFor="leaderContact">Your GPS Location:</label>
              <button className="btn btn-outline-primary ms-2" onClick={getLocation}>Get Location</button>
              <div className="mt-2">
                <span>Latitude: {location.latitude}</span>
                <span className='ms-2'>Longitude: {location.longitude}</span>
                <span className='ms-2'>Hash: {hash}</span>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <p>Please provide 2 pictures of yourself performing Samsakara in JPEG format:</p>
              <label htmlFor="profilePic1">Picture 1:</label>
              <input
                className="form-control mb-2"
                type="file"
                id="profilePic1"
                name="profilePic1"
                accept="image/*"
                onChange={handleProfilePicChange}
                required
              />
              <label htmlFor="profilePic2">Picture 2:</label>
              <input
                className="form-control mb-2"
                type="file"
                id="profilePic2"
                name="profilePic2"
                accept="image/*"
                onChange={handleProfilePicChange}
                required
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <p>Please provide a picture of your certificate from your spiritual Master/Guru recommending that you are qualified to become a Purohit in JPEG format:</p>
              <label htmlFor="certificatePic">Certificate Picture:</label>
              <input
                className="form-control"
                type="file"
                id="certificatePic"
                name="certificatePic"
                accept="image/*"
                onChange={handleProfilePicChange}
                required
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <button className="btn btn-primary" type="submit">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
  
};

export default PurohitRegistration;
