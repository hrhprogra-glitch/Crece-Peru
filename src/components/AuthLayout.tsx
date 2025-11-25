import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ImageCarousel from './ImageCarousel';
import { Sparkles } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitch = () => {
    setIsLogin(prev => !prev);
  };

  return (
    // Contenedor de página completa, sin límites ni bordes
    <div className="w-full h-screen overflow-hidden">
      
      {/* Grid de dos columnas: Formulario (1.2 partes) | Carrusel (1 parte) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] h-full">
        
        {/* Columna Izquierda: Formulario y Branding (TEMA CLARO) */}
        <div className="p-8 md:p-16 flex flex-col justify-between bg-white text-gray-900 shadow-2xl lg:shadow-none">
          
          {/* Branding/Logo */}
          <header className="flex flex-col items-center mb-8">
            <Sparkles className="w-10 h-10 text-primary mb-2" />
            <h1 className="text-3xl font-extrabold tracking-wider text-gray-900">
              Crece <span className="text-primary">Perú</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Acceso seguro a tu ecosistema.</p>
          </header>

          {/* Formulario - Contenedor de transición */}
          {/* AJUSTE CLAVE: items-start para alinear arriba, pt-12 para subirlo, overflow-y-auto para evitar desbordamiento vertical. */}
          <div className="flex-grow pt-12 pb-8 transition-opacity duration-300 flex justify-center overflow-y-auto"> 
            {isLogin ? (
              <LoginForm onSwitch={handleSwitch} />
            ) : (
              <RegisterForm onSwitch={handleSwitch} />
            )}
          </div>
          
          {/* Subtle Footer */}
          <footer className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
            &copy; 2025 Bolt Systems. Todos los derechos reservados.
          </footer>
        </div>

        {/* Columna Derecha: Carrusel de Imágenes (Solo visible en pantallas grandes) */}
        <ImageCarousel />
      </div>
    </div>
  );
};

export default AuthLayout;
