// src/pages/CategoryPage.jsx
import { CATEGORIES } from '../data/store';
import { getSectionsForPage } from '../utils/productUtils';
import ProductCard from '../components/product/ProductCard';

export default function CategoryPage({ page, onNavigate, onOpenProduct }) {
  const { category, subcategory, type } = page;
  const cat = CATEGORIES[category];

  if (!cat) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-amber-700">Categoría no encontrada.</p>
      </div>
    );
  }

  const sections = getSectionsForPage({ category, subcategory, type });

  // Título de la página
  let pageTitle = cat.label;
  if (subcategory && cat.subcategories?.[subcategory]) {
    pageTitle = cat.subcategories[subcategory].label;
  }
  if (type) {
    const typesSource = subcategory ? cat.subcategories?.[subcategory]?.types : cat.types;
    if (typesSource?.[type]) pageTitle = typesSource[type].label;
  }

  // Subnav: mostrar subcategorías o tipos disponibles para navegar
  const renderSubnav = () => {
    // Si estamos en categoría sin subcategory y existen subcategorías
    if (!subcategory && !type && cat.subcategories) {
      return (
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(cat.subcategories).map(([key, sub]) => (
            <button
              key={key}
              onClick={() => onNavigate({ view: 'category', category, subcategory: key })}
              className="px-4 py-2 rounded-full border border-amber-200 text-amber-800 hover:bg-amber-100 font-medium text-sm transition-colors"
            >
              {sub.label}
            </button>
          ))}
        </div>
      );
    }

    // Si estamos en subcategory "especialidad" sin type, mostrar tipos
    if (subcategory && !type && cat.subcategories?.[subcategory]?.types) {
      const types = cat.subcategories[subcategory].types;
      return (
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(types).map(([key, t]) => (
            <button
              key={key}
              onClick={() =>
                onNavigate({ view: 'category', category, subcategory, type: key })
              }
              className="px-4 py-2 rounded-full border border-amber-200 text-amber-800 hover:bg-amber-100 font-medium text-sm transition-colors"
            >
              {t.label}
            </button>
          ))}
        </div>
      );
    }

    // Pasteles: categoría sin subcategorías pero con types directos
    if (!type && cat.types && !subcategory) {
      return (
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(cat.types).map(([key, t]) => (
            <button
              key={key}
              onClick={() => onNavigate({ view: 'category', category, type: key })}
              className="px-4 py-2 rounded-full border border-amber-200 text-amber-800 hover:bg-amber-100 font-medium text-sm transition-colors"
            >
              {t.label}
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">{pageTitle}</h1>

      {renderSubnav()}

      {sections.length === 0 || sections.every((s) => s.products.length === 0) ? (
        <p className="text-amber-700/80 py-8 text-center">
          No hay productos disponibles en esta sección por el momento.
        </p>
      ) : (
        sections.map((section, idx) => {
          if (section.products.length === 0) return null;
          return (
            <div key={idx} className="mb-10">
              {section.title && (
                <h2 className="text-xl font-semibold text-amber-900 mb-4">
                  {section.title}
                </h2>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {section.products.map((product) => (
                  <ProductCard key={product.id} product={product} onOpen={onOpenProduct} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
