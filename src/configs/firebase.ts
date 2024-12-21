// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: '',
  authDomain: 'circo-1122.firebaseapp.com',
  projectId: 'circo-1122',
  storageBucket: 'circo-1122.firebasestorage.app',
  messagingSenderId: '714400700723',
  appId: '1:714400700723:web:dc43e825e420e9619ac646',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, GoogleAuthProvider, signInWithPopup };