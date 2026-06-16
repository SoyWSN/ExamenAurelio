// client/src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Inicializamos el estado leyendo si ya existe un token guardado en el navegador
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);

  const login = async (username, password) => {
    try {
      // Hacemos la petición POST real a tu servidor de Node.js
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (res.ok && data.token) {
        setToken(data.token);
        // Guardamos el token de forma persistente en el navegador
        localStorage.setItem('adminToken', data.token); 
        return { success: true };
      }
      
      // Si el servidor responde un error (ej. contraseña incorrecta), lo atrapamos aquí
      return { success: false, error: data.error || 'Usuario o contraseña incorrectos' };
    } catch (err) {
      return { success: false, error: 'No se pudo conectar con el servidor backend.' };
    }
  };

  const logout = () => {
    setToken(null);
    // Borramos el token al cerrar sesión
    localStorage.removeItem('adminToken');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token, // Si hay token, está autenticado (true)
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