import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from "../../commonScripts/firebase";
import 'react-datepicker/dist/react-datepicker.css';


const UploadPackage = () => {
  const [file, setFile] = useState(null);
  const [packageName, setPackageName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [numPeople, setNumPeople] = useState('');
  const [transport, setTransport] = useState('');
  const [dhama, setDhama] = useState('');

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const db = getFirestore(app);
  const auth = getAuth(app);
 
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
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

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
        const dataURL = canvas.toDataURL("image/png");
        const newFile = dataURLtoFile(dataURL, file.name);
        setFile(newFile);
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

    const user = auth.currentUser;
    if (!user) {
      alert('You must be signed in to upload a package.');
      return;
    }

    if (!file) {
      alert('Please upload a file first!');
      return;
    }

    try {
      const storageRef = ref(storage, `images/travelGuide/${user.uid}/${packageName}`);
      const uploadTask = uploadBytesResumable(storageRef, file, { contentType: file.type });

      const uploadUrl = await new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Upload error:", error);
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
          }
        );
      });

      const document = {
        tourAgentId: user.uid,
        packageName: packageName,
        dhama: dhama,
        description: description,
        price: price,
        numPeople: numPeople,
        transport: transport,
        packageImage: uploadUrl,
        travelPackageImages: [uploadUrl],
        rating: 0,
        numReviews: 0,
        numRatings: 0,
        verifiedStatus: false,
      };

      try {
        // 1. Add document to 'tourPackages' collection:
        const docRef = await addDoc(collection(db, 'tourPackages'), document);
        console.log('Document written with ID: ', docRef.id);
      
        // 2. Create nested paths (corrected):
        const partnerProfileRef = doc(db, 'partners', user.uid, 'partnerProfiles', 'travelGuide', 'tourPackages', docRef.id);
        const travelGuidePackageRef = doc(db, 'travelGuides', user.uid, 'tourPackages', docRef.id);
      
        // 3. Set data for nested documents (improved clarity):
        const updatedDocument = { ...document, id: docRef.id }; // Include `id` field for reference
        await setDoc(partnerProfileRef, updatedDocument);
        await setDoc(travelGuidePackageRef, updatedDocument);
      
      } catch (error) {
        console.error("Error uploading package:", error);
      }
      

      alert('Package uploaded successfully!');
      setPackageName('');
      setDescription('');
      setPrice('');
      setNumPeople('');
      setTransport('');
      setFile(null);
    } catch (error) {
      console.error("Error uploading package:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full px-6 py-4 items-center space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Upload Your Dhama Tour Package</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <form onSubmit={handleSubmit} className="gap-4 space-y-4 px-4 py-2 space-y-8 bg-white p-8 rounded-lg shadow-lg">
              <div className='mb-4'>
                <label className="col-5 block text-gray-700 font-bold mb-2">Package Name:</label>
                <input
                  type="text"
                  value={packageName}
                  placeholder='Enter package name'
                  onChange={(e) => setPackageName(e.target.value)}
                  className="col-6 ms-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className='mb-4'>
                <label className="col-5 block text-gray-700 font-bold mb-2">Select Place:</label>
                <select className="col-6 ms-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => {
                  const selectedOptionText = e.target.options[e.target.selectedIndex].text;
                  setDhama(selectedOptionText);
                }}>
                  <option value="">Open this select menu</option>
                  <option value="1">Vrindavan and Braja Mandal</option>
                  <option value="2">Mayapur and WestBengal</option>
                  <option value="3">Haridwar, Rishikesh, Uttarakhand</option>
                  <option value="4">Dwarka, Gujarat</option>
                  <option value="5">Rameshwaram, South India</option>
                </select>
              </div>

              <div className='mb-4 d-flex'>
                <label className="col-5 block text-gray-700 font-bold mb-2">Description:</label>
                <textarea
                  value={description}
                  placeholder='Type your description here'
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-6 ms-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow-1" />
              </div>

              <div className='mb-4'>
                <label className="col-5 block text-gray-700 font-bold mb-2">Price:</label>
                <input
                  type="text"
                  placeholder='Enter price in Rupees'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="col-6 ms-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className='mb-4'>
                <label className="col-5 block text-gray-700 font-bold mb-2">Package For: </label>
                <input
                  type="number"
                  value={numPeople}
                  placeholder='Enter number of people'
                  onChange={(e) => setNumPeople(e.target.value)}
                  className="col-6 ms-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className='mb-4'>
                <label className="col-5 block text-gray-700 font-bold mb-2">Transport Options:</label>
                <select className="col-6 ms-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={transport} onChange={(e) => setTransport(e.target.value)}>
                  <option value="">Select Transport Option</option>
                  <option value="car">Car</option>
                  <option value="bus">Bus</option>
                </select>
              </div>

              <div className='mb-4'>
                <label className="col-4 block text-gray-700 font-bold mb-2">Image:</label>
                <input type="file" onChange={handleProfilePicChange} className="col-6 ms-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className='mb-4 w-full flex items-center'>
                <button type="submit" className="btn btn-primary items-center">
                  Upload Package
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPackage;
