// src/pages/NotFound.jsx

export default function NotFound({ onNavigate }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-bold text-amber-900 mb-4">404</h1>
      <p className="text-amber-700/80 mb-6">
        La página que buscas no existe o fue movida.
      </p>
      <button
        onClick={() => onNavigate({ view: 'home' })}
        className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
      >
        Volver al inicio
      </button>
    </div>
  );
}
