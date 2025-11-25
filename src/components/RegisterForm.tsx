import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Briefcase, CheckCircle } from 'lucide-react';
import { CAREERS } from '../constants/careers';
import { useAuth } from '../context/AuthContext'; 

interface RegisterFormProps {
  onSwitch: () => void;
}

// Definimos la interfaz de datos que se envían al contexto
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  career: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitch }) => {
  // Usamos register y finalizeAuth
  const { register, finalizeAuth } = useAuth(); 
  const [isSuccess, setIsSuccess] = useState(false); // Nuevo estado para el mensaje de éxito
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    career: CAREERS[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Registra los datos (incluyendo la contraseña)
    const success = register(formData);
    
    if (success) {
      // --- MODIFICACIÓN: Guardar datos en localStorage ---
      // Esto permite que WelcomePage lea estos datos inmediatamente después del login
      localStorage.setItem('user_name', formData.name);
      localStorage.setItem('user_email', formData.email);
      localStorage.setItem('user_career', formData.career);
      // --------------------------------------------------

      // 2. Muestra el mensaje de éxito
      setIsSuccess(true);
      
      // 3. Espera 2 segundos y luego finaliza la autenticación (lo que dispara la redirección)
      setTimeout(() => {
        finalizeAuth();
      }, 2000); 
    }
  };

  // Renderiza el mensaje de éxito si el registro fue exitoso
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center transition-opacity duration-500">
        <CheckCircle className="w-16 h-16 text-green-500 mb-6 animate-bounce" />
        <h2 className="text-4xl font-bold text-gray-900 mb-4">¡Cuenta Creada Exitosamente!</h2>
        <p className="text-gray-600 text-lg">Bienvenido, {formData.name}.</p>
        <p className="text-gray-500 text-sm mt-2">Serás redirigido a tu panel en un momento...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Crea tu Cuenta</h2>
      <p className="text-gray-600 text-center mb-8">Únete a nuestra plataforma en segundos.</p>

      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre Completo
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Tu Nombre"
            value={formData.name}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary transition duration-200 bg-white text-gray-900"
          />
        </div>
      </div>

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
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary transition duration-200 bg-white text-gray-900"
          />
        </div>
      </div>
      
      {/* Career Selection */}
      <div>
        <label htmlFor="career" className="block text-sm font-medium text-gray-700 mb-1">
          Carrera de Interés
        </label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <select
            id="career"
            name="career"
            required
            value={formData.career}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-primary focus:border-primary transition duration-200 bg-white text-gray-900 appearance-none"
          >
            {CAREERS.map((career) => (
              <option key={career} value={career}>
                {career}
              </option>
            ))}
          </select>
          {/* Custom arrow for select */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition duration-300 transform hover:scale-[1.01]"
      >
        Registrarse
        <ArrowRight className="w-5 h-5 ml-2" />
      </button>

      {/* Switch to Login */}
      <p className="text-center text-sm text-gray-600 mt-4">
        ¿Ya tienes una cuenta?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-primary hover:text-primary/80 transition duration-200"
        >
          Inicia Sesión
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;