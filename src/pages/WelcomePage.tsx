import React, { useEffect, useState, useRef, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { courses } from '../data/courses'; 
import type { Course } from '../data/courses';
import { Sparkles, Zap, LogOut, Play, Bot, X, Send, MessageSquare, Gamepad2, ArrowRight, Unlock, Gift } from 'lucide-react';
import GameModule from '../components/GameModule';
import PrizeRoulette from '../components/PrizeRoulette';
import GameHeader from '../components/GameHeader'; 
import ProgressModule from '../components/ProgressModule';
import CoursesModule from '../components/CoursesModule';

interface UserProps {
  nombre: string;
  email: string;
  carrera: string;
}

interface WelcomePageProps {
  user?: UserProps;
}

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  isCourseRecommendation?: boolean;
  courseData?: Course;
  aiReason?: string;
}

// Componente auxiliar para formatear texto con negritas
const FormattedText = ({ text }: { text: string }) => {
  if (!text) return null;
  const parts = text.split('**');
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? <strong key={index} className="text-blue-300 font-bold">{part}</strong> : part
      )}
    </>
  );
};

const getHighScoreKey = (diff: string, career: string) =>
  `high_score_${diff}_${career.replace(/\s/g, '_')}`;
const DIFFICULTIES = ['Fácil', 'Intermedio', 'Difícil'];

const WelcomePage: React.FC<WelcomePageProps> = ({ user: externalUser }) => {
  
  // LÓGICA DE USUARIO
  const storedName = localStorage.getItem('user_name');
  const storedEmail = localStorage.getItem('user_email');
  const storedCareer = localStorage.getItem('user_career');

  const user = { 
    nombre: storedName || externalUser?.nombre || "Estudiante",
    email: storedEmail || externalUser?.email || "demo@creceperu.com",
    carrera: storedCareer || externalUser?.carrera || "Ingeniería de Sistemas"
  };

  const isAuthenticated = true;
  
  const logout = () => {
    localStorage.clear(); 
    window.location.href = '/login'; 
  };

  const API_KEY = 'AIzaSyBZBRnj4bsve294i-obsTEWvZHMvv0SCSk'; 

  // Estados de Animación Intro
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [showThirdLine, setShowThirdLine] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [showBot, setShowBot] = useState(false); 
  const [isBotActive, setIsBotActive] = useState(false);
  const [showFinalText, setShowFinalText] = useState(false);
  const [botMoveToCorner, setBotMoveToCorner] = useState(false);
  const [showGameIntro, setShowGameIntro] = useState(false);
  const [showGameButton, setShowGameButton] = useState(false);
  
  // Estados de Navegación y Juego
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMenuUnlocked, setIsMenuUnlocked] = useState(false);
  const [currentSection, setCurrentSection] = useState<'game' | 'progress' | 'courses'>('game');
  const [scoreUpdateTrigger, setScoreUpdateTrigger] = useState(0); 

  // Cursos y Monedas
  const [unlockedCourseIds, setUnlockedCourseIds] = useState<string[]>(() => {
    return Object.keys(localStorage)
      .filter(key => key.startsWith('unlocked_course_'))
      .map(key => key.replace('unlocked_course_', ''));
  });
  const [courseToAnimate, setCourseToAnimate] = useState<string | null>(null);
  const [totalMonedas, setTotalMonedas] = useState(parseInt(localStorage.getItem('user_monedas') || '0', 10));

  // Modales
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [rewardModalContent, setRewardModalContent] = useState<{ title: string, courseId: string | null, currency: number }>({ title: '', courseId: null, currency: 0 });
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [rouletteDifficulty, setRouletteDifficulty] = useState<'Fácil' | 'Intermedio' | 'Difícil'>('Fácil');

  // --- ESTADOS DEL CHAT (Integrado) ---
  const [chatReady, setChatReady] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 1, 
      text: `¡Hola ${user.nombre}! 👋 Soy tu asistente laboral de Crece +Perú. Veo que estudias **${user.carrera}**. Estoy aquí para ayudarte a impulsar tu carrera profesional. ¿En qué te puedo apoyar hoy?`, 
      sender: 'bot' 
    }
  ]);

  // Referencia al FINAL de la lista de mensajes para el scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- EFECTOS ---

  useEffect(() => {
    const timer1 = setTimeout(() => setShowSecondLine(true), 1500);
    const timer2 = setTimeout(() => setShowThirdLine(true), 3000);
    const timer3 = setTimeout(() => setShowStartButton(true), 4000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
  }, []);

  useEffect(() => {
    if (isStarted) {
      const botTimer = setTimeout(() => setShowBot(true), 2000);
      return () => clearTimeout(botTimer);
    }
  }, [isStarted]);

  useEffect(() => {
    if (isBotActive) {
      setShowFinalText(true);
      const readingTime = 4500;
      const fadeOutTimer = setTimeout(() => setShowFinalText(false), readingTime);
      const moveBotTimer = setTimeout(() => setBotMoveToCorner(true), readingTime + 1000);
      return () => { clearTimeout(fadeOutTimer); clearTimeout(moveBotTimer); };
    }
  }, [isBotActive]);

  useEffect(() => {
    if (botMoveToCorner) {
      const readyTimer = setTimeout(() => setChatReady(true), 1500);
      const gameTextTimer = setTimeout(() => setShowGameIntro(true), 2000);
      const gameBtnTimer = setTimeout(() => setShowGameButton(true), 3500);
      return () => { clearTimeout(readyTimer); clearTimeout(gameTextTimer); clearTimeout(gameBtnTimer); };
    }
  }, [botMoveToCorner]);

  // SCROLL AUTOMÁTICO AL ÚLTIMO MENSAJE
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen, isLoading]);
  
  useEffect(() => {
      if (currentSection === 'progress') {
          setScoreUpdateTrigger(prev => prev + 1);
      }
  }, [currentSection]);

  // --- FUNCIONES DE JUEGO/LÓGICA ---

  const getTotalAccumulatedScore = useCallback(() => {
    let totalScore = 0;
    for (const diff of DIFFICULTIES) {
      const key = getHighScoreKey(diff, user.carrera);
      const score = parseInt(localStorage.getItem(key) || '0', 10);
      totalScore += score;
    }
    return totalScore;
  }, [user.carrera]);

  const accumulatedScore = getTotalAccumulatedScore();

  const updateMonedas = (amount: number) => {
      setTotalMonedas(prev => {
          const newTotal = prev + amount;
          localStorage.setItem('user_monedas', newTotal.toString());
          return newTotal;
      });
  };

  const unlockCourseGlobally = (courseId: string) => {
      setUnlockedCourseIds(prev => {
          if (!prev.includes(courseId)) {
              localStorage.setItem(`unlocked_course_${courseId}`, 'true'); 
              return [...prev, courseId];
          }
          return prev;
      });
      setCourseToAnimate(courseId);
      setTimeout(() => setCourseToAnimate(null), 3000); 
  };

  const buyCourse = (courseId: string, cost: number): boolean => {
      if (totalMonedas >= cost) {
          updateMonedas(-cost);
          unlockCourseGlobally(courseId);
          if (currentSection !== 'courses') handleNavigate('courses'); 
          return true;
      }
      alert(`No tienes suficientes monedas. Necesitas ${cost} monedas y solo tienes ${totalMonedas}.`);
      return false;
  };

  const handleNavigate = (section: 'game' | 'progress' | 'courses') => {
    setCurrentSection(section);
    setCourseToAnimate(null);
  };
  
  const handleScoreUpdateTrigger = () => {
    setScoreUpdateTrigger(prev => prev + 1);
  };

  const handleStartGame = () => {
    setIsPlaying(true);
    setCurrentSection('game');
    if (!isMenuUnlocked) setIsMenuUnlocked(true);
    setScoreUpdateTrigger(prev => prev + 1); 
  };

  const handleCloseGame = () => setIsPlaying(false);
  const handleStart = () => setIsStarted(true);

  // --- RECOMPENSAS ---
  const handleProgressClaim = (rewardType: 'COINS' | 'COURSE', value: string) => {
      setTimeout(() => setIsRewardModalOpen(false), 2500);
      
      if (rewardType === 'COURSE') {
          const courseId = value;
          const courseData = courses.find(c => c.id === courseId);
          if (courseData) {
              unlockCourseGlobally(courseId);
              setRewardModalContent({ title: `¡Curso Desbloqueado!`, courseId: courseId, currency: 0 });
              setIsRewardModalOpen(true);
          }
      } else if (rewardType === 'COINS') {
          const amount = 200; 
          updateMonedas(amount);
          setRewardModalContent({ title: `¡Ganaste Monedas!`, courseId: null, currency: amount });
          setIsRewardModalOpen(true);
      }
      setScoreUpdateTrigger(prev => prev + 1); 
  }

  const handleOpenRoulette = (difficulty: 'Fácil' | 'Intermedio' | 'Difícil', prizeClaimedHandler: (prize: string) => void) => {
    setRouletteDifficulty(difficulty);
    setIsRouletteOpen(true);
    (window as any).claimPrizeAndCloseRoulette = prizeClaimedHandler;
  };

  const handlePrizeClaimed = (prize: string) => {
    const claimHandler = (window as any).claimPrizeAndCloseRoulette;
    if (claimHandler) claimHandler(prize);
    setIsRouletteOpen(false);
    
    setTimeout(() => setIsRewardModalOpen(false), 2500);
    
    if (prize.startsWith("COURSE:")) {
        const courseId = prize.split(":")[1];
        const courseData = courses.find(c => c.id === courseId);
        if (courseData) {
            unlockCourseGlobally(courseId);
            setRewardModalContent({ title: `¡Curso Ganado en Ruleta!`, courseId, currency: 0 });
            setIsRewardModalOpen(true);
        }
    } else if (prize.startsWith("COINS:")) {
        const amount = parseInt(prize.split(":")[1], 10);
        updateMonedas(amount);
        setRewardModalContent({ title: `¡Ruleta Ganadora!`, courseId: null, currency: amount });
        setIsRewardModalOpen(true);
    } else {
        alert(`¡Felicidades, ${user.nombre}! Has ganado: ${prize}.`);
    }
    delete (window as any).claimPrizeAndCloseRoulette;
    setScoreUpdateTrigger(prev => prev + 1); 
  };

  const handleBotClick = () => {
    if (botMoveToCorner) {
      if (chatReady) setIsChatOpen(!isChatOpen);
      return;
    }
    if (!isBotActive) setIsBotActive(true);
  };

  // --- LÓGICA DEL CHAT INTEGRADA ---
  
  const handleCourseClick = (courseId: string) => {
    alert(`Excelente elección. Este curso está disponible en la sección de Cursos.\nID: ${courseId}`);
  };

  const appendMessage = (message: Omit<ChatMessage, 'id'>) => {
    // Usamos Math.random() para evitar claves duplicadas
    setMessages((prev) => [...prev, { ...message, id: Date.now() + Math.random() }]);
  };

  const sendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    appendMessage({ text, sender: 'user' });
    setInputValue('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      // Configuración del modelo
      const model = genAI.getGenerativeModel({ 
          model: 'gemini-2.0-flash',
          generationConfig: { responseMimeType: "application/json" }
      });

      const availableCourses = courses.filter((c) => c.status === 'available');
      const courseListForAI = availableCourses
        .map((c) => `ID: ${c.id}, Título: ${c.title}, Carreras Relacionadas: [${c.relatedCareers.join(', ')}]`)
        .join('\n');

      const userCareer = user.carrera && user.carrera !== 'Selecciona tu carrera' ? user.carrera : 'No especificada';

      // --- TU PROMPT PERSONALIZADO ---
      const prompt = `
Eres un **asesor laboral amigable y servicial** del programa **Crece +Perú**. 
Tu rol es conversar con el usuario de forma empática, profesional y útil, 
brindando apoyo sobre empleo, formación, crecimiento profesional o habilidades.

**Datos del usuario:**
- Nombre: ${user.nombre}
- Carrera: ${userCareer}
- Mensaje del usuario: "${text}"

**Cursos disponibles:**
${courseListForAI}

Debes clasificar el mensaje del usuario y responder según estos casos:

1. 🧭 **RECOMMEND_COURSES** → cuando el usuario expresa interés claro en aprender, capacitarse o fortalecer habilidades.  
   Ejemplo: “Qué curso me recomiendas”, “Quiero mejorar mi perfil”, “Necesito capacitarme”.

2. 💬 **ADVICE** → cuando el usuario pide orientación o hace preguntas sobre empleo, entrevistas, liderazgo, habilidades, o desarrollo profesional en general.  
   Debes dar **consejos concretos, naturales y útiles**, como un orientador real.

3. 🤝 **SOCIAL_INTERACTION** → cuando el mensaje es un saludo o agradecimiento (“gracias”, “ok”, “adiós”, “hola”, “nos vemos”, etc.).  
   Responde con amabilidad, muestra empatía y siempre cierra preguntando si desea algo más.  
   Ejemplo: “¡Con gusto! 😊 ¿Hay algo más en lo que te pueda ayudar?”

4. 🚫 **OUT_OF_SCOPE** → cuando el mensaje no tiene relación con temas laborales o profesionales.  
   Responde con amabilidad e invita a hablar de desarrollo profesional.

Devuelve SIEMPRE un JSON con la siguiente estructura:

\`\`\`json
{
  "type": "RECOMMEND_COURSES" | "ADVICE" | "SOCIAL_INTERACTION" | "OUT_OF_SCOPE",
  "message": "Texto para responder al usuario",
  "data": [
    { "id": "ID_DEL_CURSO", "reason": "Motivo por el que lo recomiendas" }
  ] (solo si type es RECOMMEND_COURSES)
}
\`\`\`

No uses texto fuera del JSON.  
Tu tono debe ser **cálido, empático y profesional**.
`;
      // --------------------------------

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const cleanJson = responseText.replace(/```json|```/g, '').trim();
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanJson);
      } catch (e) {
        console.error("Error parseando JSON:", e);
        parsedResponse = { type: 'ADVICE', message: 'Disculpa, tuve un problema procesando eso. ¿Podrías repetirlo?' };
      }

      if (['SOCIAL_INTERACTION', 'ADVICE', 'OUT_OF_SCOPE'].includes(parsedResponse.type)) {
          appendMessage({ text: parsedResponse.message, sender: 'bot' });
      } else if (parsedResponse.type === 'RECOMMEND_COURSES' && Array.isArray(parsedResponse.data)) {
          appendMessage({ text: parsedResponse.message || 'Opciones para ti 👇', sender: 'bot' });
          parsedResponse.data.forEach((rec: { id: string; reason: string }) => {
            const recommendedCourse = courses.find((c) => c.id === rec.id);
            if (recommendedCourse) {
                appendMessage({ text: '', sender: 'bot', isCourseRecommendation: true, courseData: recommendedCourse, aiReason: rec.reason });
            }
          });
      }
    } catch (err) {
      console.error(err);
      appendMessage({ text: 'Hubo un problema de conexión. ¿Podrías intentarlo de nuevo?', sender: 'bot' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const getBotPositionClasses = () => {
    if (botMoveToCorner) return "top-[calc(100%-6rem)] left-6 translate-x-0 translate-y-0 scale-75 md:scale-90";
    if (isBotActive) return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-48 scale-110";
    return "top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100";
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-0 md:p-8 text-white relative overflow-hidden bg-slate-900 transition-all duration-1000 font-sans">

      <style>
        {`
          @keyframes botEntrance {
            0% { opacity: 0; transform: scale(0); }
            60% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
          }
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
        `}
      </style>

      <div className="fixed top-0 left-0 w-full z-50">
        <GameHeader 
          onReturnToMenu={() => setIsPlaying(false)} 
          isUnlocked={isMenuUnlocked} 
          activeSection={currentSection}
          onNavigate={handleNavigate}
        />
      </div>
      
      {/* MODAL RECOMPENSA */}
      {isRewardModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center backdrop-blur-sm animate-fade-in-up">
            <div className="bg-slate-900 border border-emerald-500 rounded-3xl shadow-2xl p-10 w-full max-w-lg text-center relative transform transition-all scale-100 animate-pulse-once">
                <div className="flex items-center justify-center mb-6">
                    {rewardModalContent.courseId 
                        ? <Gift className="w-16 h-16 text-emerald-400 animate-wiggle" />
                        : <div className="w-16 h-16 rounded-full bg-yellow-600 flex items-center justify-center text-3xl font-extrabold text-white animate-bounce-slow">$</div>
                    }
                </div>
                <h2 className="text-4xl font-extrabold text-white mb-2">{rewardModalContent.title}</h2>
                {rewardModalContent.courseId && (
                    <div className="mt-4 p-4 bg-slate-800 rounded-xl border border-emerald-500/50">
                        <p className="text-xl font-semibold text-emerald-300">{courses.find(c => c.id === rewardModalContent.courseId)?.title || "Curso no encontrado"}</p>
                    </div>
                )}
                {rewardModalContent.currency > 0 && (
                    <div className="mt-4 p-4 bg-slate-800 rounded-xl border border-yellow-500/50">
                        <p className="text-xl font-semibold text-yellow-300">¡Ganaste {rewardModalContent.currency} Monedas!</p>
                    </div>
                )}
                <button 
                    onClick={() => {
                        setIsRewardModalOpen(false);
                        if (rewardModalContent.courseId) handleNavigate('courses'); 
                    }} 
                    className="mt-8 py-3 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                    {rewardModalContent.courseId ? 'Ver Curso' : 'Continuar'}
                    <ArrowRight className="w-5 h-5"/>
                </button>
            </div>
        </div>
      )}

      {/* FONDOS */}
      <div className={`fixed inset-0 bg-gradient-to-br from-slate-900 to-slate-800 transition-opacity duration-1000 ease-in-out pointer-events-none -z-10 ${isStarted ? 'opacity-0' : 'opacity-90'}`}></div>
      <div className={`fixed inset-0 bg-gradient-to-tl from-slate-800 via-slate-900 to-black transition-opacity duration-1000 ease-in-out pointer-events-none -z-10 ${isStarted ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`fixed inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-purple-500/20 animate-pulse pointer-events-none transition-all duration-1000 -z-10 ${isStarted ? 'opacity-30' : 'opacity-100'}`}></div>

      <button onClick={logout} className="fixed top-24 right-6 z-40 flex items-center px-4 py-2 bg-white/5 border border-white/10 text-white text-sm font-semibold rounded-full hover:bg-red-500/20 transition duration-300 backdrop-blur-md group">
        <span className="mr-2 hidden md:inline">Cerrar Sesión</span>
        <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* RULETA */}
      {isRouletteOpen && (
        <PrizeRoulette 
          onClose={() => setIsRouletteOpen(false)}
          onPrizeClaimed={handlePrizeClaimed}
          chestDifficulty={rouletteDifficulty}
          career={user.carrera} 
        />
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className={`mt-20 md:mt-32 w-full flex flex-col items-center transition-all duration-1000 ${!isPlaying ? 'h-[calc(100vh-100px)] overflow-hidden' : 'min-h-screen h-auto pb-20'}`}>
        <div className={`relative z-10 w-full max-w-7xl flex items-center justify-center ${!isPlaying ? 'h-full' : 'h-auto block'}`}>

          {/* INTRO */}
          <div className={`absolute inset-0 transition-all duration-1000 ${!isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            
            {/* BIENVENIDA */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-1000 transform z-30 ${isStarted ? 'opacity-0 scale-95 pointer-events-none translate-y-[-20px]' : 'opacity-100 scale-100 translate-y-0 pointer-events-auto'}`}>
              <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-6 animate-bounce" />
              <h1 className="text-5xl md:text-8xl font-extrabold mb-4 tracking-tight">Bienvenido, <span className="text-blue-400">{user.nombre}</span></h1>
              <p className={`text-2xl md:text-3xl font-light text-gray-300 transition-all duration-1000 ${showSecondLine ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                Veo que elegiste la carrera de <strong className="text-purple-400 font-semibold">{user.carrera}</strong>.
              </p>
              <p className={`mt-8 text-3xl md:text-5xl font-bold transition-all duration-1000 delay-500 ${showThirdLine ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                ¡Vamos a ver de lo que eres capaz! <Zap className="inline w-8 h-8 text-yellow-400 ml-2" />
              </p>
              <div className={`mt-12 transition-all duration-1000 ${showStartButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <button onClick={handleStart} className="group relative px-10 py-4 bg-white text-slate-900 font-bold text-xl rounded-full hover:scale-105 transition-all duration-300 pointer-events-auto cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  <span className="relative z-9999999 flex items-center">Empezar <Play className="w-5 h-5 ml-2 fill-current" /></span>
                </button>
              </div>
            </div>

            {/* BOT INTRO */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-1000 delay-700 transform ${isStarted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-105 translate-y-[20px] pointer-events-none'}`}>
              <h2 className={`text-4xl md:text-6xl font-extrabold text-white leading-tight max-w-4xl mb-12 transition-all duration-700 ${isBotActive ? 'opacity-0 -translate-y-10 pointer-events-none' : 'opacity-100'}`}>
                Ahora te presentaremos a nuestro bot de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">CrecePerú</span>
              </h2>
            </div>

            <div className={`absolute top-1/2 mt-10 w-full flex justify-center pointer-events-none`}>
              <div className={`max-w-3xl px-4 transition-all duration-1000 ${isBotActive && showFinalText ? 'opacity-100 translate-y-0 delay-1000' : 'opacity-0 translate-y-10'}`}>
                <p className="text-2xl md:text-3xl text-gray-200 text-center font-medium">Este bot te ayudará sobre temas de ámbito laboral sobre tu carrera.</p>
              </div>
            </div>

            {/* BOTÓN JUEGO */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-1000 z-20 ${showGameIntro ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-8 drop-shadow-sm">
                Ahora evaluaremos tus conocimientos
              </h2>
              <div className={`transition-all duration-700 delay-300 ${showGameButton ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 translate-y-8 scale-90'}`}>
                <button 
                  onClick={handleStartGame} 
                  className="group relative px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-2xl rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] hover:scale-105 transition-all duration-300 overflow-hidden ring-2 ring-emerald-400/50 flex flex-col items-center"
                >
                  <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 ease-out -skew-x-12 origin-left"></div>
                  <span className="relative z-10 flex items-center gap-3">
                    <Gamepad2 className="w-8 h-8" />
                    Iniciar Juego
                  </span>
                  {!isMenuUnlocked && (
                    <span className="relative z-10 text-xs font-medium text-emerald-100 mt-1 flex items-center gap-1 animate-pulse">
                      <Unlock className="w-3 h-3" /> Desbloquea todas las secciones
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* SECCIONES JUEGO */}
          {isPlaying && (
            <div className="w-full relative z-30 transition-all duration-500 animate-fade-in">
              <div className={`w-full ${currentSection === 'game' ? 'block' : 'hidden'}`}>
                <GameModule 
                  onClose={handleCloseGame} 
                  onOpenRoulette={handleOpenRoulette} 
                  career={user.carrera} 
                  onScoreUpdateTrigger={handleScoreUpdateTrigger}
                  totalMonedas={totalMonedas}
                  unlockedCourseIds={unlockedCourseIds}
                  onBuyCourse={buyCourse}
                />
              </div>
              <div className={`w-full ${currentSection === 'progress' ? 'block' : 'hidden'}`}>
                <ProgressModule 
                    key={scoreUpdateTrigger} 
                    user={user} 
                    currentScore={accumulatedScore}
                    onClaimReward={handleProgressClaim}
                />
              </div>
              <div className={`w-full ${currentSection === 'courses' ? 'block' : 'hidden'}`}>
                <CoursesModule 
                    unlockedCourseIds={unlockedCourseIds} 
                    courseToAnimate={courseToAnimate}
                    totalMonedas={totalMonedas}
                    onBuyCourse={buyCourse}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CHAT WIDGET (INLINE) */}
      <div className={`fixed bottom-28 left-6 z-40 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] flex flex-col transition-all duration-500 origin-bottom-left bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden ${isChatOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'}`}>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between shadow-md flex-shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-white" />
            <h3 className="font-bold text-white text-sm md:text-base">Asistente Crece +Perú</h3>
          </div>
          <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm md:text-base ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-slate-800 border border-white/10 text-gray-200 rounded-bl-none'
              }`}>
                {msg.isCourseRecommendation && msg.courseData ? (
                  <div className="cursor-pointer group" onClick={() => handleCourseClick(msg.courseData!.id)}>
                    <div className="relative h-32 w-full rounded-lg overflow-hidden mb-2">
                      <img src={msg.courseData.imageUrl} alt={msg.courseData.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold">Ver Detalles</span>
                      </div>
                    </div>
                    <h4 className="font-bold text-blue-300 mb-1">{msg.courseData.title}</h4>
                    <p className="text-xs text-gray-400 mb-2">Nivel: {msg.courseData.difficulty}</p>
                    <div className="text-xs italic text-gray-300 border-l-2 border-purple-500 pl-2 mb-2">
                      <FormattedText text={msg.aiReason!} />
                    </div>
                    <button className="w-full bg-white/10 hover:bg-white/20 text-white py-1.5 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1">
                      Ver Curso <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <FormattedText text={msg.text} />
                )}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
               <div className="bg-slate-800 border border-white/10 p-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                 <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
               </div>
             </div>
          )}
          {/* DIV INVISIBLE PARA EL SCROLL */}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 bg-slate-800/80 border-t border-white/10 flex-shrink-0">
          <div className="flex gap-2 items-end">
            <textarea
              placeholder="Escribe aquí..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1 bg-slate-900/50 border border-white/20 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-10 max-h-20 custom-scrollbar"
              rows={1}
            />
            <button 
              onClick={sendMessage} 
              disabled={isLoading || !inputValue.trim()}
              className={`p-2 rounded-full transition-all ${
                isLoading || !inputValue.trim() 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg hover:scale-105'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* BOTÓN FLOTANTE (BOT) */}
      {showBot && (
        <div onClick={handleBotClick} className={`fixed z-50 transition-all duration-[1500ms] cubic-bezier(0.4, 0, 0.2, 1) opacity-100 ${getBotPositionClasses()} ${chatReady && !isChatOpen ? 'cursor-pointer animate-pulse' : ''}`}>
          <div 
            className="relative group cursor-pointer pointer-events-auto origin-center"
            style={{ animation: 'botEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
          >
            {chatReady && !isChatOpen && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                ¡Hazme click!
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
              </div>
            )}
            <div className={`absolute inset-0 bg-blue-500/20 rounded-full blur-xl transition-all duration-500 ${botMoveToCorner ? 'opacity-0' : 'group-hover:bg-blue-500/40'}`}></div>
            <div className={`relative bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center shadow-2xl ring-1 ring-white/20 transition-all duration-500 ${botMoveToCorner ? `w-16 h-16 bg-slate-800/90 ${isChatOpen ? 'scale-90 ring-blue-500 ring-2' : 'hover:scale-110 hover:ring-white/40'}` : 'w-32 h-32 group-hover:scale-105'}`}>
              {isChatOpen ? (
                <X className="text-white w-8 h-8" />
              ) : botMoveToCorner && chatReady ? (
                <MessageSquare className="text-white w-8 h-8 animate-pulse" />
              ) : (
                <Bot className={`text-white transition-all duration-500 ${botMoveToCorner ? 'w-8 h-8' : 'w-16 h-16 animate-bounce-slow'}`} />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default WelcomePage;