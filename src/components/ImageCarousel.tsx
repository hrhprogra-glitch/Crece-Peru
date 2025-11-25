import React, { useState, useEffect } from 'react';

const images = [
  {
    url: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

const ImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Cambia la imagen cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const currentImage = images[currentIndex];

  return (
    <div className="relative h-full overflow-hidden hidden lg:block">
      {/* Imagen de fondo con transición de fundido */}
      {images.map((img, index) => (
        <img
          key={index}
          src={img.url}
          alt={img.caption}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Overlay de degradado oscuro para mejorar la legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/10"></div>

      {/* Contenido superpuesto */}
      <div className="absolute bottom-0 left-0 p-8 text-white z-10">
        <h3 className="text-4xl font-extrabold mb-2 leading-tight drop-shadow-lg">
          {currentImage.caption}
        </h3>
        <p className="text-textSecondary text-lg drop-shadow-md">
        </p>
        
        {/* Indicadores de carrusel */}
        <div className="flex space-x-2 mt-4">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-primary w-6' : 'bg-textSecondary/50'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
