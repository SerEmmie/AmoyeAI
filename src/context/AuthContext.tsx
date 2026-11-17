import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { checkIsAdmin } from '../lib/communityService';
import { auth } from '../lib/firebase';

interface AuthContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  adminChecking: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecking, setAdminChecking] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
      if (!nextUser) {
        setIsAdmin(false);
        setAdminChecking(false);
        return;
      }
      setAdminChecking(true);
      const verified = await checkIsAdmin(
        nextUser.uid,
        nextUser.email,
        nextUser.emailVerified
      );
      setIsAdmin(verified);
      setAdminChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unable to sign in with Google.';
      setAuthError(msg);
    }
  };

  const signOutUser = async () => {
    setAuthError(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        isAdmin,
        adminChecking,
        authError,
        signInWithGoogle,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }
  return ctx;
}
