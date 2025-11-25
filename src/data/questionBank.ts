export type Difficulty = 'Fácil' | 'Intermedio' | 'Difícil';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface CareerQuestions {
  [key: string]: {
    [key in Difficulty]: Question[];
  };
}

// Banco de preguntas adaptado a las carreras de src/constants/careers.ts
export const QUESTION_BANK: CareerQuestions = {
    "Ingenieria de Gestión Empresarial": {
    "Fácil": [
        { id: "ise-e-1", text: "¿Qué es un proceso empresarial?", options: ["Secuencia de actividades para generar valor", "Un diagrama de software", "Una base de datos", "Un producto digital"], correctAnswer: "Secuencia de actividades para generar valor" },
        { id: "ise-e-2", text: "¿Qué es un indicador KPI?", options: ["Una herramienta de marketing", "Un servidor web", "Un indicador clave de desempeño", "Un registro contable"], correctAnswer: "Un indicador clave de desempeño" },
        { id: "ise-e-3", text: "¿Cuál es el propósito de la planificación estratégica?", options: ["Eliminar empleados", "Dirigir el rumbo de la organización", "Incrementar la carga laboral", "Cerrar departamentos"], correctAnswer: "Dirigir el rumbo de la organización" },
        { id: "ise-e-4", text: "¿Qué es un organigrama?", options: ["Diagrama de procesos", "Representación de la estructura organizacional", "Plan financiero", "Calendario de actividades"], correctAnswer: "Representación de la estructura organizacional" },
        { id: "ise-e-5", text: "¿Qué es una competencia laboral?", options: ["Una oferta de empleo", "Habilidad o conocimiento necesario para un puesto", "Un contrato de trabajo", "Un formulario empresarial"], correctAnswer: "Habilidad o conocimiento necesario para un puesto" }
    ],
    "Intermedio": [
        { id: "ise-m-1", text: "¿Qué herramienta se utiliza para analizar fortalezas y debilidades empresariales?", options: ["Diagrama de Gantt", "Análisis FODA", "POE", "Diagrama ER"], correctAnswer: "Análisis FODA" },
        { id: "ise-m-2", text: "¿Qué es la reingeniería de procesos?", options: ["Repetir un proceso sin cambios", "Rediseñar procesos radicalmente para mejorar rendimiento", "Eliminar áreas funcionales", "Contratar nuevo personal"], correctAnswer: "Rediseñar procesos radicalmente para mejorar rendimiento" },
        { id: "ise-m-3", text: "¿Qué busca la gestión de calidad total (TQM)?", options: ["Reducir el personal", "Mejorar continuamente productos y servicios", "Impulsar el hardware empresarial", "Reemplazar a los gerentes"], correctAnswer: "Mejorar continuamente productos y servicios" },
        { id: "ise-m-4", text: "¿Qué significa logística empresarial?", options: ["Marketing digital", "Arte de persuadir clientes", "Gestión del flujo de bienes e información", "Creación de contenido"], correctAnswer: "Gestión del flujo de bienes e información" },
        { id: "ise-m-5", text: "¿Qué es un mapa de procesos?", options: ["Manual de empleados", "Representación gráfica de la cadena de valor", "Contrato de servicios", "Servidor empresarial"], correctAnswer: "Representación gráfica de la cadena de valor" }
    ],
    "Difícil": [
        { id: "ise-h-1", text: "¿Qué es Lean Management?", options: ["Metodología para reducir desperdicios y maximizar valor", "Un tipo de CRM", "Un software contable", "Una certificación de seguridad"], correctAnswer: "Metodología para reducir desperdicios y maximizar valor" },
        { id: "ise-h-2", text: "¿Cuál es la finalidad del Balanced Scorecard?", options: ["Evaluar sistemas métricos militares", "Alinear objetivos estratégicos con indicadores de desempeño", "Medir rendimiento de equipos de cómputo", "Controlar inventarios financieros"], correctAnswer: "Alinear objetivos estratégicos con indicadores de desempeño" },
        { id: "ise-h-3", text: "¿Qué es un Cuadro de Mando Integral?", options: ["Plan de producción agrícola", "Sistema de control estratégico integral", "Plan de desarrollo territorial", "Mapa de riesgos legales"], correctAnswer: "Sistema de control estratégico integral" },
        { id: "ise-h-4", text: "¿Qué busca el modelo Kaizen?", options: ["Cambios radicales repentinos", "Mejora continua mediante pequeños cambios constantes", "Suspensión de procesos", "Automatización completa inmediata"], correctAnswer: "Mejora continua mediante pequeños cambios constantes" },
        { id: "ise-h-5", text: "¿Qué es la cadena de valor de Porter?", options: ["Un modelo de software", "Marco para analizar actividades que generan ventajas competitivas", "Sistema contable", "Método de asignación de recursos humanos"], correctAnswer: "Marco para analizar actividades que generan ventajas competitivas" }
    ]
    },
  "Ciencias de la Computación": {
    "Fácil": [
      { id: "cc-e-1", text: "¿Qué es un algoritmo?", options: ["Un virus", "Una secuencia de pasos lógicos", "Un componente de hardware", "Un error de sistema"], correctAnswer: "Una secuencia de pasos lógicos" },
      { id: "cc-e-2", text: "¿Cuál es un lenguaje de bajo nivel?", options: ["Python", "Java", "Ensamblador", "JavaScript"], correctAnswer: "Ensamblador" },
      { id: "cc-e-3", text: "¿Qué significa CPU?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Control Panel Unit"], correctAnswer: "Central Processing Unit" },
      { id: "cc-e-4", text: "¿Qué es un bit?", options: ["Un byte grande", "Unidad mínima de información", "Un archivo", "Un procesador"], correctAnswer: "Unidad mínima de información" },
      { id: "cc-e-5", text: "¿Qué sistema es numérico base 2?", options: ["Decimal", "Octal", "Binario", "Hexadecimal"], correctAnswer: "Binario" },
    ],
    "Intermedio": [
      { id: "cc-m-1", text: "¿Qué estructura de datos es LIFO?", options: ["Cola (Queue)", "Pila (Stack)", "Árbol", "Grafo"], correctAnswer: "Pila (Stack)" },
      { id: "cc-m-2", text: "¿Qué es la complejidad Big O?", options: ["Tamaño del archivo", "Medida de eficiencia de un algoritmo", "Un error grande", "Un patrón de diseño"], correctAnswer: "Medida de eficiencia de un algoritmo" },
      { id: "cc-m-3", text: "¿Qué es la recursividad?", options: ["Un bucle infinito", "Una función que se llama a sí misma", "Un error de compilación", "Una base de datos"], correctAnswer: "Una función que se llama a sí misma" },
      { id: "cc-m-4", text: "¿Qué es un puntero?", options: ["Un cursor", "Variable que almacena una dirección de memoria", "Un botón", "Un tipo de error"], correctAnswer: "Variable que almacena una dirección de memoria" },
      { id: "cc-m-5", text: "¿Diferencia entre TCP y UDP?", options: ["Color del cable", "Conexión fiable vs no fiable", "Windows vs Linux", "Nube vs Local"], correctAnswer: "Conexión fiable vs no fiable" },
    ],
    "Difícil": [
      { id: "cc-h-1", text: "¿Qué problema es NP-Completo?", options: ["Suma de dos números", "Problema del viajante (TSP)", "Ordenar un array", "Buscar en un hash"], correctAnswer: "Problema del viajante (TSP)" },
      { id: "cc-h-2", text: "¿Qué es un deadlock?", options: ["Un juego", "Bloqueo mutuo entre procesos", "Un virus mortal", "Un sistema apagado"], correctAnswer: "Bloqueo mutuo entre procesos" },
      { id: "cc-h-3", text: "¿Qué hace un compilador JIT?", options: ["Compila todo antes de ejecutar", "Compila durante la ejecución", "No compila nada", "Elimina errores"], correctAnswer: "Compila durante la ejecución" },
      { id: "cc-h-4", text: "¿Qué es el Teorema CAP?", options: ["Consistencia, Disponibilidad, Tolerancia a particiones", "Calidad, Accesibilidad, Precio", "Control, Acceso, Privacidad", "Ninguna"], correctAnswer: "Consistencia, Disponibilidad, Tolerancia a particiones" },
      { id: "cc-h-5", text: "¿Qué es un Hash Map?", options: ["Un mapa geográfico", "Estructura clave-valor eficiente", "Un array ordenado", "Un árbol binario"], correctAnswer: "Estructura clave-valor eficiente" },
    ]
  },
  // Fallback para otras carreras (o puedes agregar las demás aquí)
  "Diseño UX/UI": {
    "Fácil": [
        { id: "ux-e-1", text: "¿Qué significa UX?", options: ["User Xenon", "User Experience", "Ultra Xylophone", "Unit X"], correctAnswer: "User Experience" },
        { id: "ux-e-2", text: "¿Qué es un Wireframe?", options: ["Un marco de alambre", "Un esquema visual de baja fidelidad", "Un código final", "Un video"], correctAnswer: "Un esquema visual de baja fidelidad" },
        { id: "ux-e-3", text: "¿Color primario en RGB?", options: ["Amarillo", "Verde", "Cian", "Magenta"], correctAnswer: "Verde" },
        { id: "ux-e-4", text: "¿Herramienta popular de diseño?", options: ["Excel", "Figma", "Notepad", "Calculator"], correctAnswer: "Figma" },
        { id: "ux-e-5", text: "¿Qué significa UI?", options: ["User Interface", "User Interaction", "Unique Identity", "Ultra Internet"], correctAnswer: "User Interface" },
    ],
    "Intermedio": [
        { id: "ux-m-1", text: "¿Qué es la Jerarquía Visual?", options: ["Organizar elementos por importancia", "Usar muchos colores", "Hacer todo grande", "Usar solo texto"], correctAnswer: "Organizar elementos por importancia" },
        { id: "ux-m-2", text: "¿Qué es un Mapa de Calor?", options: ["Temperatura del PC", "Representación de interacción del usuario", "Un filtro de Instagram", "Un error de diseño"], correctAnswer: "Representación de interacción del usuario" },
        { id: "ux-m-3", text: "¿Ley de Jakob?", options: ["Los usuarios prefieren sitios similares a los que conocen", "El diseño debe ser bonito", "Menos es más", "El color rojo es malo"], correctAnswer: "Los usuarios prefieren sitios similares a los que conocen" },
        { id: "ux-m-4", text: "¿Qué es A/B Testing?", options: ["Probar dos versiones para ver cuál funciona mejor", "Probar el alfabeto", "Test de sangre", "Ninguna"], correctAnswer: "Probar dos versiones para ver cuál funciona mejor" },
        { id: "ux-m-5", text: "¿Qué es la Accesibilidad Web?", options: ["Internet gratis", "Diseño utilizable por personas con discapacidades", "WiFi rápido", "Colores brillantes"], correctAnswer: "Diseño utilizable por personas con discapacidades" },
    ],
    "Difícil": [
        { id: "ux-h-1", text: "¿Qué es el Skeuomorfismo?", options: ["Diseño plano", "Imitar objetos del mundo real", "Diseño futurista", "Diseño abstracto"], correctAnswer: "Imitar objetos del mundo real" },
        { id: "ux-h-2", text: "¿Ley de Fitts?", options: ["Tiempo para alcanzar un objetivo depende de distancia y tamaño", "Todo entra por los ojos", "El usuario siempre tiene la razón", "No usar Comic Sans"], correctAnswer: "Tiempo para alcanzar un objetivo depende de distancia y tamaño" },
        { id: "ux-h-3", text: "¿Qué es un Design System?", options: ["Un software", "Colección de componentes y reglas reutilizables", "Un sistema operativo", "Un logo"], correctAnswer: "Colección de componentes y reglas reutilizables" },
        { id: "ux-h-4", text: "¿Heurísticas de Nielsen?", options: ["10 principios de usabilidad", "Reglas de color", "Tipos de fuente", "Leyes de marketing"], correctAnswer: "10 principios de usabilidad" },
        { id: "ux-h-5", text: "¿Qué es el Efecto Von Restorff?", options: ["El elemento diferente se recuerda más", "Todo se olvida", "El azul calma", "La gente no lee"], correctAnswer: "El elemento diferente se recuerda más" },
    ]
  }
};

export const getQuestions = (career: string, difficulty: Difficulty): Question[] => {
  // Si la carrera no existe, devolvemos preguntas genéricas de Ciencias de la Computación
  const careerData = QUESTION_BANK[career] || QUESTION_BANK["Ciencias de la Computación"];
  return careerData[difficulty];
};