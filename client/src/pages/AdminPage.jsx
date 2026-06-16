// client/src/pages/AdminPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/store'; // Ya no importamos PRODUCTS local
import ProductForm from '../components/admin/ProductForm';
import DiscontinuedList from '../components/admin/DiscontinuedList';

export default function AdminPage({ products, onFetchProducts, onNavigate }) {
  // Extraemos el token JWT real y la función logout del contexto
  const { token, logout } = useAuth();
  const [tab, setTab] = useState('add'); // 'add' | 'list' | 'discontinued'
  const [editingProduct, setEditingProduct] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Filtramos los productos que vienen vivos desde la base de datos a través de App.jsx
  const activeProducts = products.filter((p) => p.status === 'active');
  const discontinuedProducts = products.filter((p) => p.status === 'discontinued');

  // 1. FUNCIÓN PARA AGREGAR O EDITAR UN PRODUCTO EN MYSQL
  const handleAddOrEdit = async (formData) => {
    try {
      if (editingProduct) {
        // MODO EDICIÓN: Petición PUT a /api/products/:id
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Enviamos el Token JWT de seguridad
          },
          body: JSON.stringify({ 
            ...editingProduct, 
            ...formData, 
            status: 'active' 
          })
        });

        if (res.ok) {
          setFeedback('Producto actualizado correctamente en la base de datos.');
          setEditingProduct(null);
          onFetchProducts(); // Le pedimos a App.jsx que vuelva a consultar la BD
          setTab('list');    // Redirigimos a la lista para ver el cambio
        } else {
          const err = await res.json();
          setFeedback(`Error: ${err.error || 'No se pudo actualizar.'}`);
        }
      } else {
        // MODO NUEVO PRODUCTO: Petición POST a /api/products
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        if (res.ok) {
          setFeedback('Producto agregado correctamente a la base de datos.');
          onFetchProducts(); // Refrescamos el catálogo global
          setTab('list');    // Redirigimos a la lista para ver el nuevo pan
        } else {
          const err = await res.json();
          setFeedback(`Error: ${err.error || 'No se pudo guardar.'}`);
        }
      }
    } catch (error) {
      console.error(error);
      setFeedback('Error de conexión con el servidor backend.');
    }
    setTimeout(() => setFeedback(''), 4000);
  };

// 2. FUNCIÓN PARA REACTIVAR PANES FUERA DE TEMPORADA (CORREGIDA)
  const handleReactivate = async (productId, assignment) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    try {
      // CORRECCIÓN: Usamos productId en lugar de editingProduct.id
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...targetProduct,
          ...assignment, 
          status: 'active'
        })
      });

      if (res.ok) {
        setFeedback('Producto activado y asignado correctamente.');
        onFetchProducts();
        setTab('list');
      } else {
        const err = await res.json();
        setFeedback(`Error: ${err.error}`);
      }
    } catch (error) {
      console.error(error);
      setFeedback('Error al reactivar el producto.');
    }
    setTimeout(() => setFeedback(''), 4000);
  };

  // 3. FUNCIÓN PARA MANDAR UN PAN A "FUERA DE TEMPORADA" (CORREGIDA)
  const handleDiscontinue = async (productId) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    try {
      // CORRECCIÓN: Usamos productId en lugar de editingProduct.id
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...targetProduct,
          status: 'discontinued',
          category: null, 
          subcategory: null,
          type: null
        })
      });

      if (res.ok) {
        setFeedback('Producto movido a la sección de fuera de temporada.');
        onFetchProducts();
      } else {
        const err = await res.json();
        setFeedback(`Error: ${err.error}`);
      }
    } catch (error) {
      console.error(error);
      setFeedback('Error al descontinuar el producto.');
    }
    setTimeout(() => setFeedback(''), 4000);
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
              No hay productos activos en la base de datos. ¡Prueba agregando uno!
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
                  ${Number(product.price).toFixed(2)} MXN
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