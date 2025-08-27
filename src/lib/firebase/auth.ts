// Hardcoded authentication system
export interface User {
  uid: string;
  email: string;
}

// Hardcoded user credentials
const VALID_CREDENTIALS: Record<string, string> = {
  'yushuguo89757@gmail.com': '123456'
};

// Simulate user state
let currentUser: User | null = null;
let authStateCallbacks: ((user: User | null) => void)[] = [];

export const signIn = async (email: string, password: string) => {
  try {
    // Check against hardcoded credentials
    if (VALID_CREDENTIALS[email] === password) {
      currentUser = {
        uid: 'dummy-uid-123',
        email: email
      };
      
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
    
    // Notify all auth state listeners
    authStateCallbacks.forEach(callback => callback(null));
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
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