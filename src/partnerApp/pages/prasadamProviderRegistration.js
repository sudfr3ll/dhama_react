import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// Import your Firebase config
import { firebaseConfig } from './firebase'; // Make sure to create this file

var filePassport = "";
var filePassportId ="";

const PrasadamProviderRegistration = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [photoId, setPhotoId] = useState(null);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth();
  const storage = getStorage(app);
  const metadata = {
    contentType: 'image/jpeg'
  };

  const handleProfilePicChange = (e) => {
    var file = e.target.files[0];
    file = handleLoadAvatar(file);
    setProfilePic(file);
  };

  const handlePhotoIdChange = (e) => {
    var file = e.target.files[0];
    file = handleLoadPhotoId(file);
    setPhotoId(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload profile pic
    const profilePicRef = ref(storage, `images/profilePic_${name}_${auth.currentUser.email}`);
    const profilePicUploadTask = uploadBytesResumable(profilePicRef, filePassport,metadata);

    profilePicUploadTask.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;

        // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(profilePicUploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        const userId = auth.currentUser.uid;
        try {
          const profileInfo = {
            profilePicUrl: downloadURL,
          };
          const partnerRef = doc(db, "partners", userId);
          setDoc(partnerRef, profileInfo, { merge: true });
          console.log('Profile information profile pic url successfully added!');
        } catch (error) {
          console.error('Error adding profile information:', error);
        }

      });
    }
  );
    const profilePicDownloadURL = await getDownloadURL(profilePicUploadTask.snapshot.ref);

    // Upload photo ID
    const photoIdRef = ref(storage, `images/profileId_${name}_${auth.currentUser.email}`);
    const photoIdUploadTask = uploadBytesResumable(photoIdRef, filePassportId,metadata);

    photoIdUploadTask.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;

        // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(photoIdUploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);

        const userId = auth.currentUser.uid;
        try {
          const profileInfo = {
            idPicUrl: downloadURL,
          };
          const partnerRef = doc(db, "partners", userId);
          setDoc(partnerRef, profileInfo, { merge: true });
          console.log('Profile information firebaseid pic url successfully added!');
        } catch (error) {
          console.error('Error adding profile information:', error);
        }

      });
    }
  );


    const photoIdDownloadURL = await getDownloadURL(photoIdUploadTask.snapshot.ref);

    // Add data to Firestore
    const userId = auth.currentUser.uid;
    const partnerRef = doc(db, 'partners', userId);
    try {
      await setDoc(partnerRef, {
          name,
          dob,
          email,
          phone,
          address,
      }, { merge: true });
      console.log('Fields uploaded successfully!'); // Success confirmation
  } catch (error) {
      console.error('Error uploading fields:', error); // Error handling
  }

    // Clear form fields
    setName('');
    setDob('');
    setEmail('');
    setPhone('');
    setAddress('');
    setProfilePic(null);
    setPhotoId(null);
  };

  return (

    <>
        <h1  className = "d-flex justify-content-center">Register As a Partner</h1>
        <h3  className = "d-flex justify-content-center">Fill Up your Profile</h3>
    
    <div className = "d-flex justify-content-center">
        <form onSubmit={handleSubmit}>
        <div className='row justify-content-evenly'>
        <label className="col-2" htmlFor="name">Name:</label>
        <input className="col-8" type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required /><br /><br/>
        </div>
        <br/>
        <div className='row justify-content-evenly'>
        <label className="col-2" htmlFor="dob">Date of Birth:</label>
        <input className="col-8" type="date" id="dob" name="dob" value={dob} onChange={(e) => setDob(e.target.value)} required /><br /><br />
        </div>
        <br/>

        <div className='row justify-content-evenly'>
        <label className="col-2" htmlFor="email">Email:</label>
        <input className="col-8" type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br /><br />
        </div>
<br/>
        <div className='row justify-content-evenly'>
        <label className="col-2" htmlFor="phone">Phone:</label>
        <input className="col-8" type="tel" id="phone" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required /><br /><br />
        </div>
        <br/>   
        <div className='row justify-content-evenly'>
        <label className="col-2" htmlFor="address">Address:</label>
        <textarea className="col-8 ms-3" id="address" name="address" rows="4" value={address} onChange={(e) => setAddress(e.target.value)} required></textarea><br /><br />
        </div>
        <br/>
        <div className='row justify-content-evenly'>
        <label className="col-2" htmlFor="profilePic">Upload Profile Pic:</label>
        <input className="col-8 btn btn-primary ms-3" type="file" id="profilePic" name="profilePic" accept="image/*" onChange={handleProfilePicChange} required /><br /><br />
        </div>
        <br/>
        <div className='row justify-content-evenly'>
        <label className="col-2" htmlFor="photoId">Upload Photo ID:</label>
        <input className="col-8 btn btn-primary ms-3" type="file" id="photoId" name="photoId" accept="image/*" onChange={handlePhotoIdChange} required /><br /><br />
        </div>
        <br/>
        <div className= "d-flex justify-content-center"><button className="btn btn-primary"  type="submit">Submit</button></div>
      </form>
    </div>
    </>
  );
};

export default PrasadamProviderRegistration;



function handleLoadAvatar(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
  
    reader.addEventListener('load', (event) => {
      const img = new Image();
      img.src = event.target.result;
  
      // Resize logic after image loads
      img.onload = function () {
        const MAX_WIDTH = 300; // Maximum width for resized image
        const MAX_HEIGHT = 300; // Maximum height for resized image
  
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
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
  
        ctx.drawImage(img, 0, 0, width, height);
  
        var dataURL = canvas.toDataURL('image/png'); // Get resized image as data URL
        const profilePic = document.getElementById('profilePic');
        profilePic.setAttribute('src', dataURL);
        filePassport = dataURLtoFile(dataURL, 'profilePic.png');
        console.log('profilePic dataurl', dataURL);
        console.log('profilePic file', filePassport);
      };
    });
    return filePassport;
  }
  
  function handleLoadPhotoId(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    var dataURL = "";
   
    reader.addEventListener('load', (event) => {
      const img = new Image();
      img.src = event.target.result;
  
      // Resize logic after image loads
      img.onload = function () {
        const MAX_WIDTH = 300; // Maximum width for resized image
        const MAX_HEIGHT = 300; // Maximum height for resized image
  
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
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
  
        ctx.drawImage(img, 0, 0, width, height);
  
        var dataURL = canvas.toDataURL('image/png'); // Get resized image as data URL
  
        filePassportId = dataURLtoFile(dataURL, 'profileId.png');
        console.log('photoid file', filePassportId);
      };
    });
    return dataURL;
  }
  
  function dataURLtoFile(dataURL, filename) {
    // Split the data URL to get the base64 data
    const [, base64Data] = dataURL.split(',');
  
    // Decode the base64 data
    const decodedData = atob(base64Data);
  
    // Convert the decoded data into a binary array
    const binaryData = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      binaryData[i] = decodedData.charCodeAt(i);
    }
  
    // Create a Blob object from the binary data
    const blob = new Blob([binaryData], { type: 'image/png' }); // Adjust the type as per your image format
  
    // Optionally, create a File object from the Blob
    const file = new File([blob], filename, { type: 'image/png' }); // Adjust the type as per your image format
  
    return file;
  }

  
  
 
  