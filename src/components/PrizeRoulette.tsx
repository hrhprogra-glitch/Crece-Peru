import React, { useState, useEffect } from 'react';
import { Award, RotateCw, X, Gift } from 'lucide-react';
import { courses } from '../data/courses'; 

interface Prize {
  id: string; 
  name: string; 
  fullTitle: string; 
  color: string;
  isCourse: boolean;
  isCoins: boolean; // Nuevo campo
  value: number;    // Valor numérico (para monedas)
}

interface PrizeRouletteProps {
  onClose: () => void;
  onPrizeClaimed: (prize: string, difficulty: 'Fácil' | 'Intermedio' | 'Difícil') => void; 
  chestDifficulty: 'Fácil' | 'Intermedio' | 'Difícil';
  career: string;
}

// --- Paleta de 6 colores para los 6 segmentos ---
const SEGMENT_COLORS = [
  '#10b981', // Verde (Curso 1)
  '#f59e0b', // Naranja (Monedas 50)
  '#38bdf8', // Azul (Curso 2)
  '#f472b6', // Rosa (Monedas 100)
  '#8b5cf6', // Violeta (Curso 3)
  '#eab308', // Dorado (Monedas 150)
];

const normalizeCareerName = (inputCareer: string): string => {
  const careerMap: { [key: string]: string } = {
    'Ingeniería de Sistemas': 'Ingenieria de Gestión Empresarial',
    'Ingeniería de Sistemas Empresarial': 'Ingenieria de Gestión Empresarial',
    'Ingenieria de Gestión Empresarial': 'Ingenieria de Gestión Empresarial',
    'Ciencias de la Computación': 'Ciencias de la Computación',
    'Diseño UX/UI': 'Diseño UX/UI',
    'Marketing Digital Avanzado': 'Marketing Digital Avanzado',
    'Análisis de Datos e Inteligencia Artificial': 'Análisis de Datos e Inteligencia Artificial',
  };

  const normalizedInput = inputCareer.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
  for (const key in careerMap) {
    const normalizedKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if (normalizedInput === normalizedKey || normalizedInput.includes(normalizedKey.split(' ')[0].toLowerCase())) {
      return careerMap[key];
    }
  }

  if (inputCareer.includes('Sistemas')) {
      return 'Ingenieria de Gestión Empresarial';
  }
  
  return inputCareer;
};

const getCareerPrizeData = (career: string): Prize[] => {
  const normalizedCareer = normalizeCareerName(career);

  // 1. Obtener 3 cursos relacionados
  const careerCourses = courses.filter(c => c.relatedCareers.includes(normalizedCareer));
  let selectedCourses = careerCourses.slice(0, 3); 

  // Rellenar si faltan cursos
  while (selectedCourses.length < 3) {
      selectedCourses.push({
          id: `GENERIC_COURSE_${selectedCourses.length}`,
          title: 'Curso Especial',
          difficulty: 'Principiante',
          imageUrl: '',
          status: 'available',
          relatedCareers: [normalizedCareer]
      });
  }

  // 2. Crear objetos de cursos
  const coursePrizes: Omit<Prize, 'color'>[] = selectedCourses.map(course => ({
    id: course.id,
    name: 'Curso',
    fullTitle: course.title,
    isCourse: true,
    isCoins: false,
    value: 0
  }));

  // 3. Crear objetos de monedas
  const coinPrizes: Omit<Prize, 'color'>[] = [
      { id: 'COINS_50', name: '50', fullTitle: '50 Monedas', isCourse: false, isCoins: true, value: 50 },
      { id: 'COINS_100', name: '100', fullTitle: '100 Monedas', isCourse: false, isCoins: true, value: 100 },
      { id: 'COINS_150', name: '150', fullTitle: '150 Monedas', isCourse: false, isCoins: true, value: 150 },
  ];

  // 4. Intercalar premios para la ruleta (Curso, Moneda, Curso, Moneda...)
  const rawPrizes = [
      coursePrizes[0], coinPrizes[0],
      coursePrizes[1], coinPrizes[1],
      coursePrizes[2], coinPrizes[2]
  ];

  // 5. Asignar colores
  return rawPrizes.map((prize, index) => ({
      ...prize,
      color: SEGMENT_COLORS[index % SEGMENT_COLORS.length] 
  }));
};

const spinRoulette = (prizes: Prize[]): { prize: Prize; degrees: number } => {
  const numPrizes = prizes.length;
  const prizeIndex = Math.floor(Math.random() * numPrizes); 
  const prize = prizes[prizeIndex];
  const segmentSize = 360 / numPrizes;
  const centerAngle = (prizeIndex * segmentSize) + (segmentSize / 2);
  const baseRotation = 3600;
  const targetRotation = baseRotation + (360 - centerAngle) + 180;
  const finalDegrees = targetRotation + (Math.random() * 15 - 7.5); 

  return { prize, degrees: finalDegrees };
};

const PrizeRoulette: React.FC<PrizeRouletteProps> = ({ onClose, onPrizeClaimed, chestDifficulty, career }) => {
  const PRIZES = getCareerPrizeData(career); 
  const numSegments = PRIZES.length;
  const segmentAngle = 360 / numSegments;

  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [finalPrize, setFinalPrize] = useState<Prize | null>(null);

  const handleSpin = () => {
    if (isSpinning || hasSpun || PRIZES.length === 0) return;

    const { prize, degrees } = spinRoulette(PRIZES);

    setIsSpinning(true);
    setHasSpun(true);
    setFinalPrize(null); 
    setRotation(degrees); 

    const stopTimer = setTimeout(() => {
      setIsSpinning(false);
      setFinalPrize(prize);
    }, 5000); 

    return () => clearTimeout(stopTimer);
  };

  const handleClaim = () => {
      if (finalPrize) {
          let prizeString = '';
          
          if (finalPrize.isCourse) {
              prizeString = `COURSE:${finalPrize.id}`;
          } else if (finalPrize.isCoins) {
              prizeString = `COINS:${finalPrize.value}`;
          }
          
          onPrizeClaimed(prizeString, chestDifficulty); 
      }
  }

  if (numSegments === 0) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center backdrop-blur-sm animate-fade-in-up">
      <div className="bg-slate-900 border border-white/20 rounded-3xl shadow-2xl p-8 w-full max-w-xl text-center relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/30 text-white transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-extrabold text-white mb-6">
          ¡Cofre {chestDifficulty} Abierto!
        </h2>
        <p className="text-gray-400 mb-6">
            {hasSpun 
                ? `¡Felicidades! Has ganado:`
                : `Gira para ganar Cursos o Monedas:`
            }
        </p>
        
        <div className="flex justify-center items-center mb-8 relative">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-[15px] border-r-[15px] border-t-[20px] border-l-transparent border-r-transparent border-t-yellow-400 z-10"></div>
          
          <div 
            className="w-96 h-96 rounded-full border-8 border-white/30 shadow-xl relative overflow-hidden transition-transform duration-[5000ms] ease-out-quart"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {PRIZES.map((prize, index) => (
              <div 
                key={`bg-${index}`}
                className="absolute inset-0 origin-center"
                style={{
                  transform: `rotate(${index * segmentAngle}deg) skewY(-${90 - segmentAngle}deg)`,
                  clipPath: `polygon(50% 50%, 100% 100%, 100% 0%)`,
                  backgroundColor: prize.color,
                }}
              />
            ))}

            {PRIZES.map((prize, index) => {
              const textRotation = index * segmentAngle + segmentAngle / 2;
              return (
                <div
                  key={`text-${index}`}
                  className="absolute inset-0 origin-center flex items-center justify-start text-black font-extrabold pointer-events-none z-20"
                  style={{ transform: `rotate(${textRotation}deg)` }}
                >
                  <div 
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{ transform: `translate(36px, 0)`, width: '100px', textAlign: 'center' }}
                  >
                    <span className="block text-2xl font-extrabold leading-tight">
                      {prize.isCoins ? `$${prize.name}` : prize.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 h-20 flex flex-col justify-center">
          {isSpinning ? (
            <p className="text-xl text-gray-400 flex items-center justify-center gap-2">
              Girando... <RotateCw className="w-5 h-5 animate-spin text-purple-600" />
            </p>
          ) : hasSpun && finalPrize ? (
            <div className="p-3 border-2 border-dashed border-yellow-500/50 rounded-xl bg-slate-800">
              <p className="text-2xl font-bold text-yellow-400 mb-1 flex items-center justify-center gap-2 animate-bounce-slow">
                <Award className="w-6 h-6" /> ¡Ganaste!
              </p>
              <p className="text-xl text-white font-medium text-center">
                {finalPrize.fullTitle}
              </p>
            </div>
          ) : (
            <p className="text-xl text-gray-400 flex items-center justify-center gap-2">
                Presiona "Girar Ruleta" para probar suerte.
            </p>
          )}
        </div>

        <button 
            onClick={hasSpun ? handleClaim : handleSpin}
            disabled={isSpinning || PRIZES.length === 0 || (hasSpun && !finalPrize)}
            className="mt-6 w-full py-3 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
            {isSpinning ? 'Girando...' : hasSpun ? 'Reclamar Premio' : 'Girar Ruleta'}
        </button>

      </div>
    </div>
  );
};

export default PrizeRoulette;