const admin = require('firebase-admin');
const fs = require('fs');

// Initialize the Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert('./waggys-medical-firebase-adminsdk-m6ze6-93dbb1e90c.json'),
//   databaseURL: 'https://waggys-medical.firebaseio.com'
// });
admin.initializeApp({
  credential: admin.credential.cert('./waggys-ws-firebase-adminsdk-fyyfp-a538cf441d.json'),
  databaseURL: 'https://waggys-ws.firebaseio.com'
});

const db = admin.firestore();

// Function to export user data
// async function exportUsers() {
//   const users = [];
//   let nextPageToken = undefined;

//   do {
//     const response = await admin.auth().listUsers(1000, nextPageToken);
//     nextPageToken = response.pageToken;

//     response.users.forEach(user => {
//       users.push({
//         uid: user.uid,
//         email: user.email,
//         displayName: user.displayName,
//         // ... other user data you want to export
//       });
//     });
//   } while (nextPageToken);

//   // Write user data to a JSON file
//   fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
//   console.log('Total users:', users.length);
// }

// exportUsers();
