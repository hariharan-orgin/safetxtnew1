import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

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
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  location?: string;
  phone?: string;
  gender?: string;
  enableOtp?: boolean;
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('safetext_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('safetext_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call - In production, this would be Firebase Auth
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        username: email.split('@')[0],
        role,
      };
      
      setUser(newUser);
      localStorage.setItem('safetext_user', JSON.stringify(newUser));
      
      // Redirect based on role
      navigate(getRoleDashboard(role));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call - In production, this would be Firebase Auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: crypto.randomUUID(),
        email: userData.email,
        username: userData.username,
        role: userData.role,
        location: userData.location,
        phone: userData.phone,
        gender: userData.gender,
      };
      
      setUser(newUser);
      localStorage.setItem('safetext_user', JSON.stringify(newUser));
      
      // Redirect based on role
      navigate(getRoleDashboard(userData.role));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('safetext_user');
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { getRoleDashboard };
