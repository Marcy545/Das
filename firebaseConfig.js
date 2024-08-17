import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB8KoEgSfcetJyvBpGQeBV35jgC3X7xNGU",
  authDomain: "tododas-ea7f7.firebaseapp.com",
  projectId: "tododas-ea7f7",
  storageBucket: "tododas-ea7f7.appspot.com",
  messagingSenderId: "875032766252",
  appId: "1:875032766252:web:b88f662fdd4aed6837ee89",
  measurementId: "G-64XVFBZNKM"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);


export { auth,db };