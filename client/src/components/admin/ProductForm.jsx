// src/components/admin/ProductForm.jsx
import { useState, useEffect } from 'react';
import { CATEGORIES } from '../../data/store';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  image: '',
  category: '',
  subcategory: '',
};

export default function ProductForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price ?? '',
        image: initialData.image || '',
        category: initialData.category || '',
        subcategory: initialData.subcategory || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const selectedCategory = CATEGORIES[form.category];

  // Subcategorías disponibles según la categoría elegida
  const subcategoryOptions = selectedCategory?.subcategories
    ? Object.entries(selectedCategory.subcategories)
    : [];

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Resetear subcategoría al cambiar la categoría madre
      if (field === 'category') {
        next.subcategory = '';
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.category) {
      alert('Por favor completa al menos nombre, descripción, precio y categoría.');
      return;
    }

    if (parseFloat(form.price) < 0) {
      alert('El precio no puede ser un número negativo.');
      return;
    }

    onSubmit({
      ...form,
      price: parseFloat(form.price),
      subcategory: form.subcategory || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-amber-900 mb-1">Nombre</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-amber-900 mb-1">Descripción</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-amber-900 mb-1">Precio (MXN)</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => handleChange('price', e.target.value)}
            className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-amber-900 mb-1">
            Ruta de imagen
          </label>
          <input
            type="text"
            value={form.image}
            onChange={(e) => handleChange('image', e.target.value)}
            placeholder="/img/products/ejemplo.jpg"
            className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Ahora la cuadrícula es de 2 columnas ya que eliminamos "Tipo" */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-amber-900 mb-1">Categoría</label>
          <select
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Selecciona...</option>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-900 mb-1">
            Subcategoría
          </label>
          <select
            value={form.subcategory}
            onChange={(e) => handleChange('subcategory', e.target.value)}
            disabled={subcategoryOptions.length === 0}
            className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-amber-50"
          >
            <option value="">
              {subcategoryOptions.length === 0 ? 'No aplica' : 'Selecciona...'}
            </option>
            {subcategoryOptions.map(([key, sub]) => (
              <option key={key} value={key}>
                {sub.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          type="submit"
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
        >
          {initialData ? 'Guardar cambios' : 'Agregar producto'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}