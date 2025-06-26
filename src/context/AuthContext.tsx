import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
} from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  );

  const isAuthenticated = !!token;

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const contentType = res.headers.get('content-type');

      if (!res.ok) {
        let message = `Login failed with status ${res.status}`;
        try {
          if (contentType?.includes('application/json')) {
            const errorData = await res.json();
            message = errorData.message || message;
          } else {
            const text = await res.text();
            message = text || message;
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(message);
      }

      const data = await res.json();

      if (!data.token) {
        throw new Error('No token received from server');
      }

      setToken(data.token);
      localStorage.setItem('authToken', data.token);
    } catch (error) {
      console.error('Login error:', error);
      throw error instanceof Error ? error : new Error('Unknown login error');
    }
  };

  const logout = () => {
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
