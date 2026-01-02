import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firebaseAuth, firebaseDb } from '@/lib/firebase';

export type UserRole = 'admin' | 'executive' | 'control_room' | 'field_team';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  loginAsDemo: (role: UserRole) => Promise<void>;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getRoleDashboard = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'executive':
      return '/executive';
    case 'control_room':
      return '/control-room';
    case 'field_team':
      return '/field-team';
    default:
      return '/';
  }
};

const buildUserFromFirebase = (firebaseUser: FirebaseUser, role: UserRole | null): User => {
  const email = firebaseUser.email ?? '';
  const username = (firebaseUser.displayName || email.split('@')[0] || 'User');

  return {
    id: firebaseUser.uid,
    email,
    username,
    role: role ?? 'field_team',
  };
};

const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
  const ref = doc(firebaseDb, 'userRoles', userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as { role?: string };
  if (!data.role) return null;
  return data.role as UserRole;
};

const ensureDefaultRole = async (userId: string): Promise<UserRole> => {
  const ref = doc(firebaseDb, 'userRoles', userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { role: 'field_team' as UserRole }, { merge: true });
    return 'field_team';
  }
  const data = snap.data() as { role?: string };
  const role = (data.role as UserRole) ?? 'field_team';
  return role;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Optimistic user without role
      setUser(buildUserFromFirebase(firebaseUser, null));

      // Load role separately
      const role = (await fetchUserRole(firebaseUser.uid)) ?? 'field_team';
      setUser(buildUserFromFirebase(firebaseUser, role));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const firebaseUser = cred.user;
      const role = await ensureDefaultRole(firebaseUser.uid);
      setUser(buildUserFromFirebase(firebaseUser, role));
      navigate(getRoleDashboard(role));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<void> => {
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, userData.email, userData.password);
      const firebaseUser = cred.user;

      // Default all new accounts to field_team role in Firestore
      await setDoc(doc(firebaseDb, 'userRoles', firebaseUser.uid), {
        role: 'field_team',
        username: userData.username,
        email: userData.email,
      }, { merge: true });

      const role: UserRole = 'field_team';
      setUser(buildUserFromFirebase(firebaseUser, role));
      navigate(getRoleDashboard(role));
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async (role: UserRole): Promise<void> => {
    setIsLoading(true);
    try {
      const creds: Record<UserRole, { email: string; password: string }> = {
        admin: { email: 'demo-admin@safetext.app', password: 'DemoAdmin123!' },
        executive: { email: 'demo-executive@safetext.app', password: 'DemoExec123!' },
        control_room: { email: 'demo-control@safetext.app', password: 'DemoControl123!' },
        field_team: { email: 'demo-field@safetext.app', password: 'DemoField123!' },
      };

      const { email, password } = creds[role];
      let firebaseUser: FirebaseUser | null = null;

      try {
        const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
        firebaseUser = cred.user;
      } catch (error: any) {
        if (error?.code === 'auth/user-not-found') {
          const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
          firebaseUser = cred.user;
        } else {
          throw error;
        }
      }

      if (!firebaseUser) return;

      await setDoc(
        doc(firebaseDb, 'userRoles', firebaseUser.uid),
        {
          role,
          email,
          username: `demo-${role}`,
        },
        { merge: true }
      );

      const appUser = buildUserFromFirebase(firebaseUser, role);
      setUser(appUser);
      navigate(getRoleDashboard(role));
    } finally {
      setIsLoading(false);
    }
  };
  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(firebaseAuth);
      setUser(null);
      navigate('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { getRoleDashboard };
