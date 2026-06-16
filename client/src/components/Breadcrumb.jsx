// src/components/Breadcrumb.jsx
import { CATEGORIES } from '../data/store';

// page: { view, category, subcategory, type }
export default function Breadcrumb({ page, onNavigate }) {
  if (page.view !== 'category') return null;

  const { category, subcategory, type } = page;
  const cat = CATEGORIES[category];
  if (!cat) return null;

  const crumbs = [{ label: 'Inicio', target: { view: 'home' } }];

  crumbs.push({
    label: cat.label,
    target: { view: 'category', category },
  });

  if (subcategory && cat.subcategories?.[subcategory]) {
    crumbs.push({
      label: cat.subcategories[subcategory].label,
      target: { view: 'category', category, subcategory },
    });
  }

  if (type) {
    // El "type" puede colgar de subcategory (conchas/roles) o directo de category (pasteles)
    const typesSource = subcategory
      ? cat.subcategories?.[subcategory]?.types
      : cat.types;
    const typeLabel = typesSource?.[type]?.label;
    if (typeLabel) {
      crumbs.push({
        label: typeLabel,
        target: { view: 'category', category, subcategory, type },
      });
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <ol className="flex items-center flex-wrap gap-1 text-sm text-amber-800">
        {crumbs.map((crumb, idx) => (
          <li key={idx} className="flex items-center gap-1">
            {idx > 0 && <span className="text-amber-400">/</span>}
            {idx === crumbs.length - 1 ? (
              <span className="font-semibold text-amber-900">{crumb.label}</span>
            ) : (
              <button
                onClick={() => onNavigate(crumb.target)}
                className="hover:text-amber-600 hover:underline transition-colors"
              >
                {crumb.label}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
