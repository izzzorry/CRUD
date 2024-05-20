import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBGEuu6MpkekPehMuIJmpTu5G49HinOwII",
  authDomain: "holamundo-27557.firebaseapp.com",
  databaseURL: "https://holamundo-27557-default-rtdb.firebaseio.com",
  projectId: "holamundo-27557",
  storageBucket: "holamundo-27557.appspot.com",
  messagingSenderId: "122406746899",
  appId: "1:122406746899:web:de540480958d5017ca78e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app); // Exportar storage
