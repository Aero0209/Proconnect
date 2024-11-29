import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, arrayUnion, arrayRemove, updateDoc, doc } from 'firebase/firestore';
import { Project, MessageReaction } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyAOptpPdtPwOWIQAUqY_jgOxUayo4rmb8U",
  authDomain: "proconnect-1ee0c.firebaseapp.com",
  projectId: "proconnect-1ee0c",
  storageBucket: "proconnect-1ee0c.firebasestorage.app",
  messagingSenderId: "128177604769",
  appId: "1:128177604769:web:1fc4e13399ea25a11a48e0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

interface ProjectData {
  name: string;
  siteUrl: string;
  githubUrl: string;
  description?: string;
}

export const createProject = async (projectData: ProjectData): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      createdAt: serverTimestamp(),
      createdBy: auth.currentUser?.uid,
      createdByEmail: auth.currentUser?.email
    });
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de la création du projet:", error);
    throw error;
  }
};

export const addProjectMessage = async (projectId: string, message: string): Promise<void> => {
  try {
    await addDoc(collection(db, `projects/${projectId}/messages`), {
      text: message,
      userId: auth.currentUser?.uid,
      userEmail: auth.currentUser?.email,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    throw error;
  }
};

export const addReactionToMessage = async (
  projectId: string,
  messageId: string,
  emoji: string,
  userId: string,
  userEmail: string
): Promise<void> => {
  const messageRef = doc(db, `projects/${projectId}/messages/${messageId}`);
  await updateDoc(messageRef, {
    reactions: arrayUnion({ emoji, userId, userEmail })
  });
};

export const removeReactionFromMessage = async (
  projectId: string,
  messageId: string,
  reaction: MessageReaction
): Promise<void> => {
  const messageRef = doc(db, `projects/${projectId}/messages/${messageId}`);
  await updateDoc(messageRef, {
    reactions: arrayRemove(reaction)
  });
};

export const markMessageAsRead = async (
  projectId: string,
  messageId: string,
  userId: string
): Promise<void> => {
  const messageRef = doc(db, `projects/${projectId}/messages/${messageId}`);
  await updateDoc(messageRef, {
    readBy: arrayUnion(userId)
  });
};

export const toggleMessagePin = async (
  projectId: string,
  messageId: string,
  isPinned: boolean
): Promise<void> => {
  const messageRef = doc(db, `projects/${projectId}/messages/${messageId}`);
  await updateDoc(messageRef, { isPinned });
}; 