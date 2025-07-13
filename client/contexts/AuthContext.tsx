import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type UserRole = "DJ" | "BARISTA" | "HOST" | "COMPANY";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  companyName?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  initialLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }

      const { user, token } = await response.json();

      // Store auth data
      localStorage.setItem("eventflow_token", token);
      localStorage.setItem("eventflow_user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          name: userData.name,
          role: userData.role?.toUpperCase(),
          phone: userData.phone,
          companyName: userData.companyName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Registration failed");
      }

      const { user, token } = await response.json();

      // Store auth data
      localStorage.setItem("eventflow_token", token);
      localStorage.setItem("eventflow_user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("eventflow_user");
    localStorage.removeItem("eventflow_token");
  };

  // Check for existing session on mount
  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem("eventflow_token");
      const savedUser = localStorage.getItem("eventflow_user");

      if (token && savedUser) {
        try {
          // Validate token with server
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const { user } = await response.json();
            setUser(user);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem("eventflow_token");
            localStorage.removeItem("eventflow_user");
          }
        } catch (error) {
          // Network error or token validation failed
          localStorage.removeItem("eventflow_token");
          localStorage.removeItem("eventflow_user");
        }
      }
      setInitialLoading(false);
    };

    validateSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
        initialLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
