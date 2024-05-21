// src/components/UploadPackage.js
import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import {  getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import { firebaseConfig } from "../../commonScripts/firebase";
import 'react-datepicker/dist/react-datepicker.css';

const UploadPackage = () => {

  const [filePurohitPics, setFilePurohitPics] = useState([]);
  const [packageName, setPackageName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [availability, setAvailability] = useState([
    { startDate: new Date(), endDate: new Date() },
    { startDate: new Date(), endDate: new Date() },
    { startDate: new Date(), endDate: new Date() },
  ]);
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const db = getFirestore(app);



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
  



  const handleDateChange = (index, key, date) => {
    const newAvailability = [...availability];
    newAvailability[index][key] = date;
    setAvailability(newAvailability);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please upload a file first!');
      return;
    }

    // Upload file to Firebase Storage
    
 
        // Upload purohit pictures
        const uploadTasks = filePurohitPics.map((file, index) => {
          const storageRef = ref(storage, `images/travelGuide/${user.uid}/${packageName}/${index+1}`);
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
    
    // Add package to Firestore
    await addDoc(collection(db, 'packages'), {
      packageName: packageName,
      description: description,
      price: price,
      travelPackageImages: uploadUrls,
      availability: availability.map(({ startDate, endDate }) => ({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })),
    });

    alert('Package uploaded successfully!');
    setPackageName('');
    setDescription('');
    setPrice('');
    setFile(null);
    setAvailability([
      { startDate: new Date(), endDate: new Date() },
      { startDate: new Date(), endDate: new Date() },
      { startDate: new Date(), endDate: new Date() },
    ]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Package Name:</label>
        <input
          type="text"
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      {availability.map((range, index) => (
        <div key={index}>
          <label>Start Date {index + 1}:</label>
          <DatePicker
            selected={range.startDate}
            onChange={(date) => handleDateChange(index, 'startDate', date)}
          />
          <label>End Date {index + 1}:</label>
          <DatePicker
            selected={range.endDate}
            onChange={(date) => handleDateChange(index, 'endDate', date)}
          />
        </div>
      ))}
      <div>
        <label>Image:</label>
        <input type="file" onChange={handleProfilePicChange} />
      </div>
      <button type="submit">Upload Package</button>
    </form>
  );
};























export default UploadPackage;
