import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyB-stW8owazSZN32MxxVbIC3PKorkArTNs",
  authDomain: "contact-dyn.firebaseapp.com",
  projectId: "contact-dyn",
  storageBucket: "contact-dyn.appspot.com",
  messagingSenderId: "474249793616",
  appId: "1:474249793616:web:598f22bac776977bc5c155",
  measurementId: "G-CWTBTGYM9D"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

export const auth = firebaseApp.auth()
export const firestore = firebaseApp.firestore();

export default firebaseApp;