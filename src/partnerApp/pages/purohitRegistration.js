import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
// Import your Firebase config
import { firebaseConfig } from "./firebase"; // Make sure to create this file

var filePurohitPics = [];
var purohitPicUrls = [];
const PurohitRegistration = () => {
  const [name, setName] = useState("");
  const [sampradaya, setSampradaya] = useState("");
  const [spiritualMaster, setSpiritualMaster] = useState("");
  const [leader, setLeader] = useState("");
  const [leaderContact, setLeaderContact] = useState("");

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth();
  const storage = getStorage(app);
  const metadata = {
    contentType: "image/jpeg",
  };

  const handleProfilePicChange = (e) => {
    var file = e.target.files[0];
    handleLoadAvatar(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload purohit pictures
    for (var i = 0; i < 3; i++) {
      const profilePicRef = ref(
        storage,
        `images/profile_${name}_${auth.currentUser.email}/purohitPic${i}_${name}_${auth.currentUser.email}`
      );
      const profilePicUploadTask = uploadBytesResumable(
        profilePicRef,
        filePurohitPics[i],
        metadata
      );

      profilePicUploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(profilePicUploadTask.snapshot.ref).then(
            (downloadURL) => {
              purohitPicUrls.push(downloadURL);
              console.log("File available at purohitPicUrls", purohitPicUrls);
              console.log("File available at purohitPicUrls.length", purohitPicUrls.length);

              if (purohitPicUrls.length > 2) {
                for (var i = 0; i < 3; i++) {
                  try {
                    const propertyName = `purohitPic${i}`;
                    const purohitInfo = {
                      [propertyName]: purohitPicUrls[i],
                    };
                    const userId = auth.currentUser.uid;
                    const partnerRef = doc(db, "partners", userId, "partnerProfiles", "purohitInfo");
                    setDoc(partnerRef, purohitInfo, { merge: true });
                    console.log(
                      "Profile information purohit pic url successfully added! purohitPicUrl${i}",
                      purohitPicUrls[i]
                    );
                  } catch (error) {
                    console.error("Error adding profile information:", error);
                  }
                }
              }
            }
          );
        }
      );
    }


    const purohitInfo = {
      "spiritualName": name,
      "sampradaya": sampradaya,
      "spiritualMaster": spiritualMaster,
      "leader": leader,
      "leaderContact": leaderContact,
    };
    const userId = auth.currentUser.uid;
    const partnerRef = doc(db, "partners", userId, "partnerProfiles", "purohitInfo");
    setDoc(partnerRef, purohitInfo, { merge: true });

    // Clear form fields
    setName("");
    setSampradaya("");
    setSpiritualMaster("");
    setLeader("");
    setLeaderContact("");
  };



  return (
    <>
    <h1 className="text-center">Register As a Purohit</h1>
    <h3 className="text-center">Fill Up your Profile</h3>

    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="name">Spiritual Name:</label>
            <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="sampradaya">Sampradaya:</label>
            <input type="text" id="sampradaya" name="sampradaya" value={sampradaya} onChange={(e) => setSampradaya(e.target.value)} className="form-control" required />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="spiritualMaster">Spiritual Master:</label>
            <input type="text" id="spiritualMaster" name="spiritualMaster" value={spiritualMaster} onChange={(e) => setSpiritualMaster(e.target.value)} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label htmlFor="leader">Leader:</label>
            <input type="text" id="leader" name="leader" value={leader} onChange={(e) => setLeader(e.target.value)} className="form-control" required />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="leaderContact">Leader Phone:</label>
            <input type="text" id="leaderContact" name="leaderContact" value={leaderContact} onChange={(e) => setLeaderContact(e.target.value)} className="form-control" required />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <p>Please Provide 2 Pictures Of Yourself Doing Samsakara in jpeg format</p>
            <label htmlFor="profilePic">Provide Pictures:</label>
            <input className="form-control mb-2" type="file" id="profilePic1" name="profilePic1" accept="image/*" required />
            <input className="form-control mb-2" type="file" id="profilePic2" name="profilePic2" accept="image/*" required />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <p>Please Provide Picture of certificate from your spiritualMaster/ Guru recommending that you are qualified to become Purohit in jpeg format</p>
            <label htmlFor="certificatePic">Provide Certificate Picture:</label>
            <input className="form-control" type="file" id="certificatePic" name="certificatePic" accept="image/*" required />
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

function handleLoadAvatar(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.addEventListener("load", (event) => {
    const img = new Image();
    img.src = event.target.result;

    // Resize logic after image loads
    img.onload = function () {
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

      ctx.drawImage(img, 0, 0, width, height);

      var dataURL = canvas.toDataURL("image/png"); // Get resized image as data URL
      const profilePic = document.getElementById("profilePic");
      profilePic.setAttribute("src", dataURL);
      filePurohitPics.push(dataURLtoFile(dataURL, "profilePic.png"));
      console.log("profilePic dataurl", dataURL);
      console.log("profilePic file", filePurohitPics);
    };
  });
  return filePurohitPics;
}

function dataURLtoFile(dataURL, filename) {
  // Split the data URL to get the base64 data
  const [, base64Data] = dataURL.split(",");

  // Decode the base64 data
  const decodedData = atob(base64Data);

  // Convert the decoded data into a binary array
  const binaryData = new Uint8Array(decodedData.length);
  for (let i = 0; i < decodedData.length; i++) {
    binaryData[i] = decodedData.charCodeAt(i);
  }

  // Create a Blob object from the binary data
  const blob = new Blob([binaryData], { type: "image/png" }); // Adjust the type as per your image format

  // Optionally, create a File object from the Blob
  const file = new File([blob], filename, { type: "image/png" }); // Adjust the type as per your image format

  return file;
}
