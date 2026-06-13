// src/utils/productUtils.js
import { PRODUCTS, CATEGORIES } from '../data/store';

// Devuelve productos activos que coinciden con category/subcategory/type
export function getProductsByPage({ category, subcategory, type }) {
  return PRODUCTS.filter((p) => {
    if (p.status !== 'active') return false;
    if (p.category !== category) return false;
    if (subcategory !== undefined && p.subcategory !== subcategory) return false;
    if (type !== undefined && p.type !== type) return false;
    return true;
  });
}

// Devuelve productos descontinuados / fuera de temporada (para admin)
export function getDiscontinuedProducts() {
  return PRODUCTS.filter((p) => p.status === 'discontinued');
}

// Construye la lista de "secciones" a mostrar para una categoría/subcategoría dada.
// Cada sección = { title, products }
export function getSectionsForPage({ category, subcategory, type }) {
  const cat = CATEGORIES[category];
  if (!cat) return [];

  // Si se especifica un "type" concreto, mostrar solo esa sección
  if (type) {
    const products = getProductsByPage({ category, subcategory, type });
    return [{ title: null, products }];
  }

  // Si hay subcategory pero sin type:
  if (subcategory) {
    const subcat = cat.subcategories?.[subcategory];
    if (!subcat) return [];

    // Si la subcategoría tiene "types" (especialidad), una sección por tipo
    if (subcat.types) {
      return Object.entries(subcat.types).map(([typeKey, typeData]) => ({
        title: typeData.label,
        products: getProductsByPage({ category, subcategory, type: typeKey }),
      }));
    }

    // Si no tiene types (tradicionales), una sola sección con productos directos
    const products = getProductsByPage({ category, subcategory, type: null });
    return [{ title: null, products }];
  }

  // Sin subcategory: la categoría tiene subcategorías propias (conchas/roles)
  if (cat.subcategories) {
    return Object.entries(cat.subcategories).map(([subKey, subData]) => {
      let products;
      if (subData.types) {
        products = PRODUCTS.filter(
          (p) =>
            p.status === 'active' &&
            p.category === category &&
            p.subcategory === subKey
        );
      } else {
        products = getProductsByPage({ category, subcategory: subKey, type: null });
      }
      return { title: subData.label, products };
    });
  }

  // Categoría sin subcategorías pero con "types" directos (pasteles)
  if (cat.types) {
    return Object.entries(cat.types).map(([typeKey, typeData]) => ({
      title: typeData.label,
      products: getProductsByPage({ category, subcategory: null, type: typeKey }),
    }));
  }

  return [{ title: null, products: getProductsByPage({ category }) }];
}
