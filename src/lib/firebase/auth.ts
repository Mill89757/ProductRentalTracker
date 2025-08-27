// Hardcoded authentication system with localStorage persistence
export interface User {
  uid: string;
  email: string;
}

// Hardcoded user credentials
const VALID_CREDENTIALS: Record<string, string> = {
  'yushuguo89757@gmail.com': '123456'
};

const STORAGE_KEY = 'prt_auth_email';

// Simulate user state
let currentUser: User | null = null;
let authStateCallbacks: ((user: User | null) => void)[] = [];

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function loadUserFromStorage() {
  if (!isBrowser()) return;
  const email = localStorage.getItem(STORAGE_KEY);
  if (email && VALID_CREDENTIALS[email]) {
    currentUser = { uid: 'dummy-uid-123', email };
  } else {
    currentUser = null;
  }
}

// Load once on module import
loadUserFromStorage();

export const signIn = async (email: string, password: string) => {
  try {
    // Check against hardcoded credentials
    if (VALID_CREDENTIALS[email] === password) {
      currentUser = {
        uid: 'dummy-uid-123',
        email: email
      };
      if (isBrowser()) {
        localStorage.setItem(STORAGE_KEY, email);
      }
      // Notify all auth state listeners
      authStateCallbacks.forEach(callback => callback(currentUser));
      
      return { user: currentUser, error: null };
    } else {
      return { user: null, error: 'Invalid email or password' };
    }
  } catch (error) {
    return { user: null, error: (error as Error).message };
  }
};

export const signUp = async (email: string, password: string) => {
  // Sign up is disabled in this hardcoded system
  return { user: null, error: 'Account creation is disabled. Please contact administrator.' };
};

export const signOut = async () => {
  try {
    currentUser = null;
    if (isBrowser()) {
      localStorage.removeItem(STORAGE_KEY);
    }
    // Notify all auth state listeners
    authStateCallbacks.forEach(callback => callback(null));
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  // Ensure we always reflect storage before subscribing
  loadUserFromStorage();
  authStateCallbacks.push(callback);
  
  // Immediately call with current state
  callback(currentUser);
  
  // Return unsubscribe function
  return () => {
    const index = authStateCallbacks.indexOf(callback);
    if (index > -1) {
      authStateCallbacks.splice(index, 1);
    }
  };
};

// Helper function to get current user
export const getCurrentUser = () => currentUser;