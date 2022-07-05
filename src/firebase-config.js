import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAzSCwOqaqzufOg6l2IRBPwZKD4icGIbHI",
    authDomain: "image-handler-tutorial.firebaseapp.com",
    projectId: "image-handler-tutorial",
    storageBucket: "image-handler-tutorial.appspot.com",
    messagingSenderId: "451566200944",
    appId: "1:451566200944:web:932586305689c30ffa6cb5"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  });
  export const auth = getAuth(app);
  export const provider = new GoogleAuthProvider();
  export const storage = getStorage(app);