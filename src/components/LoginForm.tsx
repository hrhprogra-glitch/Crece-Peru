import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LoginFormProps {
  onSwitch: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitch }) => {
  const { login, finalizeAuth } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Intenta el login simulado
    const success = login(formData);

    if (success) {
      // 2. Muestra el mensaje de éxito
      setIsSuccess(true);
      
      // 3. Espera 1 segundo y luego finaliza la autenticación (dispara la redirección)
      setTimeout(() => {
        finalizeAuth();
      }, 1000); 
    } else {
      setError('Credenciales inválidas. Asegúrate de haberte registrado primero.');
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center transition-opacity duration-500">
        <CheckCircle className="w-16 h-16 text-success mb-6 animate-bounce" />
        <h2 className="text-4xl font-bold text-gray-900 mb-4">¡Inicio de Sesión Exitoso!</h2>
        <p className="text-gray-600 text-lg">Serás redirigido a tu panel en un momento...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Bienvenido de Nuevo</h2>
      <p className="text-gray-600 text-center mb-8">Ingresa tus credenciales para continuar.</p>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-error/10 border border-error text-error rounded-xl text-sm text-center">
          {error}
        </div>
      )}

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Correo Electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="tu@email.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary transition duration-200 bg-white text-gray-900"
          />
        </div>
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary transition duration-200 bg-white text-gray-900"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300 transform hover:scale-[1.01]"
      >
        Iniciar Sesión
        <ArrowRight className="w-5 h-5 ml-2" />
      </button>

      {/* Switch to Register */}
      <p className="text-center text-sm text-gray-600 mt-4">
        ¿No tienes una cuenta?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-secondary hover:text-secondary/80 transition duration-200"
        >
          Regístrate Aquí
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
