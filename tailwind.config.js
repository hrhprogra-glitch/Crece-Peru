/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9E7FFF',
        secondary: '#38bdf8',
        accent: '#f472b6',
        background: '#171717',
        surface: '#262626',
        text: '#FFFFFF',
        textSecondary: '#A3A3A3',
        border: '#2F2F2F',
      },
      // Nueva función de tiempo para el giro de la ruleta
      transitionTimingFunction: {
        'ease-out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.4' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        // Keyframe corregido para el movimiento del robot: de centro-abajo (70%) a esquina inferior izquierda (90%)
        moveRobot: {
          '0%': { top: '70%', left: '50%', transform: 'translate(-50%, 0) scale(1)' },
          '100%': { top: '90%', left: '5%', transform: 'translate(0, 0) scale(1.1)' }, // Posición final: 90% abajo, 5% izquierda
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'pulse-slow': 'pulseSlow 10s infinite ease-in-out',
        'bounce-slow': 'bounceSlow 4s infinite ease-in-out',
        'move-robot': 'moveRobot 3s ease-in-out forwards 1', // Animación de 3 segundos, se ejecuta una vez
      },
    },
  },
  plugins: [],
}