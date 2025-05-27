import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from "firebase/storage";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBStw5ZK8ZBLKYlcQjq4L0szxIpK5V99QQ",
  authDomain: "libraryautoma.firebaseapp.com",
  projectId: "libraryautoma",
  storageBucket: "libraryautoma.firebasestorage.app",
  messagingSenderId: "322964372142",
  appId: "1:322964372142:web:b9010ec29bf131c0380b3f",
  measurementId: "G-TGJ9CF1P2K"
};

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


export const googleProvider = new GoogleAuthProvider(); 
export { rtdb, app, db, auth, storage };