// src/components/product/ProductModal.jsx
import { useState } from 'react';
import { useCart } from '../../context/CartContext';

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    // 1. Agrega el producto con la cantidad seleccionada al contexto global
    addToCart(product, quantity);
    
    // 2. Línea clave: Desmonta el modal de inmediato regresando al catálogo
    onClose(); 
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="aspect-square bg-amber-50 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23fef3c7"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23d97706"%3ELa Casa Amarilla%3C/text%3E%3C/svg%3E';
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-md"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-amber-900 mb-2">{product.name}</h2>
          <p className="text-amber-700/90 mb-4">{product.description}</p>
          <span className="text-2xl font-bold text-amber-600 block mb-5">
            ${product.price.toFixed(2)} MXN
          </span>

          {/* Quantity selector */}
          <div className="flex items-center gap-4 mb-5">
            <span className="text-amber-900 font-medium">Cantidad:</span>
            <div className="flex items-center border border-amber-200 rounded-lg">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 text-amber-900 hover:bg-amber-50 font-bold"
              >
                −
              </button>
              <span className="px-4 py-1.5 font-semibold text-amber-900">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1.5 text-amber-900 hover:bg-amber-50 font-bold"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="w-full py-3 rounded-lg font-semibold text-white transition-colors bg-amber-600 hover:bg-amber-700"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
