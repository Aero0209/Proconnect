import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAOptpPdtPwOWIQAUqY_jgOxUayo4rmb8U",
  authDomain: "proconnect-1ee0c.firebaseapp.com",
  projectId: "proconnect-1ee0c",
  storageBucket: "proconnect-1ee0c.firebasestorage.app",
  messagingSenderId: "128177604769",
  appId: "1:128177604769:web:1fc4e13399ea25a11a48e0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ADMIN_EMAIL = "noah180305@gmail.com";

interface AdminData {
  authorized: boolean;
  addedAt: Date;
  isAdmin: boolean;
}

async function initializeAdmin(): Promise<void> {
  try {
    const adminData: AdminData = {
      authorized: true,
      addedAt: new Date(),
      isAdmin: true
    };

    await setDoc(doc(db, 'authorizedEmails', ADMIN_EMAIL), adminData);
    console.log('Admin initialisé avec succès');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'admin:', error);
    process.exit(1);
  }
}

initializeAdmin(); 