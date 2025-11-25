import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import WelcomePage from './pages/WelcomePage';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './context/AuthContext'; // Importamos el Provider

// Componente que envuelve AuthLayout y redirige si ya está autenticado
const AuthWrapper: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // CRÍTICO: Si está cargando, no redirigimos para evitar el bucle.
  if (isLoading) return null; 
  
  // Si está autenticado, redirige a /welcome
  return isAuthenticated ? <Navigate to="/welcome" replace /> : <AuthLayout />;
};

// Componente que protege la ruta de bienvenida
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // CRÍTICO: Si está cargando, no redirigimos para evitar el bucle.
  if (isLoading) return null; 
  
  // Si no está autenticado, redirige a /auth
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};


function App() {
  return (
    <AuthProvider> {/* ENVOLVEMOS TODA LA APLICACIÓN CON EL CONTEXTO */}
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Ruta de autenticación (Login/Register) */}
            <Route path="/auth" element={<AuthWrapper />} />
            
            {/* Ruta protegida de bienvenida */}
            <Route path="/welcome" element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />
            
            {/* Redirigir la raíz a la página de autenticación */}
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
