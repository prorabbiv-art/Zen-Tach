import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, ADMIN_INITIAL_UID, ADMIN_EMAIL } from '../firebase/config';
import { UserProfile, ShippingAddress } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, fullName: string, phone: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateAddresses: (addresses: ShippingAddress[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Authenticated Admin Authorization Check:
  // Strictly validated against official administrator identity (UID or verified admin email).
  // Never relies on client-controlled localStorage or client-injected role flags.
  const isAuthorizedAdmin = (user: User | null): boolean => {
    if (!user) return false;
    if (user.uid === ADMIN_INITIAL_UID) return true;
    if (user.email === ADMIN_EMAIL && (user.emailVerified || user.providerData.some(p => p.providerId === 'google.com'))) {
      return true;
    }
    return false;
  };

  const isAdmin = isAuthorizedAdmin(currentUser);

  const fetchOrCreateProfile = async (user: User, fallbackName?: string, fallbackPhone?: string) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const adminVerified = isAuthorizedAdmin(user);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        // Enforce role consistency with verified credentials
        const verifiedRole = adminVerified ? 'admin' : 'customer';
        setUserProfile({ ...data, role: verifiedRole });
      } else {
        const newProfile: UserProfile = {
          id: user.uid,
          email: user.email || '',
          fullName: user.displayName || fallbackName || 'ZEN TACH Customer',
          phone: fallbackPhone || '',
          avatarUrl: user.photoURL || '',
          role: adminVerified ? 'admin' : 'customer',
          savedAddresses: [],
          createdAt: new Date().toISOString()
        };

        try {
          await setDoc(userRef, newProfile);
        } catch (e) {
          console.warn('Profile sync notice:', e);
        }
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.warn('Error fetching user profile:', error);
      setUserProfile({
        id: user.uid,
        email: user.email || '',
        fullName: user.displayName || fallbackName || 'Customer',
        phone: fallbackPhone || '',
        avatarUrl: user.photoURL || '',
        role: isAuthorizedAdmin(user) ? 'admin' : 'customer',
        savedAddresses: [],
        createdAt: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchOrCreateProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await fetchOrCreateProfile(result.user);
      }
    } catch (error: any) {
      if (error?.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'unknown domain';
        console.warn(`[Firebase Auth] Domain '${domain}' is not authorized in Firebase Console (Authentication > Settings > Authorized domains).`);
      } else {
        console.warn('Google Sign-in notice:', error);
      }
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      if (cred.user) {
        await fetchOrCreateProfile(cred.user);
      }
    } catch (error) {
      console.error('Email login error:', error);
      throw error;
    }
  };

  const registerWithEmail = async (email: string, pass: string, fullName: string, phone: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: fullName.trim() });
        await fetchOrCreateProfile(cred.user, fullName.trim(), phone.trim());
      }
    } catch (error) {
      console.error('Email registration error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateAddresses = async (addresses: ShippingAddress[]) => {
    if (!currentUser || !userProfile) return;
    const updatedProfile = { ...userProfile, savedAddresses: addresses };
    setUserProfile(updatedProfile);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { savedAddresses: addresses });
    } catch (e) {
      console.warn('Address sync notice:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        loading,
        signInWithGoogle,
        loginWithEmail,
        registerWithEmail,
        resetPassword,
        logout,
        updateAddresses
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
