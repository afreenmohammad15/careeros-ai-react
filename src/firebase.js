import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDauMm4MGYAFBNFYglE0r63Q5MGBHFhmcg",
  authDomain: "careeros-ai-358b3.firebaseapp.com",
  projectId: "careeros-ai-358b3",
  storageBucket: "careeros-ai-358b3.firebasestorage.app",
  messagingSenderId: "670749379529",
  appId: "1:670749379529:web:2c52188b22148c75d47618"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;