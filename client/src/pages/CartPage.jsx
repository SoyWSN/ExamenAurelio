// src/pages/CartPage.jsx
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function CartPage({ onNavigate }) {
  // Mantener tus métodos y variables originales exactamente igual
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [copied, setCopied] = useState(false);

  // CONFIGURACIÓN DE CONTACTO:
  // Cambia este número por el de tu hermano (con código de país, sin espacios ni el signo '+'. Ejemplo: 521234567890 para México)
  const WHATSAPP_PHONE = "526531640838"; 
  const INSTAGRAM_USER = "casaamarillapostres";

// 1. FUNCIÓN PARA GENERAR EL TEXTO ESTRUCTURADO (Puros Bullet Points)
  const generarTextoPedido = () => {
    let mensaje = "Hola, La Casa Amarilla. Me gustaría realizar el siguiente pedido desde el sitio web:\n\n";
    
    // Recorremos los items del carrito[cite: 1]
    items.forEach(({ product, quantity }) => {
      mensaje += `• ${quantity}x ${product.name} ($${(product.price * quantity).toFixed(2)} MXN)\n`;
    });

    mensaje += `\nTotal estimado: $${totalPrice.toFixed(2)} MXN\n\n`;
    mensaje += "Quedo al pendiente de su confirmación. ¡Muchas gracias!";
    return mensaje;
  };

  // 2. ACCIÓN: ENVIAR POR WHATSAPP (Endpoint API Oficial)
  const handleWhatsAppOrder = () => {
    const texto = generarTextoPedido();
    const urlUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(texto)}`;
    window.open(urlUrl, '_blank');
  };

  // 3. ACCIÓN: COPIAR Y ABRIR INSTAGRAM
  const handleInstagramOrder = async () => {
    const texto = generarTextoPedido();
    try {
      await navigator.clipboard.writeText(texto); // Copia el texto al portapapeles
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      
      // Abre el perfil del negocio
      setTimeout(() => {
        window.open(`https://instagram.com/${INSTAGRAM_USER}`, '_blank');
      }, 1200);
    } catch (err) {
      console.error("No se pudo copiar el texto automáticamente", err);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-amber-900 mb-4">Carrito de compras</h1>
        <p className="text-amber-700/80 mb-6">Tu carrito está vacío.</p>
        <button
          onClick={() => onNavigate({ view: 'home' })}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
        >
          Ver productos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Carrito de compras</h1>

      {/* Lista original de tus productos */}
      <div className="flex flex-col gap-4 mb-8">
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex items-center gap-4 bg-white border border-amber-100 rounded-xl p-4 shadow-sm"
          >
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-amber-50 flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect width="80" height="80" fill="%23fef3c7"/%3E%3C/svg%3E';
                }}
              />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">{product.name}</h3>
              <p className="text-sm text-amber-700/80 line-clamp-1">{product.description}</p>
              <span className="text-amber-600 font-bold">
                ${product.price.toFixed(2)} MXN
              </span>
            </div>

            <div className="flex items-center border border-amber-200 rounded-lg">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="px-2.5 py-1 text-amber-900 hover:bg-amber-50 font-bold"
              >
                −
              </button>
              <span className="px-3 py-1 font-semibold text-amber-900">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="px-2.5 py-1 text-amber-900 hover:bg-amber-50 font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeFromCart(product.id)}
              className="text-amber-400 hover:text-red-500 transition-colors"
              aria-label="Eliminar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Tu contenedor original del Total Estimado */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex justify-between items-center mb-6">
        <span className="text-lg font-semibold text-amber-900">Total estimado</span>
        <span className="text-2xl font-bold text-amber-600">
          ${totalPrice.toFixed(2)} MXN
        </span>
      </div>

      {/* NUEVA SECCIÓN DE BOTONES: Integrados con estilo minimalista */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {/* Enviar a WhatsApp */}
        <button
          onClick={handleWhatsAppOrder}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-sm transition-colors text-center"
        >
          <span className="text-lg">💬</span> Enviar pedido por WhatsApp
        </button>

        {/* Copiar y abrir Instagram */}
        <button
          onClick={handleInstagramOrder}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-sm transition-colors text-center"
        >
          <span className="text-lg">📸</span> 
          {copied ? "¡Copiado! Abriendo Instagram..." : "Copiar pedido e ir a Instagram"}
        </button>
      </div>

      <p className="text-sm text-amber-700/60 mt-4 text-center">
        El mensaje se abrirá en la app de destino para que puedas agregar notas adicionales (como la fecha de entrega) antes de enviarlo.
      </p>
    </div>
  );
}