// src/pages/AdminPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES } from '../data/store';
import ProductForm from '../components/admin/ProductForm';
import DiscontinuedList from '../components/admin/DiscontinuedList';

// NOTA: Este estado de productos es local/temporal (mock).
// Cuando exista el backend + MySQL, estas operaciones (agregar, editar,
// reactivar) deberán hacer fetch/POST/PUT a /api/products correspondientes,
// y la lista se cargará desde la base de datos en lugar de INITIAL_PRODUCTS.

let nextId = 9999;

export default function AdminPage({ onNavigate }) {
  const { logout } = useAuth();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [tab, setTab] = useState('add'); // 'add' | 'list' | 'discontinued'
  const [editingProduct, setEditingProduct] = useState(null);
  const [feedback, setFeedback] = useState('');

  const activeProducts = products.filter((p) => p.status === 'active');
  const discontinuedProducts = products.filter((p) => p.status === 'discontinued');

  const handleAddOrEdit = (formData) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id ? { ...p, ...formData, status: 'active' } : p
        )
      );
      setFeedback('Producto actualizado correctamente.');
      setEditingProduct(null);
    } else {
      const newProduct = {
        id: nextId++,
        ...formData,
        status: 'active',
      };
      setProducts((prev) => [...prev, newProduct]);
      setFeedback('Producto agregado correctamente.');
    }
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleReactivate = (productId, assignment) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, ...assignment, status: 'active' }
          : p
      )
    );
    setFeedback('Producto activado y asignado correctamente.');
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleDiscontinue = (productId) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, status: 'discontinued', category: null, subcategory: null, type: null }
          : p
      )
    );
  };

  const handleLogout = () => {
    logout();
    onNavigate({ view: 'home' });
  };

  const getCategoryLabel = (product) => {
    const cat = CATEGORIES[product.category];
    if (!cat) return '—';
    let label = cat.label;
    if (product.subcategory && cat.subcategories?.[product.subcategory]) {
      label += ` / ${cat.subcategories[product.subcategory].label}`;
    }
    if (product.type) {
      const typesSource = product.subcategory
        ? cat.subcategories?.[product.subcategory]?.types
        : cat.types;
      if (typesSource?.[product.type]) {
        label += ` / ${typesSource[product.type].label}`;
      }
    }
    return label;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-amber-900">Panel de Administrador</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-medium text-sm transition-colors"
        >
          Cerrar sesión
        </button>
      </div>

      {feedback && (
        <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
          {feedback}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-amber-200">
        {[
          { key: 'add', label: editingProduct ? 'Editar producto' : 'Agregar producto' },
          { key: 'list', label: `Productos activos (${activeProducts.length})` },
          { key: 'discontinued', label: `Fuera de temporada (${discontinuedProducts.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              if (t.key !== 'add') setEditingProduct(null);
            }}
            className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-colors ${
              tab === t.key
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-amber-700/70 hover:text-amber-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Agregar / Editar */}
      {tab === 'add' && (
        <div className="bg-white border border-amber-100 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-amber-900 mb-4">
            {editingProduct ? `Editando: ${editingProduct.name}` : 'Nuevo producto'}
          </h2>
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleAddOrEdit}
            onCancel={
              editingProduct
                ? () => {
                    setEditingProduct(null);
                  }
                : null
            }
          />
        </div>
      )}

      {/* Tab: Lista de productos activos */}
      {tab === 'list' && (
        <div className="flex flex-col gap-3">
          {activeProducts.length === 0 && (
            <p className="text-amber-700/70 text-center py-8">
              No hay productos activos.
            </p>
          )}
          {activeProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-amber-50 flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"%3E%3Crect width="56" height="56" fill="%23fef3c7"/%3E%3C/svg%3E';
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900">{product.name}</h3>
                <p className="text-xs text-amber-700/70">{getCategoryLabel(product)}</p>
                <span className="text-amber-600 font-bold text-sm">
                  ${product.price.toFixed(2)} MXN
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setTab('add');
                  }}
                  className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-sm font-medium transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDiscontinue(product.id)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Descontinuar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Descontinuados */}
      {tab === 'discontinued' && (
        <DiscontinuedList products={discontinuedProducts} onReactivate={handleReactivate} />
      )}
    </div>
  );
}
