import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Trophy, Brain, RotateCcw, Package, Star, CheckCircle, ShoppingBag, Lock, XCircle } from 'lucide-react';
import { getQuestions, Difficulty, Question } from '../data/questionBank';
import { courses } from '../data/courses'; 

interface GameModuleProps {
// ... (resto de la interfaz GameModuleProps)
  career: string;
  onClose: () => void;
  onOpenRoulette: (difficulty: Difficulty, prizeClaimedHandler: (prize: string) => void) => void;
  onScoreUpdateTrigger: () => void;
  totalMonedas: number;
  unlockedCourseIds: string[];
  onBuyCourse: (courseId: string, cost: number) => boolean;
}

const CHEST_KEY_EASY = 'easy_chest_unlocked';
const CHEST_KEY_MEDIUM = 'medium_chest_unlocked';
const CHEST_KEY_HARD = 'hard_chest_unlocked';
const CHEST_CLAIMED_KEY_EASY = 'easy_chest_claimed';
const CHEST_CLAIMED_KEY_MEDIUM = 'medium_chest_claimed';
const CHEST_CLAIMED_KEY_HARD = 'hard_chest_claimed';

const getHighScoreKey = (diff: Difficulty, career: string) =>
  `high_score_${diff}_${career.replace(/\s/g, '_')}`;

// --- Sidebar Component (Diseño Unificado y Bloqueo Estricto) ---
const RewardsSidebar: React.FC<{ 
  easyChestUnlocked: boolean;
  mediumChestUnlocked: boolean;
  hardChestUnlocked: boolean;
  easyChestClaimed: boolean; 
  mediumChestClaimed: boolean;
  hardChestClaimed: boolean;
  onChestClick: (difficulty: Difficulty) => void; 
}> = ({ easyChestUnlocked, mediumChestUnlocked, hardChestUnlocked, easyChestClaimed, mediumChestClaimed, hardChestClaimed, onChestClick }) => {
  
  // Configuración de los 3 cofres
  const chests = [
    { 
        key: 'EASY', 
        name: 'Cofre Nivel Fácil', 
        unlocked: easyChestUnlocked, 
        claimed: easyChestClaimed, 
        difficulty: 'Fácil' as Difficulty, 
        color: 'text-green-400',
        border: 'border-green-500/50'
    },
    { 
        key: 'MEDIUM', 
        name: 'Cofre Nivel Intermedio', 
        unlocked: mediumChestUnlocked, 
        claimed: mediumChestClaimed, 
        difficulty: 'Intermedio' as Difficulty, 
        color: 'text-yellow-400',
        border: 'border-yellow-500/50'
    },
    { 
        key: 'HARD', 
        name: 'Cofre Nivel Difícil', 
        unlocked: hardChestUnlocked, 
        claimed: hardChestClaimed, 
        difficulty: 'Difícil' as Difficulty, 
        color: 'text-red-400',
        border: 'border-red-500/50'
    },
  ];

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-white/10 p-6 rounded-3xl shadow-2xl w-full h-fit">
      <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">Recompensas</span>
      </h3>
      
      <div className="space-y-4">
        {chests.map(chest => {
          const isLocked = !chest.unlocked;
          const isClaimed = chest.claimed;
          // Solo se puede hacer clic si está desbloqueado Y NO ha sido reclamado
          const canClick = !isLocked && !isClaimed;

          return (
            <button
              key={chest.key}
              onClick={() => canClick && onChestClick(chest.difficulty)}
              disabled={!canClick}
              className={`relative w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all duration-300 text-left group
                ${isClaimed 
                    ? 'bg-slate-900/80 border-slate-700 opacity-50 cursor-not-allowed grayscale' // Estilo Reclamado (Apagado)
                    : isLocked
                        ? 'bg-slate-900/40 border-white/5 opacity-60 cursor-not-allowed' // Estilo Bloqueado
                        : `bg-slate-800 hover:bg-slate-700 ${chest.border} hover:shadow-lg cursor-pointer hover:scale-[1.02]` // Estilo Disponible
                }
              `}
            >
              {/* Icono del Cofre */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors
                  ${isClaimed ? 'bg-slate-700' : isLocked ? 'bg-gray-800' : 'bg-slate-900 border border-white/20'}`}>
                
                {isClaimed ? (
                    <CheckCircle className="w-6 h-6 text-green-500" /> 
                ) : isLocked ? (
                    <Lock className="w-5 h-5 text-gray-500" />
                ) : (
                    <Package className={`w-6 h-6 ${chest.unlocked ? 'text-white animate-bounce-slow' : 'text-gray-400'}`} /> 
                )}
              </div>
              
              <div className="flex-grow">
                <h4 className={`font-bold text-lg ${isClaimed ? 'text-gray-500 line-through decoration-2' : chest.color}`}>
                    {chest.name}
                </h4>
                <div className="text-xs font-medium mt-1">
                    {isClaimed ? (
                        <span className="text-green-500 flex items-center gap-1">✔ ¡RECLAMADO!</span>
                    ) : isLocked ? (
                        <span className="text-gray-500">Completa el nivel (100 pts)</span>
                    ) : (
                        <span className="text-white animate-pulse">¡Clic para abrir!</span>
                    )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const GameModule: React.FC<GameModuleProps> = ({ 
    career, 
    onClose, 
    onOpenRoulette, 
    onScoreUpdateTrigger,
    totalMonedas,
    unlockedCourseIds,
    onBuyCourse
}) => {
  const [gameState, setGameState] = useState<'MENU' | 'PLAYING' | 'FINISHED'>('MENU');
  const [difficulty, setDifficulty] = useState<Difficulty>('Fácil');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // --- ESTADOS DE PERSISTENCIA (Cofres) ---
  const [easyChestUnlocked, setEasyChestUnlocked] = useState(localStorage.getItem(CHEST_KEY_EASY) === 'true');
  const [mediumChestUnlocked, setMediumChestUnlocked] = useState(localStorage.getItem(CHEST_KEY_MEDIUM) === 'true');
  const [hardChestUnlocked, setHardChestUnlocked] = useState(localStorage.getItem(CHEST_KEY_HARD) === 'true');
  
  const [easyChestClaimed, setEasyChestClaimed] = useState(localStorage.getItem(CHEST_CLAIMED_KEY_EASY) === 'true');
  const [mediumChestClaimed, setMediumChestClaimed] = useState(localStorage.getItem(CHEST_CLAIMED_KEY_MEDIUM) === 'true');
  const [hardChestClaimed, setHardChestClaimed] = useState(localStorage.getItem(CHEST_CLAIMED_KEY_HARD) === 'true');

  // --- REFERENCIA PARA SABER QUÉ COFRE SE ESTÁ ABRIENDO ---
  // Esto soluciona el bug de que se vuelva a abrir o no se marque el correcto.
  const activeChestRef = useRef<Difficulty | null>(null);

  const [highScores, setHighScores] = useState<Record<Difficulty, number>>({
    'Fácil': 0, 'Intermedio': 0, 'Difícil': 0,
  });

  useEffect(() => {
    const scores: Record<Difficulty, number> = {
      'Fácil': parseInt(localStorage.getItem(getHighScoreKey('Fácil', career)) || '0'),
      'Intermedio': parseInt(localStorage.getItem(getHighScoreKey('Intermedio', career)) || '0'),
      'Difícil': parseInt(localStorage.getItem(getHighScoreKey('Difícil', career)) || '0'),
    };
    setHighScores(scores);
  }, [career]);

  // --- LÓGICA DE RECOMENDACIÓN DE CURSOS ---
  const recommendedCourses = useMemo(() => {
      if (gameState !== 'FINISHED') return [];
      const related = courses.filter(c => {
          return c.relatedCareers.some(rc => 
              career.toLowerCase().includes(rc.toLowerCase()) || 
              rc.toLowerCase().includes(career.split(' ')[0].toLowerCase())
          );
      });
      const pool = related.length >= 3 ? related : courses;
      return pool.sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [gameState, career]);

  const getDifficultyColor = useCallback((diff: Difficulty) => {
    switch(diff) {
      case 'Fácil': return 'from-green-400 to-emerald-600';
      case 'Intermedio': return 'from-yellow-400 to-orange-500';
      case 'Difícil': return 'from-red-500 to-rose-700';
      default: return 'from-gray-400 to-gray-600';
    }
  }, []);

  const resetTimer = useCallback(() => {
    setTimeLeft(10);
    setIsAnswered(false);
    setSelectedOption(null);
  }, []);

  const startGame = useCallback((diff: Difficulty) => {
    const qs = getQuestions(career, diff);
    setDifficulty(diff);
    setQuestions(qs);
    setCurrentIndex(0);
    setScore(0);
    setGameState('PLAYING');
    resetTimer();
  }, [career, resetTimer]);

  useEffect(() => {
    if (gameState !== 'PLAYING' || isAnswered) return;
    if (timeLeft <= 0) {
      setTimeout(() => handleAnswer(null), 0); 
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameState, isAnswered]);

  const handleAnswer = useCallback((option: string | null) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(option);
    const currentQ = questions[currentIndex];
    const isCorrect = currentQ && option === currentQ.correctAnswer;
    if (isCorrect) setScore(s => s + 20);
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
        resetTimer();
      } else setGameState('FINISHED');
    }, 1500);
  }, [isAnswered, currentIndex, questions, resetTimer]);

  // Verificar High Score y Desbloqueo al terminar
  useEffect(() => {
    if (gameState === 'FINISHED') {
      // Desbloquear cofres si Score es 100
      if (score === 100) {
        if (difficulty === 'Fácil' && !easyChestUnlocked) { 
            setEasyChestUnlocked(true); localStorage.setItem(CHEST_KEY_EASY, 'true'); 
        }
        if (difficulty === 'Intermedio' && !mediumChestUnlocked) { 
            setMediumChestUnlocked(true); localStorage.setItem(CHEST_KEY_MEDIUM, 'true'); 
        }
        if (difficulty === 'Difícil' && !hardChestUnlocked) { 
            setHardChestUnlocked(true); localStorage.setItem(CHEST_KEY_HARD, 'true'); 
        }
      }
      
      const currentHighScore = highScores[difficulty];
      if (score > currentHighScore) {
        const key = getHighScoreKey(difficulty, career);
        localStorage.setItem(key, score.toString());
        setHighScores(prev => ({ ...prev, [difficulty]: score }));
        if (onScoreUpdateTrigger) onScoreUpdateTrigger();
      }
    }
  }, [gameState, score, difficulty, easyChestUnlocked, mediumChestUnlocked, hardChestUnlocked, highScores, career, onScoreUpdateTrigger]);

  // --- CALLBACK: SE EJECUTA CUANDO LA RULETA TERMINA ---
  // Aquí marcamos el cofre como reclamado basándonos en la referencia guardada
  const handlePrizeClaimedInGameModule = useCallback((prize: string) => {
    const chestToClaim = activeChestRef.current; // Recuperamos qué cofre se abrió

    if (chestToClaim === 'Fácil') { 
        setEasyChestClaimed(true); 
        localStorage.setItem(CHEST_CLAIMED_KEY_EASY, 'true'); 
    }
    else if (chestToClaim === 'Intermedio') { 
        setMediumChestClaimed(true); 
        localStorage.setItem(CHEST_CLAIMED_KEY_MEDIUM, 'true'); 
    }
    else if (chestToClaim === 'Difícil') { 
        setHardChestClaimed(true); 
        localStorage.setItem(CHEST_CLAIMED_KEY_HARD, 'true'); 
    }
    
    // Resetear referencia
    activeChestRef.current = null;
  }, []);

  // --- CLICK EN EL COFRE ---
  const handleChestClick = useCallback((difficulty: Difficulty) => {
    // Validar si ya está reclamado antes de hacer nada
    if (difficulty === 'Fácil' && easyChestClaimed) return;
    if (difficulty === 'Intermedio' && mediumChestClaimed) return;
    if (difficulty === 'Difícil' && hardChestClaimed) return;

    // Guardar qué cofre se está abriendo
    activeChestRef.current = difficulty;

    // Abrir ruleta
    onOpenRoulette(difficulty, handlePrizeClaimedInGameModule);
    
  }, [easyChestClaimed, mediumChestClaimed, hardChestClaimed, onOpenRoulette, handlePrizeClaimedInGameModule]);

  const returnToMenu = useCallback(() => {
    setGameState('MENU');
    resetTimer();
  }, [resetTimer]);

  // ================= RENDERIZADO =================
  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 pt-4 relative animate-fade-in-up w-full">
        
        <div className="w-full max-w-screen-2xl flex-grow flex flex-col items-center mt-12">
            
            {gameState === 'MENU' && (
                <div className="grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-10 w-full">
                    {/* Selector de Dificultad */}
                    <div className="lg:col-span-1">
                        <div className="text-center mb-12">
                            <div className="inline-block p-4 rounded-full bg-purple-600/20 border-2 border-purple-500/50 backdrop-blur-sm mb-6 shadow-xl">
                                <Brain className="w-16 h-16 text-purple-400 animate-pulse-slow" /> 
                            </div>
                            <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-400">Desafío</span> de Conocimiento
                            </h2>
                            <p className="text-xl text-gray-300">
                                Demuestra lo que sabes sobre <span className="text-purple-400 font-bold">{career}</span>
                            </p> 
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                            {(['Fácil', 'Intermedio', 'Difícil'] as Difficulty[]).map((diff) => (
                                <button
                                    key={diff}
                                    onClick={() => startGame(diff)}
                                    className="group relative overflow-hidden rounded-3xl p-0.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
                                >
                                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${getDifficultyColor(diff)} opacity-60 group-hover:opacity-100 transition-opacity duration-300 blur-sm`}></div>
                                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${getDifficultyColor(diff)} opacity-30 group-hover:opacity-70 transition-opacity duration-300`}></div>
                                    <div className="relative h-full bg-slate-900/90 backdrop-blur-xl p-8 rounded-[29px] border border-white/5 flex flex-col items-center justify-center gap-3 group-hover:bg-slate-900/60 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Star className="w-5 h-5 text-yellow-400" />
                                                <h3 className="text-2xl font-extrabold text-white">{diff}</h3>
                                            </div>
                                            <p className="text-xs text-gray-400 group-hover:text-white/90">5 Preguntas | 10s</p>
                                            <div className="mt-3 p-2 px-4 rounded-full bg-white/10 text-sm font-semibold text-yellow-300 flex items-center gap-2">
                                                <Trophy className="w-4 h-4 text-yellow-400" />
                                                {highScores[diff]} / 100
                                            </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Sidebar de Recompensas */}
                    <div className="lg:col-span-1 flex justify-center lg:justify-start">
                        <RewardsSidebar 
                            easyChestUnlocked={easyChestUnlocked} 
                            mediumChestUnlocked={mediumChestUnlocked}
                            hardChestUnlocked={hardChestUnlocked}
                            easyChestClaimed={easyChestClaimed}
                            mediumChestClaimed={mediumChestClaimed}
                            hardChestClaimed={hardChestClaimed}
                            onChestClick={handleChestClick}
                        />
                    </div>
                </div>
            )}

            {/* --- VISTA: JUGANDO --- */}
            {gameState === 'PLAYING' && (
                <div className="w-full max-w-4xl animate-fade-in-up">
                    <div className="flex justify-between items-center mb-8 bg-slate-800/40 p-4 rounded-xl border border-white/10 backdrop-blur-md shadow-lg">
                        <div className="flex items-center gap-6">
                            <span className={`px-4 py-1 rounded-full text-xs uppercase font-bold text-white shadow-md bg-gradient-to-r ${getDifficultyColor(difficulty)}`}>
                                {difficulty}
                            </span>
                            <span className="text-gray-300 text-sm font-mono flex items-center gap-2">
                                <Star className="w-4 h-4 text-purple-400" />
                                {currentIndex + 1} / {questions.length}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-yellow-400 font-extrabold text-3xl">
                            <Trophy className="w-7 h-7" />
                            <span>{score}</span>
                        </div>
                    </div>

                    <div className="w-full h-4 bg-gray-700/50 rounded-full mb-12 overflow-hidden relative shadow-inner">
                        <div 
                            className={`h-full transition-all duration-1000 ease-linear rounded-full ${timeLeft < 4 ? 'bg-gradient-to-r from-red-600 to-rose-700' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`}
                            style={{ width: `${(timeLeft / 10) * 100}%` }}
                        ></div>
                    </div>

                    <div className="bg-slate-900/60 border border-purple-500/20 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
                        <h3 className="text-2xl md:text-4xl font-extrabold text-white mb-10 text-center leading-tight">
                            {questions[currentIndex]?.text}
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {questions[currentIndex]?.options.map((option, idx) => {
                                let btnClass = "bg-slate-800/50 border-white/10 hover:border-purple-400/50 hover:bg-slate-700/80 text-white";
                                let icon = null;
                                if (isAnswered) {
                                    if (option === questions[currentIndex].correctAnswer) {
                                        btnClass = "bg-green-600/30 border-green-500/50 text-green-300 shadow-md"; 
                                        icon = <CheckCircle className="w-6 h-6 text-green-400" />;
                                    } else if (option === selectedOption) {
                                        btnClass = "bg-red-600/30 border-red-500/50 text-red-300 shadow-md";
                                        icon = <XCircle className="w-6 h-6 text-red-400" />; // Línea 408
                                    } else {
                                        btnClass = "bg-slate-800/30 border-white/5 opacity-50";
                                    }
                                }
                                return (
                                    <button
                                        key={idx}
                                        disabled={isAnswered}
                                        onClick={() => handleAnswer(option)}
                                        className={`relative w-full p-4 rounded-xl border text-left text-lg md:text-xl font-semibold transition-all duration-300 flex items-center justify-between group ${btnClass}`}
                                    >
                                        <span className="flex items-center gap-4">
                                            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-extrabold flex-shrink-0">
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            {option}
                                        </span>
                                        {icon}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* --- VISTA: FINALIZADO --- */}
            {gameState === 'FINISHED' && (
                <div className="grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-10 w-full animate-fade-in-up">
                    <div className="flex flex-col items-center">
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden max-w-xl w-full text-center mb-8">
                            <h2 className="text-5xl font-extrabold text-white mb-3 tracking-tighter">
                                {score === 100 ? '¡Dominio Absoluto!' : '¡Buen intento!'}
                            </h2>
                            <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-8">
                                {score}<span className="text-4xl text-gray-500 font-medium ml-1">/100</span>
                            </div>
                            <button onClick={returnToMenu} className="mx-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-2 transition-all mb-6">
                                <RotateCcw className="w-5 h-5" /> Nuevo Desafío
                            </button>
                        </div>

                        {/* Recomendaciones */}
                        <div className="w-full max-w-3xl">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <ShoppingBag className="w-6 h-6 text-blue-400" />
                                    Cursos Sugeridos
                                </h3>
                                <span className="text-yellow-400 font-bold bg-slate-800 px-3 py-1 rounded-lg border border-yellow-500/30">
                                    Tus Monedas: {totalMonedas}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {recommendedCourses.map(course => {
                                    const isUnlocked = unlockedCourseIds.includes(course.id);
                                    const canAfford = totalMonedas >= 50;

                                    return (
                                        <div key={course.id} className="bg-slate-800 border border-white/10 rounded-xl p-4 flex flex-col shadow-lg hover:border-blue-500/30 transition-all">
                                            <div className="h-24 rounded-lg overflow-hidden mb-3 relative">
                                                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                                                {isUnlocked && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                        <CheckCircle className="w-8 h-8 text-green-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="text-white font-bold text-sm line-clamp-2 mb-2 h-10">{course.title}</h4>
                                            <p className="text-xs text-gray-400 mb-3">{course.difficulty}</p>
                                            
                                            <button 
                                                onClick={() => !isUnlocked && onBuyCourse(course.id, 50)}
                                                disabled={isUnlocked || !canAfford}
                                                className={`mt-auto py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors
                                                    ${isUnlocked 
                                                        ? 'bg-green-600/20 text-green-400 cursor-default' 
                                                        : canAfford 
                                                            ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                                                            : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                                                    }
                                                `}
                                            >
                                                {isUnlocked 
                                                    ? 'Adquirido' 
                                                    : canAfford 
                                                        ? <>Desbloquear (50 <span className="text-yellow-300">$</span>)</>
                                                        : <>Insuficiente (50 <span className="text-yellow-300">$</span>)</>
                                                }
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    
                    {/* Sidebar en Vista Finalizado */}
                    <div className="lg:col-span-1 flex justify-center lg:justify-start h-fit">
                        <RewardsSidebar 
                            easyChestUnlocked={easyChestUnlocked} 
                            mediumChestUnlocked={mediumChestUnlocked}
                            hardChestUnlocked={hardChestUnlocked}
                            easyChestClaimed={easyChestClaimed}
                            mediumChestClaimed={mediumChestClaimed}
                            hardChestClaimed={hardChestClaimed}
                            onChestClick={handleChestClick}
                        />
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default GameModule;