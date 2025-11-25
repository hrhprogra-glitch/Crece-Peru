import React from 'react';
import { Gamepad2, BarChart3, BookOpen, Lock, GraduationCap, LayoutGrid } from 'lucide-react';

interface GameHeaderProps {
  onReturnToMenu: () => void;
  isUnlocked?: boolean;
  activeSection: 'game' | 'progress' | 'courses';
  onNavigate: (section: 'game' | 'progress' | 'courses') => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  onReturnToMenu, 
  isUnlocked = false,
  activeSection,
  onNavigate
}) => {
  
  const navItems = [
    { id: 'game', name: 'Juego', icon: Gamepad2 },
    { id: 'progress', name: 'Progreso', icon: BarChart3 },
    { id: 'courses', name: 'Cursos', icon: BookOpen },
  ];

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-xl border-b border-white/10 h-20 flex items-center justify-between px-4 md:px-8 transition-all duration-300 z-50 shadow-lg shadow-blue-900/20">
      
      {/* LOGO */}
      <div className="flex items-center gap-2 cursor-pointer group" onClick={onReturnToMenu}>
        <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-purple-500/30">
          <GraduationCap className="text-white w-6 h-6" />
        </div>
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-white leading-none tracking-tight">Crece<span className="text-blue-400">+Perú</span></h1>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex items-center bg-slate-800/50 p-1 rounded-full border border-white/5">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button 
              key={item.id}
              className={`
                relative flex items-center gap-2 px-4 md:px-6 py-2 rounded-full transition-all duration-300
                ${!isUnlocked ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
                ${isActive && isUnlocked ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}
              `}
              onClick={isUnlocked ? () => onNavigate(item.id as any) : undefined}
              disabled={!isUnlocked}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="hidden md:block text-sm font-semibold">{item.name}</span>
              
              {!isUnlocked && (
                <div className="absolute -top-1 -right-1 bg-slate-900 rounded-full p-0.5 border border-red-500/50">
                  <Lock className="w-3 h-3 text-red-400" />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* EXTRAS */}
      <div className="p-2 rounded-full border border-white/10 bg-slate-800/50 text-gray-400">
        <LayoutGrid className="w-5 h-5" />
      </div>
    </header>
  );
};

export default GameHeader;