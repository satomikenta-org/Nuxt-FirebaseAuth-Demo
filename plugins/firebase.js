import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyCA4KhddGb35MweRxiljfpYuw0f8KLPnUk",
    authDomain: "fir-auth-db5c1.firebaseapp.com",
    databaseURL: "https://fir-auth-db5c1.firebaseio.com",
    projectId: "fir-auth-db5c1",
    storageBucket: "fir-auth-db5c1.appspot.com",
    messagingSenderId: "393840585957",
    appId: "1:393840585957:web:9bc318730fa335d4"
  })
}

export default firebase;