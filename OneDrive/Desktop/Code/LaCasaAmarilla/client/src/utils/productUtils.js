// src/utils/productUtils.js
import { PRODUCTS, CATEGORIES } from '../data/store';

// Devuelve productos activos que coinciden con category/subcategory
export function getProductsByPage({ category, subcategory }) {
  return PRODUCTS.filter((p) => {
    if (p.status !== 'active') return false;
    if (p.category !== category) return false;
    if (subcategory !== undefined && p.subcategory !== subcategory) return false;
    return true;
  });
}

// Devuelve productos descontinuados / fuera de temporada (para admin)
export function getDiscontinuedProducts() {
  return PRODUCTS.filter((p) => p.status === 'discontinued');
}

// Construye la lista de "secciones" a mostrar para una categoría/subcategoría dada.
export function getSectionsForPage({ category, subcategory }) {
  const cat = CATEGORIES[category];
  if (!cat) return [];

  // 1. Si hay una subcategoría seleccionada activa (ej. "De Especialidad")
  if (subcategory) {
    const subcat = cat.subcategories?.[subcategory];
    if (!subcat) return [];

    const products = getProductsByPage({ category, subcategory });
    return [{ title: null, products }];
  }

  // 2. Si no hay subcategoría activa pero la categoría tiene subcategorías (ej. Roles de Canela)
  if (cat.subcategories) {
    return Object.entries(cat.subcategories).map(([subKey, subData]) => {
      const products = getProductsByPage({ category, subcategory: subKey });
      return { title: subData.label, products };
    });
  }

  // 3. Categorías directas sin subcategorías (ej. Pasteles)
  return [{ title: null, products: getProductsByPage({ category }) }];
}