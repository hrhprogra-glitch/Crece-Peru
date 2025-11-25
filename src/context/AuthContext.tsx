import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// Interfaz para los datos públicos del usuario (sin contraseña)
interface User {
  name: string;
  email: string;
  career: string;
}

// Interfaz para los datos almacenados en localStorage (incluye contraseña)
interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // La función register recibe todos los datos, incluyendo la contraseña
  register: (userData: StoredUser) => boolean; 
  logout: () => void;
  login: (credentials: { email: string; password: string }) => boolean;
  finalizeAuth: () => void;
}

const USER_STORAGE_KEY = 'bolt_auth_user';

// 1. Create Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Create Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  // Helper para extraer datos públicos de un StoredUser
  const getPublicUser = (storedUser: StoredUser): User => ({
    name: storedUser.name,
    email: storedUser.email,
    career: storedUser.career,
  });

  // Initial load effect
  useEffect(() => {
    const storedUserJson = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUserJson) {
      try {
        const storedUser: StoredUser = JSON.parse(storedUserJson);
        // Solo cargamos los datos públicos al estado
        setUser(getPublicUser(storedUser));
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Function to register: Stores the full StoredUser object
  const register = (userData: StoredUser) => {
    // Guardamos el objeto completo (incluyendo password) en localStorage
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    
    // Establecemos el usuario pendiente (solo datos públicos)
    setPendingUser(getPublicUser(userData));
    return true;
  };

  // Function to finalize authentication (used after success message or login)
  const finalizeAuth = () => {
    let finalUser = pendingUser;
    
    if (!finalUser) {
      const storedUserJson = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUserJson) {
        try {
          const storedUser: StoredUser = JSON.parse(storedUserJson);
          // Si no hay pendingUser, lo extraemos de localStorage
          finalUser = getPublicUser(storedUser);
        } catch (e) {
          console.error("Error finalizing auth from localStorage", e);
          return;
        }
      }
    }

    if (finalUser) {
      setUser(finalUser);
      setIsAuthenticated(true);
      setPendingUser(null);
    }
  };

  // Login Function (simulated): Validates email AND password
  const login = (credentials: { email: string; password: string }) => {
    const storedUserJson = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUserJson) {
      try {
        const storedUser: StoredUser = JSON.parse(storedUserJson);
        
        // Validación CRÍTICA: Verifica que el email Y la contraseña coincidan
        if (storedUser.email === credentials.email && storedUser.password === credentials.password) {
          // Preparamos el usuario público para finalizeAuth
          setPendingUser(getPublicUser(storedUser)); 
          return true; // Éxito
        }
      } catch (e) {
        console.error("Error parsing user from localStorage during login", e);
      }
    }
    return false; // Fallo
  };

  const logout = () => {
    // FIX: Eliminamos la línea que borraba los datos de la cuenta.
    // Ahora, el logout solo borra la sesión, manteniendo las credenciales
    // en localStorage para futuros inicios de sesión.
    // localStorage.removeItem(USER_STORAGE_KEY); 
    setUser(null);
    setIsAuthenticated(false);
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    register,
    logout,
    login,
    finalizeAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Export the consumer hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
