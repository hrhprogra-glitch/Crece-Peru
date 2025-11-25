import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, TrendingUp, Shield, CheckCircle, Target, Gift, Lock } from 'lucide-react';

interface UserProps {
    nombre: string;
    email: string;
    carrera: string;
}

interface ProgressModuleProps {
    user: UserProps;
    currentScore: number;
    onClaimReward: (rewardType: 'COINS' | 'COURSE', value: string) => void;
}

const getClaimKey = (email: string, points: number) => 
    `claimed_objective_${email}_${points}`;

const ProgressModule: React.FC<ProgressModuleProps> = ({ user, currentScore, onClaimReward }) => {
    
    const objectives = [
        { points: 50, name: "Cimientos del Aprendizaje", description: "Completa la primera evaluación.", rewardType: 'COURSE', rewardValue: 'c_id_001' },
        { points: 100, name: "Dominio Intermedio", description: "Alcanza un nivel de comprensión sólido.", rewardType: 'COINS', rewardValue: '200' },
        { points: 150, name: "Experto en la Base", description: "Demuestra manejo de conceptos clave.", rewardType: 'COURSE', rewardValue: 'c_id_002' },
        { points: 200, name: "Maestro del Conocimiento", description: "Llega al nivel de la práctica profesional.", rewardType: 'COINS', rewardValue: '500' },
        { points: 250, name: "Impulso Profesional", description: "Prepara tu perfil para el avance.", rewardType: 'COINS', rewardValue: '750' },
        { points: 300, name: "Meta Alcanzada", description: "¡Has completado la formación inicial!", rewardType: 'COURSE', rewardValue: 'c_id_003' },
    ];

    const maxGoal = 300;
    const progressPercent = Math.min(100, (currentScore / maxGoal) * 100);

    // Estado local para feedback inmediato
    const [localClaimed, setLocalClaimed] = useState<Record<number, boolean>>({});

    // Sincronizar estado local con localStorage al cargar
    useEffect(() => {
        const initialClaims: Record<number, boolean> = {};
        objectives.forEach(obj => {
            const key = getClaimKey(user.email, obj.points);
            if (localStorage.getItem(key) === 'true') {
                initialClaims[obj.points] = true;
            }
        });
        setLocalClaimed(initialClaims);
    }, [user.email]);

    const skills = [
        { name: 'Liderazgo', level: 75, color: 'bg-blue-500' },
        { name: 'Comunicación', level: 90, color: 'bg-purple-500' },
        { name: 'Resolución de Problemas', level: 60, color: 'bg-emerald-500' },
        { name: 'Gestión de Tiempo', level: 85, color: 'bg-pink-500' },
    ];

    const handleClaim = (obj: typeof objectives[0]) => {
        const claimKey = getClaimKey(user.email, obj.points);
        
        // 1. Persistir
        localStorage.setItem(claimKey, 'true');
        
        // 2. Actualizar estado local (feedback inmediato)
        setLocalClaimed(prev => ({ ...prev, [obj.points]: true }));

        // 3. Notificar al padre
        onClaimReward(obj.rewardType as 'COINS' | 'COURSE', obj.rewardValue);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6 pb-20 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* PERFIL Y PUNTAJE TOTAL */}
                <div className="col-span-1 md:col-span-3 bg-gradient-to-r from-slate-800 to-slate-900 border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-6 z-10">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px]">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                                <span className="text-4xl">👨‍🎓</span> 
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white">{user.nombre}</h2>
                            <p className="text-gray-400">{user.carrera}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold border border-yellow-500/30 flex items-center gap-1">
                                    <Trophy className="w-3 h-3" /> Puntos Totales: {currentScore} XP
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 md:mt-0 text-right z-10">
                        <p className="text-sm text-gray-400 mb-2">Progreso General</p>
                        <div className="w-64 h-8 bg-slate-700 rounded-full overflow-hidden relative shadow-inner">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000" 
                                style={{ width: `${progressPercent}%` }}>
                            </div>
                            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white/90">{progressPercent.toFixed(0)}% ({currentScore} / {maxGoal} XP)</span>
                        </div>
                    </div>
                </div>

                {/* STATS GRID */}
                <div className="col-span-1 md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-slate-800/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl group"><div className="flex items-center justify-between mb-4"><div className="p-3 rounded-xl bg-yellow-400/20 text-yellow-400"><Star className="w-6 h-6" /></div><span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Nivel</span></div><h3 className="text-4xl font-bold text-white mb-1">7</h3></div>
                    <div className="bg-slate-800/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl group"><div className="flex items-center justify-between mb-4"><div className="p-3 rounded-xl bg-blue-400/20 text-blue-400"><Zap className="w-6 h-6" /></div><span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Racha</span></div><h3 className="text-4xl font-bold text-white mb-1">12 días</h3></div>
                    <div className="bg-slate-800/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl group"><div className="flex items-center justify-between mb-4"><div className="p-3 rounded-xl bg-purple-400/20 text-purple-400"><Trophy className="w-6 h-6" /></div><span className="text-gray-500 text-xs uppercase font-bold tracking-wider">XP Ganado</span></div><h3 className="text-4xl font-bold text-white mb-1">2,450</h3></div>
                    <div className="bg-slate-800/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl group"><div className="flex items-center justify-between mb-4"><div className="p-3 rounded-xl bg-green-400/20 text-green-400"><TrendingUp className="w-6 h-6" /></div><span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Ranking</span></div><h3 className="text-4xl font-bold text-white mb-1">#42</h3></div>
                </div>
                
                {/* OBJETIVOS CON BARRA DE PROGRESO */}
                <div className="col-span-1 md:col-span-2 bg-slate-800/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5 text-indigo-400" /> Metas de Puntuación (300)
                    </h3>
                    <div className="space-y-6">
                        {objectives.map((obj, index) => {
                            const isAchieved = currentScore >= obj.points;
                            const currentProgress = Math.min(100, (currentScore / obj.points) * 100);
                            const isClaimed = localClaimed[obj.points] || false;

                            return (
                                <div key={index} className="p-3 rounded-lg border border-white/5 shadow-md bg-slate-900/50 transition-all duration-300">
                                    
                                    {/* Cabecera y botón */}
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            {isAchieved ? (
                                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                                            ) : (
                                                <Lock className="w-5 h-5 text-gray-500" />
                                            )}
                                            <span className={`font-medium ${isAchieved ? 'text-white' : 'text-gray-400'}`}>
                                                {obj.name}
                                            </span>
                                        </div>
                                        
                                        {/* Botón Reclamar / Puntos */}
                                        <button 
                                            onClick={() => isAchieved && !isClaimed ? handleClaim(obj) : undefined}
                                            className={`
                                                px-3 py-1 rounded-full text-xs font-bold transition-all
                                                ${isClaimed 
                                                    ? 'bg-gray-700 text-gray-400 cursor-default border border-gray-600'
                                                    : isAchieved
                                                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg cursor-pointer flex items-center gap-1'
                                                        : 'bg-slate-700 text-gray-400 cursor-default'
                                                }
                                            `}
                                            disabled={!isAchieved || isClaimed}
                                        >
                                            {isClaimed ? 'Reclamado' : (
                                                isAchieved ? <><Gift className="w-4 h-4" /> Reclamar</> : `${obj.points} Pts`
                                            )}
                                        </button>
                                    </div>

                                    <p className="text-xs text-gray-500 mb-2">{obj.description}</p>

                                    {/* Barra de Progreso Individual */}
                                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden relative">
                                        <div className={`h-full rounded-full transition-all duration-700 ${isAchieved ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                            style={{ width: `${currentProgress}%` }}>
                                        </div>
                                        <span className="absolute top-0 right-0 p-0.5 text-[10px] text-white/90 font-semibold">{currentProgress.toFixed(0)}%</span>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* SKILLS SECTION */}
                <div className="bg-slate-800/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-pink-400" /> Habilidades Clave
                    </h3>
                    <div className="space-y-6">
                        {skills.map((skill, index) => (
                            <div key={index}>
                                <div className="flex justify-between mb-2">
                                <span className="text-gray-300 font-medium">{skill.name}</span>
                                <span className="text-white font-bold">{skill.level}%</span>
                                </div>
                                <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${skill.color} shadow-lg transition-all duration-1000`} 
                                    style={{ width: `${skill.level}%` }}
                                ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProgressModule;