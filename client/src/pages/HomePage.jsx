// src/pages/HomePage.jsx
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/product/ProductCard';
import { CATEGORIES } from '../data/store'; // Eliminamos la importación de PRODUCTS falso

export default function HomePage({ products = [], onNavigate, onOpenProduct }) {
  // DINÁMICO: Filtramos los productos reales activos directamente de tu base de datos MySQL
  // Tomamos los primeros 8 para mostrarlos en la sección de "Destacados"
  const featured = products.filter((p) => p.status === 'active').slice(0, 8);

  return (
    <div className="bg-gradient-to-b from-amber-50/30 to-white min-h-screen">
      {/* Banner Principal con imágenes ilustrativas */}
      <HeroBanner />

      {/* Sección: Categorías principales */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-amber-950 tracking-tight">
            Nuestras especialidades
          </h2>
          <p className="mt-2 text-sm text-amber-800/60 max-w-md mx-auto">
             Horneado diariamente con ingredientes seleccionados de la más alta calidad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => onNavigate({ view: 'category', category: key })}
              className="group bg-white border border-amber-100/80 rounded-2xl p-8 text-center shadow-sm hover:shadow-md hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 ease-out relative overflow-hidden"
            >
              {/* Detalle visual: Un sutil fondo amarillo que brilla al pasar el cursor */}
              <div className="absolute inset-0 bg-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <span className="text-4xl mb-3 block transform group-hover:scale-110 transition-transform duration-300">
                {key === 'conchas-gourmet' ? '🥐' : key === 'roles-canela' ? '🌀' : '🎂'}
              </span>
              
              <h3 className="text-lg font-bold text-amber-950 group-hover:text-amber-800 transition-colors">
                {cat.label}
              </h3>
              <span className="text-xs font-medium text-amber-700/50 mt-1 block group-hover:text-amber-700/80 transition-colors">
                Ver catálogo →
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Sección: Productos destacados */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-amber-950 tracking-tight">
            Los favoritos de la casa
          </h2>
          <div className="w-12 h-1 bg-amber-400 mx-auto mt-3 rounded-full" />
        </div>

        {/* Controlamos si la base de datos no tiene productos aún */}
        {featured.length === 0 ? (
          <div className="bg-amber-50/50 border border-dashed border-amber-200/60 rounded-2xl py-12 text-center max-w-lg mx-auto">
            <p className="text-amber-800/60 text-sm">
              Estamos preparando nuestras vitrinas. <br />
              ¡Visita nuestro panel de administración para añadir las delicias del día!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((product) => (
              <div 
                key={product.id} 
                className="hover:-translate-y-1 transition-transform duration-300"
              >
                <ProductCard product={product} onOpen={onOpenProduct} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}