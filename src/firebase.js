import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDjLi5pNuu2haxvCt715v1EcSpt7fdAYh0",
    authDomain: "cookitalia-3be46.firebaseapp.com",
    projectId: "cookitalia-3be46",
    storageBucket: "cookitalia-3be46.firebasestorage.app",
    messagingSenderId: "15771699191",
    appId: "1:15771699191:web:c770a750a6b8d0c76550f2",
    measurementId: "G-MTN0D9YTMH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);

// Esportiamo i servizi Firebase usati dall'app
export { auth, firestore };
