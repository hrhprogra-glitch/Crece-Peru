import React, { useState, useEffect } from 'react';
import { PlayCircle, Clock, BarChart, Briefcase, Lock, Unlock, Award, CheckCircle, Zap } from 'lucide-react';
import { courses } from '../data/courses';
import type { Course } from '../data/courses'; 

interface CoursesModuleProps {
    unlockedCourseIds: string[];
    courseToAnimate: string | null;
    totalMonedas?: number;
    onBuyCourse?: (courseId: string, cost: number) => boolean;
}

// Componente para renderizar la tarjeta de curso individual
const CourseCard: React.FC<{ 
    course: Course, 
    isUnlocked: boolean, 
    shouldAnimate: boolean,
    onBuy: () => void
}> = ({ course, isUnlocked, shouldAnimate, onBuy }) => {
    
    const [isAnimating, setIsAnimating] = useState(false);

    // Control de la animación de desbloqueo
    useEffect(() => {
        if (shouldAnimate && isUnlocked) {
            setIsAnimating(true);
            
            // Temporizador automático (fallback)
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [shouldAnimate, isUnlocked]);

    // Clases base de la tarjeta
    const cardBaseClasses = 'group bg-slate-800/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col relative transition-all duration-500';
    
    const stateClasses = isUnlocked 
        ? 'hover:scale-[1.02] hover:border-blue-500/50 hover:shadow-blue-500/20' 
        : 'grayscale opacity-70';

    return (
        <div key={course.id} className={`${cardBaseClasses} ${stateClasses}`}>
            
            {/* 1. OVERLAY DE ANIMACIÓN (ÉXITO) - AHORA CON CLICK PARA CERRAR */}
            {isAnimating && (
                <div 
                    onClick={() => setIsAnimating(false)} // <--- EVENTO DE CLIC AGREGADO
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-emerald-900/95 animate-in fade-in zoom-in duration-500 cursor-pointer"
                    title="Haz clic para acceder"
                >
                    <div className="bg-emerald-500/20 p-6 rounded-full mb-4 animate-bounce">
                        <Unlock className="w-16 h-16 text-emerald-300" />
                    </div>
                    <span className="text-2xl font-extrabold text-white text-center px-4">
                        ¡CURSO DESBLOQUEADO!
                    </span>
                    <span className="text-emerald-200 text-sm mt-2 font-semibold animate-pulse">
                        (Clic para acceder ya)
                    </span>
                </div>
            )}

            {/* 2. OVERLAY DE BLOQUEO - PERMANENTE (Si no está desbloqueado) */}
            {!isUnlocked && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-[2px] transition-all duration-300 group-hover:bg-slate-950/50">
                    <Lock className="w-12 h-12 text-red-500 mb-3 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    <span className="text-xl font-bold text-white drop-shadow-md">BLOQUEADO</span>
                    <div className="mt-4 flex flex-col gap-2 w-3/4">
                        <button 
                            onClick={onBuy}
                            className="bg-yellow-600 hover:bg-yellow-500 text-white py-2 px-4 rounded-lg font-bold text-sm shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            Desbloquear (50 <span className="text-yellow-200">$</span>)
                        </button>
                    </div>
                </div>
            )}
            
            {/* --- CONTENIDO DE LA TARJETA --- */}
            
            {/* Imagen */}
            <div className="relative h-48 overflow-hidden shrink-0">
              <img 
                src={course.imageUrl} 
                alt={course.title} 
                className={`w-full h-full object-cover transition-transform duration-700 ${isUnlocked ? 'group-hover:scale-110' : ''}`} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
              
              <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border border-white/20 shadow-sm ${
                course.difficulty === 'Básico' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
              }`}>
                {course.difficulty}
              </span>

              <div className="absolute bottom-2 left-4 flex gap-2">
                 {course.relatedCareers.slice(0, 1).map((career, idx) => (
                    <span key={idx} className="flex items-center gap-1 bg-blue-600/80 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded uppercase tracking-wide font-bold shadow-sm">
                        <Briefcase className="w-3 h-3" /> {career}
                    </span>
                 ))}
              </div>
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col flex-1 relative z-10 bg-slate-900/20">
              <h3 className={`text-xl font-bold mb-2 line-clamp-1 ${isUnlocked ? 'text-white group-hover:text-blue-400' : 'text-gray-400'}`}>
                  {course.title}
              </h3>
              <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-1">
                  Aprende las fundamentos y técnicas avanzadas para dominar esta habilidad en el mercado laboral.
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-6 border-t border-white/5 pt-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> 2h 15m
                </div>
                <div className="flex items-center gap-1">
                  <BarChart className="w-4 h-4" /> +1.2k alumnos
                </div>
              </div>

              {/* Botón de Acción Principal */}
              <button 
                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    isUnlocked 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 hover:shadow-blue-500/40'
                    : 'bg-slate-700/30 text-gray-500 cursor-not-allowed border border-white/5'
                }`}
                disabled={!isUnlocked}
                onClick={() => isUnlocked && console.log(`Iniciando curso: ${course.title}`)}
              >
                {isUnlocked ? <PlayCircle className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                {isUnlocked ? 'Empezar Curso' : 'Bloqueado'}
              </button>
            </div>
        </div>
    );
}


const CoursesModule: React.FC<CoursesModuleProps> = ({ unlockedCourseIds, courseToAnimate, totalMonedas = 0, onBuyCourse }) => {
  
  const handleBuyClick = (courseId: string) => {
      if (onBuyCourse) {
          onBuyCourse(courseId, 50); 
      }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 pb-20">
      
      {/* Header de la Sección */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 animate-fade-in-down">
        <div>
          <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            Catálogo de Habilidades 
            <Award className="w-8 h-8 text-yellow-400 drop-shadow-lg"/>
          </h2>
          <p className="text-gray-400 text-lg">
              Desbloquea cursos usando tus recompensas o monedas.
          </p>
        </div>
        
        {/* Indicador de Monedas en el Header */}
        <div className="flex items-center gap-4">
            <div className="bg-slate-800 border border-yellow-500/30 px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-slate-900 font-bold text-xs">$</div>
                <span className="text-xl font-bold text-yellow-400">{totalMonedas}</span>
            </div>
            
            <div className="hidden md:block">
                <select className="bg-slate-800 text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-slate-700 transition-colors">
                    <option>Todos los niveles</option>
                    <option>Principiante</option>
                    <option>Avanzado</option>
                </select>
            </div>
        </div>
      </div>

      {/* Grid de Cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.filter(c => c.status === 'available').map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isUnlocked={unlockedCourseIds.includes(course.id)}
            shouldAnimate={course.id === courseToAnimate}
            onBuy={() => handleBuyClick(course.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CoursesModule;