// src/App.jsx
import { useState } from 'react';
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

// Sistema de navegación basado en estado (sin React Router), igual que PetZone.
// "page" describe la vista actual: { view, category?, subcategory?, type? }

function AppContent() {
  const [page, setPage] = useState({ view: 'home' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isAuthenticated } = useAuth();

  const handleNavigate = (target) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (page.view) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onOpenProduct={setSelectedProduct} />;

      case 'category':
        return (
          <CategoryPage
            page={page}
            onNavigate={handleNavigate}
            onOpenProduct={setSelectedProduct}
          />
        );

      case 'cart':
        return <CartPage onNavigate={handleNavigate} />;

      case 'login':
        if (isAuthenticated) {
          return <AdminPage onNavigate={handleNavigate} />;
        }
        return <LoginPage onNavigate={handleNavigate} />;

      case 'admin':
        if (!isAuthenticated) {
          return <LoginPage onNavigate={handleNavigate} />;
        }
        return <AdminPage onNavigate={handleNavigate} />;

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