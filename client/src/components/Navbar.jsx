// src/components/Navbar.jsx
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { CATEGORIES } from '../data/store';

export default function Navbar({ currentPage, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();

  const handleNavigate = (page) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavigate({ view: 'home' })}
            className="flex items-center gap-2"
          >
            <img 
              src="/logo.png" 
              alt="La Casa Amarilla" 
              className="h-9 w-auto object-contain inline-block" 
            />
            <span className="text-xl font-bold text-amber-900 tracking-tight">
              La Casa Amarilla
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleNavigate({ view: 'home' })}
              className="text-amber-900 hover:text-amber-600 font-medium transition-colors"
            >
              Inicio
            </button>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => handleNavigate({ view: 'category', category: key })}
                className="text-amber-900 hover:text-amber-600 font-medium transition-colors"
              >
                {cat.label}
              </button>
            ))}
            <button
              onClick={() => handleNavigate({ view: 'login' })}
              className="text-amber-900 hover:text-amber-600 font-medium transition-colors"
            >
              Admin
            </button>
          </nav>

          {/* Right side: cart + hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavigate({ view: 'cart' })}
              className="relative p-2 text-amber-900 hover:text-amber-600 transition-colors"
              aria-label="Carrito"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-amber-900"
              aria-label="Menú"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden flex flex-col gap-1 pb-4">
            <button
              onClick={() => handleNavigate({ view: 'home' })}
              className="text-left px-2 py-2 rounded text-amber-900 hover:bg-amber-100 font-medium"
            >
              Inicio
            </button>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => handleNavigate({ view: 'category', category: key })}
                className="text-left px-2 py-2 rounded text-amber-900 hover:bg-amber-100 font-medium"
              >
                {cat.label}
              </button>
            ))}
            <button
              onClick={() => handleNavigate({ view: 'login' })}
              className="text-left px-2 py-2 rounded text-amber-900 hover:bg-amber-100 font-medium"
            >
              Admin
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}