// src/components/Footer.jsx

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ backgroundColor: '#FBE4B0' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="font-semibold text-lg mb-1 text-amber-950">La Casa Amarilla</p>
        <p className="text-sm text-amber-900/80">
          Repostería y pastelería artesanal
        </p>
        <p className="text-xs text-amber-900/60 mt-4">
          © {new Date().getFullYear()} La Casa Amarilla. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}