export interface Course {
  id: string;
  title: string;
  difficulty: string;
  imageUrl: string;
  status: 'available' | 'unavailable';
  relatedCareers: string[];
}

export const courses: Course[] = [
  // --- Ingeniería de Sistema Empresarial (ISE) - 6 Cursos ---
  {
    id: 'c1',
    title: 'Gestión de la Cadena de Suministro (SCM) Digital',
    difficulty: 'Avanzado',
    imageUrl: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Ingenieria de Gestión Empresarial', 'Ingeniería Industrial', 'Administración']
  },
  {
    id: 'c4',
    title: 'Implementación de ERP con SAP S/4HANA',
    difficulty: 'Avanzado',
    imageUrl: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Ingenieria de Gestión Empresarial', 'Ciencias de la Computación']
  },
  {
    id: 'c5',
    title: 'Modelado de Procesos de Negocio (BPM) con BPMN',
    difficulty: 'Intermedio',
    imageUrl: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Ingenieria de Gestión Empresarial', 'Análisis de Datos e Inteligencia Artificial']
  },
  {
    id: 'c6',
    title: 'Auditoría de Sistemas de Información (ISO 27001)',
    difficulty: 'Intermedio',
    imageUrl: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Ingenieria de Gestión Empresarial', 'Ciencias de la Computación']
  },
  {
    id: 'c7',
    title: 'Fundamentos de Contabilidad y Finanzas para IS',
    difficulty: 'Principiante',
    imageUrl: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Ingenieria de Gestión Empresarial', 'Administración']
  },
  {
    id: 'c8',
    title: 'Business Intelligence con Power BI y SQL',
    difficulty: 'Intermedio',
    imageUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Ingenieria de Gestión Empresarial', 'Análisis de Datos e Inteligencia Artificial']
  },
  
  // --- Ciencias de la Computación (CC) - 6 Cursos ---
  {
    id: 'c9',
    title: 'Algoritmos y Estructuras de Datos Avanzadas',
    difficulty: 'Difícil',
    imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Ciencias de la Computación', 'Ingenieria de Gestión Empresarial', 'Análisis de Datos e Inteligencia Artificial']
  },
  {
    id: 'c10',
    title: 'Programación Funcional y Lógica con Haskell',
    difficulty: 'Difícil',
    imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Ciencias de la Computación']
  },
  {
    id: 'c11',
    title: 'Arquitectura de Microservicios con Docker y Kubernetes',
    difficulty: 'Avanzado',
    imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Ciencias de la Computación', 'Ingenieria de Gestión Empresarial']
  },
  {
    id: 'c12',
    title: 'Introducción a la Ciberseguridad y Ethical Hacking',
    difficulty: 'Principiante',
    imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Ciencias de la Computación', 'Ingenieria de Gestión Empresarial']
  },
  {
    id: 'c13',
    title: 'Desarrollo de Videojuegos 3D con Unity y C#',
    difficulty: 'Intermedio',
    imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Ciencias de la Computación', 'Diseño UX/UI']
  },
  {
    id: 'c14',
    title: 'Sistemas Operativos, Hilos y Concurrencia',
    difficulty: 'Intermedio',
    imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Ciencias de la Computación']
  },

  // --- Diseño UX/UI - 6 Cursos ---
  {
    id: 'c15',
    title: 'Design Thinking y Metodologías Ágiles para Diseño',
    difficulty: 'Intermedio',
    imageUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Diseño UX/UI', 'Marketing Digital Avanzado']
  },
  {
    id: 'c16',
    title: 'Prototipado de Alta Fidelidad y Animación en Figma',
    difficulty: 'Avanzado',
    imageUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Diseño UX/UI']
  },
  {
    id: 'c17',
    title: 'Fundamentos de Psicología del Consumidor y UX',
    difficulty: 'Principiante',
    imageUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Diseño UX/UI', 'Marketing Digital Avanzado']
  },
  {
    id: 'c18',
    title: 'Diseño de Interacción (IxD) y Patrones de Usabilidad',
    difficulty: 'Intermedio',
    imageUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Diseño UX/UI', 'Ciencias de la Computación']
  },
  {
    id: 'c19',
    title: 'Accesibilidad Web (WCAG) y Diseño Inclusivo',
    difficulty: 'Avanzado',
    imageUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Diseño UX/UI', 'Ciencias de la Computación']
  },
  {
    id: 'c20',
    title: 'Investigación de Usuarios, Pruebas y A/B Testing',
    difficulty: 'Intermedio',
    imageUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Diseño UX/UI', 'Análisis de Datos e Inteligencia Artificial']
  },

  // --- Marketing Digital Avanzado (MD) - 6 Cursos ---
  {
    id: 'c21',
    title: 'SEO Avanzado y Estrategias de Contenido de Alto Impacto',
    difficulty: 'Avanzado',
    imageUrl: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Marketing Digital Avanzado']
  },
  {
    id: 'c22',
    title: 'Publicidad Pagada en Redes Sociales (Meta Ads & TikTok)',
    difficulty: 'Intermedio',
    imageUrl: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Marketing Digital Avanzado']
  },
  {
    id: 'c23',
    title: 'E-commerce: Estrategia y Plataformas de Venta Online',
    difficulty: 'Principiante',
    imageUrl: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Marketing Digital Avanzado', 'Ingenieria de Gestión Empresarial']
  },
  {
    id: 'c24',
    title: 'Email Marketing y Automatización (HubSpot, Mailchimp)',
    difficulty: 'Intermedio',
    imageUrl: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Marketing Digital Avanzado']
  },
  {
    id: 'c25',
    title: 'Analítica Web y Funnels con Google Analytics 4',
    difficulty: 'Avanzado',
    imageUrl: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Marketing Digital Avanzado', 'Análisis de Datos e Inteligencia Artificial']
  },
  {
    id: 'c26',
    title: 'Creación de Marca, Identidad y Storytelling',
    difficulty: 'Principiante',
    imageUrl: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Marketing Digital Avanzado', 'Diseño UX/UI']
  },

  // --- Análisis de Datos e Inteligencia Artificial (AI) - 6 Cursos ---
  {
    id: 'c27',
    title: 'Machine Learning con Python, Scikit-learn y MLOps',
    difficulty: 'Avanzado',
    imageUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Análisis de Datos e Inteligencia Artificial', 'Ciencias de la Computación']
  },
  {
    id: 'c28',
    title: 'Procesamiento de Lenguaje Natural (NLP) con Transformers',
    difficulty: 'Difícil',
    imageUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Análisis de Datos e Inteligencia Artificial', 'Ciencias de la Computación']
  },
  {
    id: 'c29',
    title: 'Big Data: Fundamentos y Gestión con Hadoop y Spark',
    difficulty: 'Difícil',
    imageUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Análisis de Datos e Inteligencia Artificial', 'Ingenieria de Gestión Empresarial']
  },
  {
    id: 'c30',
    title: 'Introducción a Redes Neuronales y Deep Learning con PyTorch',
    difficulty: 'Intermedio',
    imageUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Análisis de Datos e Inteligencia Artificial', 'Ciencias de la Computación']
  },
  {
    id: 'c31',
    title: 'Ética, Regulación y Sesgos en la Inteligencia Artificial',
    difficulty: 'Principiante',
    imageUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Análisis de Datos e Inteligencia Artificial', 'Ingenieria de Gestión Empresarial']
  },
  {
    id: 'c32',
    title: 'Visualización de Datos Avanzada con Tableau',
    difficulty: 'Intermedio',
    imageUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'available',
    relatedCareers: ['Análisis de Datos e Inteligencia Artificial', 'Diseño UX/UI']
  }
];