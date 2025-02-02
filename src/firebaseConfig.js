import firebase from 'firebase'
import 'firebase/firestore'

// firebase init goes here
const firebaseConfig = {
    apiKey: "AIzaSyCm2gv2HPIzqzZHHe9SKc3w9dxUQ6f89rE",
    authDomain: "swal-jawab.firebaseapp.com",
    databaseURL: "https://swal-jawab.firebaseio.com",
    projectId: "swal-jawab",
    storageBucket: "swal-jawab.appspot.com",
    messagingSenderId: "1090119072720",
    appId: "1:1090119072720:web:65f55215e33c7073fa97d5",
    measurementId: "G-CYZEWEJP4Q"
};
firebase.initializeApp(firebaseConfig)

// firebase utils
const db = firebase.firestore()
const realtimedb = firebase.database();
const auth = firebase.auth()
const currentUser = auth.currentUser



// firebase collections
const usersCollection = db.collection('users')
const gameSessionRef = realtimedb.ref('/gamesession')

export {
    db,
    realtimedb,
    auth,
    currentUser,
    usersCollection,
    gameSessionRef
}
