// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// NOTA: Esto es un mock temporal. Cuando el backend (Node + JWT) esté listo,
// login() hará un fetch a /api/auth/login y guardará el token real
// (ej. en localStorage), y isAuthenticated dependerá de la validez de ese token.

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  const login = async (username, password) => {
    // TODO: reemplazar por fetch real al backend
    // const res = await fetch('/api/auth/login', { method: 'POST', ... })
    // Mock temporal de validación:
    if (username === 'admin' && password === 'admin123') {
      const fakeToken = 'mock-jwt-token';
      setToken(fakeToken);
      return { success: true };
    }
    return { success: false, error: 'Usuario o contraseña incorrectos' };
  };

  const logout = () => setToken(null);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
