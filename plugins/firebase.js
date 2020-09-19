import firebase from 'firebase'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyBw-_WKjJsE7E9cctA37pJrK-N_3QQwzcc',
    authDomain: 'web-chat-3d1e1.firebaseapp.com',
    databaseURL: 'https://web-chat-3d1e1.firebaseio.com',
    projectId: 'web-chat-3d1e1',
    storageBucket: 'web-chat-3d1e1.appspot.com',
    messagingSenderId: '488964320656',
    appId: '1:488964320656:web:377f9f0fe1a6f9a110d715',
    measurementId: 'G-V8MFEQHPJM',
  })
}

export default firebase
