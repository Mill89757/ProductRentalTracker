import { auth } from './config';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  type User
} from 'firebase/auth';

export type { User };

export const signIn = async (email: string, password: string) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { user: cred.user, error: null };
  } catch (error) {
    return { user: null, error: (error as Error).message };
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return { user: cred.user, error: null };
  } catch (error) {
    return { user: null, error: (error as Error).message };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = () => auth.currentUser;