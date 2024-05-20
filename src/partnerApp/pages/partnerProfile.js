import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// Import your Firebase config
import { firebaseConfig } from './firebase'; // Make sure to create this file


const PartnerProfile =  () => {
  var [name, setName] = useState('');
  var [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [photoId, setPhotoId] = useState(null);

  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [data, setData] = useState();

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const partnerRef = doc(db, 'partners', user.uid);
  
  useEffect(() => {
    // Check for existing user data on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDoc(partnerRef);
        setData(result);

        const partnerData = result.exists ? result.data() : {};

        console.log("partnerData",partnerData.name);


        setName(partnerData.name);
        setDob(partnerData.dob);
        setEmail(partnerData.email);
        setPhone(partnerData.phone);
        setPhotoId(partnerData.idPicUrl);
        setProfilePic(partnerData.profilePicUrl);
        setAddress(partnerData.address);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (

    <>
        <h1  className = "d-flex justify-content-center">Profile Details</h1>
        {data ? (
          <>
<div className='d-flex'>
<table className="table d-flex justify-content-center">
<tbody>
  <thead className='ms-2'>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Field</th>
      <th scope="col">Details</th>
    </tr>
  </thead>
     <tr>
      <th scope="row">1</th>
      <td>NAME</td>
      <td>{name}</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Date Of Birth</td>
      <td>{dob}</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Email</td>
      <td>{email}</td>
    </tr>
    <tr>
      <th scope="row">4</th>
      <td>Address</td>
      <td>{address}</td>
    </tr> 
    <tr>
      <th scope="row">5</th>
      <td>Phone</td>
      <td>{phone}</td>
    </tr> 
    <tr>
      <th scope="row">6</th>
      <td>Email</td>
      <td>{email}</td>
    </tr>
    <tr>
      <th scope="row">7</th>
      <td>Profile Picture</td>
      <td><img src={profilePic}/></td>
    </tr>
    <tr>
      <th scope="row">8</th>
      <td>Photo Id</td>
      <td> <img src={photoId}/> </td>
    </tr>
  </tbody>
</table>
</div>
        
    
          </>
      ) : (
        <div>Loading...</div>
      )}

   
    
    <div className = "d-flex justify-content-center">

    </div>
    </>
  );
};

export default PartnerProfile;



  
  
 
  