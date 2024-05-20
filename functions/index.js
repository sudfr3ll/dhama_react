const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.setCustomClaims = functions.auth.user().onCreate((user) => {
  // Check if the user signed in with a phone number
  if (user.phoneNumber) {
    return admin.auth().setCustomUserClaims(user.uid, {phoneUser: true});
  }
  return null;
});
