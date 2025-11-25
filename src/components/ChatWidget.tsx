import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Bot, X, Send, MessageSquare, ArrowRight } from 'lucide-react';
import { courses } from '../data/courses'; 
import type { Course } from '../data/courses';

// --- TIPOS ---
interface UserProps {
  nombre: string;
  carrera: string;
}

interface ChatWidgetProps {
  user: UserProps;
  showBot: boolean;         // ¿Debe renderizarse el botón?
  botMoveToCorner: boolean; // ¿Debe moverse a la esquina?
  onBotClick: () => void;   // Acción al hacer click (iniciar intro o abrir chat)
}

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  isCourseRecommendation?: boolean;
  courseData?: Course;
  aiReason?: string;
}

// --- COMPONENTE AUXILIAR PARA TEXTO ---
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

const ChatWidget: React.FC<ChatWidgetProps> = ({ user, showBot, botMoveToCorner, onBotClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatReady, setChatReady] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 1, 
      text: `¡Hola ${user.nombre}! 👋 Soy tu asistente laboral de Crece +Perú. Veo que estudias **${user.carrera}**. Estoy aquí para ayudarte a impulsar tu carrera profesional. ¿En qué te puedo apoyar hoy?`, 
      sender: 'bot' 
    }
  ]);

  // API KEY
  const API_KEY = 'AIzaSyBZBRnj4bsve294i-obsTEWvZHMvv0SCSk';

  // Habilitar interacción cuando el bot llega a la esquina
  useEffect(() => {
    if (botMoveToCorner) {
      const timer = setTimeout(() => setChatReady(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [botMoveToCorner]);

  // Scroll automático
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // --- LÓGICA INTERNA ---

  const handleInternalClick = () => {
    if (!botMoveToCorner) {
      onBotClick();
      return;
    }
    if (chatReady) {
      setIsOpen(!isOpen);
    }
  };

  const handleCourseClick = (courseId: string) => {
    alert(`Has seleccionado el curso ID: ${courseId}.`);
  };

  const appendMessage = (message: Omit<ChatMessage, 'id'>) => {
    setMessages((prev) => [...prev, { ...message, id: Date.now() }]);
  };

  const sendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    appendMessage({ text, sender: 'user' });
    setInputValue('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      
      // Usamos gemini-1.5-flash + JSON mode para estabilidad
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        generationConfig: { responseMimeType: "application/json" }
      });

      const availableCourses = courses.filter((c) => c.status === 'available');
      const courseListForAI = availableCourses
        .map((c) => `ID: ${c.id}, Título: ${c.title}, Carreras Relacionadas: [${c.relatedCareers.join(', ')}]`)
        .join('\n');

      // Definición de carrera tal como la pediste
      const userCareer =
        user.carrera && user.carrera !== 'Selecciona tu carrera' && user.carrera !== 'Otro...'
          ? user.carrera
          : 'No especificada';

      // --- TU PROMPT EXACTO ---
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
      // -----------------------

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Limpieza defensiva del JSON
      const cleanJson = responseText.replace(/```json|```/g, '').trim();
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanJson);
      } catch (e) {
        // Fallback básico si el JSON falla
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
            appendMessage({ 
              text: '', 
              sender: 'bot', 
              isCourseRecommendation: true, 
              courseData: recommendedCourse, 
              aiReason: rec.reason 
            });
          }
        });
      } else {
        // Fallback genérico
         appendMessage({ text: parsedResponse.message || 'Entendido.', sender: 'bot' });
      }

    } catch (err) {
      console.error(err);
      appendMessage({ text: 'Error de conexión con el asistente.', sender: 'bot' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const getBotPositionClasses = () => {
    if (botMoveToCorner) return "top-[calc(100%-6rem)] left-6 translate-x-0 translate-y-0 scale-75 md:scale-90";
    return "top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100";
  };

  if (!showBot) return null;

  return (
    <>
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

      {/* VENTANA DE CHAT */}
      <div className={`fixed bottom-28 left-6 z-40 w-[90vw] md:w-[400px] h-[500px] flex flex-col transition-all duration-500 origin-bottom-left bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-white" />
            <h3 className="font-bold text-white text-sm md:text-base">Asistente Crece +Perú</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={messagesEndRef}>
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
        </div>

        {/* Input */}
        <div className="p-3 bg-slate-800/80 border-t border-white/10">
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

      {/* BOTÓN FLOTANTE */}
      <div 
        onClick={handleInternalClick} 
        className={`fixed z-50 transition-all duration-[1500ms] cubic-bezier(0.4, 0, 0.2, 1) opacity-100 ${getBotPositionClasses()} ${chatReady && !isOpen ? 'cursor-pointer animate-pulse' : ''}`}
      >
        <div 
          className="relative group cursor-pointer pointer-events-auto origin-center"
          style={{ animation: 'botEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
        >
          {chatReady && !isOpen && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              ¡Ayuda aquí!
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
            </div>
          )}
          
          <div className={`absolute inset-0 bg-blue-500/20 rounded-full blur-xl transition-all duration-500 ${botMoveToCorner ? 'opacity-0' : 'group-hover:bg-blue-500/40'}`}></div>
          
          <div className={`relative bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center shadow-2xl ring-1 ring-white/20 transition-all duration-500 ${botMoveToCorner ? `w-16 h-16 bg-slate-800/90 ${isOpen ? 'scale-90 ring-blue-500 ring-2' : 'hover:scale-110 hover:ring-white/40'}` : 'w-32 h-32 group-hover:scale-105'}`}>
            {isOpen ? (
              <X className="text-white w-8 h-8" />
            ) : botMoveToCorner && chatReady ? (
              <MessageSquare className="text-white w-8 h-8 animate-pulse" />
            ) : (
              <Bot className={`text-white transition-all duration-500 ${botMoveToCorner ? 'w-8 h-8' : 'w-16 h-16 animate-bounce-slow'}`} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;