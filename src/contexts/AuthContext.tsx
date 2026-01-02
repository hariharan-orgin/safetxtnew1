import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'executive' | 'control_room' | 'field_team';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  location?: string;
  phone?: string;
  gender?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
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

const buildUserFromSession = (session: Session | null, role: UserRole | null): User | null => {
  const supaUser = session?.user as SupabaseUser | null | undefined;
  if (!supaUser) return null;

  const email = supaUser.email ?? '';
  const username = (supaUser.user_metadata as any)?.username || email.split('@')[0] || 'User';

  return {
    id: supaUser.id,
    email,
    username,
    role: role ?? 'field_team',
  };
};

const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch user role', error);
    return null;
  }

  return (data?.role as UserRole) ?? null;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionChange = async (session: Session | null) => {
      const supaUser = session?.user as SupabaseUser | null | undefined;

      if (!supaUser) {
        setUser(null);
        return;
      }

      const baseUser = buildUserFromSession(session, null);
      setUser(baseUser);

      // Fetch role in a separate microtask to avoid deadlocks
      setTimeout(async () => {
        const role = await fetchUserRole(supaUser.id);
        if (role) {
          setUser(prev => (prev ? { ...prev, role } : prev));
        }
      }, 0);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSessionChange(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSessionChange(session);
      setIsLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      const session = data.session;
      const supaUser = session?.user as SupabaseUser | null | undefined;
      if (!supaUser) return;

      const role = await fetchUserRole(supaUser.id) ?? 'field_team';
      const appUser = buildUserFromSession(session, role);
      setUser(appUser);

      navigate(getRoleDashboard(role));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<void> => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/auth`;

      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: userData.username,
          },
        },
      });

      if (error) {
        throw error;
      }

      const newUser = data.user as SupabaseUser | null | undefined;

      // For security, default all new accounts to field_team role
      if (newUser) {
        await supabase.from('user_roles').insert({
          user_id: newUser.id,
          role: 'field_team',
        });
      }

      // After sign up, rely on auth listener + email confirmation
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { getRoleDashboard };
