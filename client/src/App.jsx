// client/src/App.jsx
import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Breadcrumb from './components/Breadcrumb';
import ProductModal from './components/product/ProductModal';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';

function AppContent() {
  const [page, setPage] = useState({ view: 'home' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isAuthenticated } = useAuth();
  
  // ESTADO GLOBAL: Aquí se guardarán los productos traídos de MySQL
  const [products, setProducts] = useState([]);

  // Función para consultar los productos al backend
// Dentro de client/src/App.jsx

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      
      // CORRECCIÓN: Mapeamos los productos y transformamos el precio de String a Número automáticamente
      const productosNormalizados = data.map(producto => ({
        ...producto,
        price: Number(producto.price) // Convierte "350.00" en 350
      }));

      setProducts(productosNormalizados);
    } catch (error) {
      console.error("Error al conectar con la API de productos:", error);
    }
  };

  // Se ejecuta automáticamente una sola vez al cargar la aplicación
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleNavigate = (target) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (page.view) {
      case 'home':
        return <HomePage products={products} onNavigate={handleNavigate} onOpenProduct={setSelectedProduct} />;

      case 'category':
        return (
          <CategoryPage
            page={page}
            products={products} // Pasamos los productos de la BD
            onNavigate={handleNavigate}
            onOpenProduct={setSelectedProduct}
          />
        );

      case 'cart':
        return <CartPage onNavigate={handleNavigate} />;

      case 'login':
        if (isAuthenticated) {
          return <AdminPage products={products} onFetchProducts={fetchProducts} onNavigate={handleNavigate} />;
        }
        return <LoginPage onNavigate={handleNavigate} />;

      case 'admin':
        if (!isAuthenticated) {
          return <LoginPage onNavigate={handleNavigate} />;
        }
        return <AdminPage products={products} onFetchProducts={fetchProducts} onNavigate={handleNavigate} />;

      default:
        return <NotFound onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={page} onNavigate={handleNavigate} />
      <Breadcrumb page={page} onNavigate={handleNavigate} />
      <main className="flex-1">{renderPage()}</main>
      <Footer />

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}