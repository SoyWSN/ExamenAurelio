// src/components/HeroBanner.jsx
import { useState, useEffect } from 'react';
import { HERO_IMAGES } from '../data/store';

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden bg-amber-100">
      {HERO_IMAGES.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 bg-gradient-to-br from-amber-300 to-amber-600 ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-3xl sm:text-5xl font-bold mb-3 drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-lg sm:text-xl drop-shadow-lg">{slide.subtitle}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-10">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Ir a slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              idx === current ? 'w-8 bg-white' : 'w-2.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
