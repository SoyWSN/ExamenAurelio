// src/pages/HomePage.jsx
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/product/ProductCard';
import { CATEGORIES, PRODUCTS } from '../data/store';

export default function HomePage({ onNavigate, onOpenProduct }) {
  // Productos destacados: tomamos 1-2 de cada categoría principal como ejemplo
  const featured = PRODUCTS.filter((p) => p.status === 'active').slice(0, 8);

  return (
    <div>
      <HeroBanner />

      {/* Categorías principales */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">
          Nuestras categorías
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => onNavigate({ view: 'category', category: key })}
              className="bg-white border border-amber-100 rounded-xl p-8 text-center shadow-sm hover:shadow-md hover:border-amber-300 transition-all"
            >
              <span className="text-3xl mb-2 block">
                {key === 'conchas-gourmet' ? '🥐' : key === 'roles-canela' ? '🌀' : '🎂'}
              </span>
              <h3 className="text-lg font-semibold text-amber-900">{cat.label}</h3>
            </button>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-16">
        <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">
          Productos destacados
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={onOpenProduct} />
          ))}
        </div>
      </section>
    </div>
  );
}
