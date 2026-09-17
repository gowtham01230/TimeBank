import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  users: User[]; // This will now be managed by the Admin dashboard separately
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (name: string, email: string, phone: string, pass: string) => Promise<void>;
  signOut: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  updateAnyUser: (userId: string, updatedData: Partial<User>) => Promise<void>;
  sendWarning: (userId: string, message: string) => Promise<void>;
  getUsers: () => Promise<User[]>; // For admin
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]); // Admin user list
  const [loading, setLoading] = useState(true);

  const fetchUser = async (token: string) => {
    try {
        const response = await fetch(`${API_URL}/auth`, {
            headers: { 'x-auth-token': token }
        });
        if (!response.ok) throw new Error('Token invalid');
        const userData = await response.json();
        // The backend sends _id, but frontend uses id. Let's map it.
        setUser({ ...userData, id: userData._id });
    } catch (error) {
        console.error("Failed to fetch user with token", error);
        sessionStorage.removeItem('timebank_token');
        setUser(null);
    }
  }

  useEffect(() => {
    const token = sessionStorage.getItem('timebank_token');
    if (token) {
        fetchUser(token).finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, []);

  const signIn = async (email: string, pass: string): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to sign in.');
    }
    const { token } = await response.json();
    sessionStorage.setItem('timebank_token', token);
    await fetchUser(token);
  };

  const signUp = async (name: string, email: string, phone: string, pass: string): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password: pass })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to sign up.');
    }

    const { token } = await response.json();
    sessionStorage.setItem('timebank_token', token);
    await fetchUser(token);
  };

  const signOut = () => {
    setUser(null);
    sessionStorage.removeItem('timebank_token');
  };

  const updateUser = (updatedUserInfo: Partial<User>) => {
    // This now needs to be an API call
    console.log("Updating user profile (API call needed):", updatedUserInfo);
    if (user) {
        const updatedUser = { ...user, ...updatedUserInfo };
        setUser(updatedUser);
    }
  };
  
  const getUsers = async (): Promise<User[]> => {
    const token = sessionStorage.getItem('timebank_token');
    const response = await fetch(`${API_URL}/admin/users`, {
        headers: { 'x-auth-token': token || '' }
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await response.json();
    const mappedData = data.map((u: any) => ({ ...u, id: u._id }));
    setUsers(mappedData);
    return mappedData;
  }

  const updateAnyUser = async (userId: string, updatedData: Partial<User>) => {
    const token = sessionStorage.getItem('timebank_token');
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token || '' },
        body: JSON.stringify(updatedData)
    });
     if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to update user.');
    }
    // Refresh the list after update
    await getUsers();
  };
  
  const sendWarning = async (userId: string, message: string) => {
    const token = sessionStorage.getItem('timebank_token');
    const response = await fetch(`${API_URL}/admin/users/${userId}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token || '' },
        body: JSON.stringify({ message })
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to send warning.');
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, users, loading, signIn, signUp, signOut, updateUser, updateAnyUser, sendWarning, getUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
