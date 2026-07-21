import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDNR0K-789Lyn6PtzueJmE__rUDor0x78k",
  authDomain: "surveyapp-27542.firebaseapp.com",
  projectId: "surveyapp-27542",
  storageBucket: "surveyapp-27542.firebasestorage.app",
  messagingSenderId: "55021165219",
  appId: "1:55021165219:web:8a75f6f38166258dcd3d16"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)