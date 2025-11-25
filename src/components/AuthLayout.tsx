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
    // Contenedor de página completa, con altura mínima para móviles
    <div className="w-full min-h-screen overflow-hidden">
      
      {/* Grid: 
        - Móvil (por defecto): 1 columna (grid-cols-1)
        - Grande (lg): 2 columnas, donde el Formulario es 1.2fr y el Carrusel 1fr.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] min-h-screen">
        
        {/* Columna Izquierda: Formulario y Branding */}
        <div className="
          p-8 md:p-16 flex flex-col justify-between 
          bg-white text-gray-900 
          shadow-2xl lg:shadow-none 
          // Habilitar el scroll en móvil si el formulario es largo
          overflow-y-auto
        ">
          
          {/* Branding/Logo */}
          <header className="flex flex-col items-center mb-8">
            <Sparkles className="w-10 h-10 text-primary mb-2" />
            <h1 className="text-3xl font-extrabold tracking-wider text-gray-900">
              Crece <span className="text-primary">Perú</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Acceso seguro a tu ecosistema.</p>
          </header>

          {/* Formulario - Contenedor de transición */}
          <div className="flex-grow pt-4 pb-4 transition-opacity duration-300 flex justify-center"> 
            {isLogin ? (
              <LoginForm onSwitch={handleSwitch} />
            ) : (
              <RegisterForm onSwitch={handleSwitch} />
            )}
          </div>
          
          {/* Subtle Footer */}
          <footer className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500 flex-shrink-0">
            &copy; 2025 Bolt Systems. Todos los derechos reservados.
          </footer>
        </div>

        {/* Columna Derecha: Carrusel de Imágenes 
          CLAVE: 'hidden lg:block' para ocultarlo en móvil y mostrarlo en desktop
        */}
        <ImageCarousel />
      </div>
    </div>
  );
};

export default AuthLayout;