// Archivo: cotizadorRutas-frontend/src/context/AuthContext.jsx

import { useState, useEffect, createContext, useContext } from 'react';
import clienteAxios from '../api/clienteAxios'; // Lo crearemos en el próximo paso

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem('token_cotizador');
      if (!token) {
        setLoading(false);
        return;
      }

      // Configuramos el token en los headers de Axios para futuras peticiones
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        // Podríamos tener una ruta para verificar el perfil/token. Por ahora, asumimos que si hay token, está bien.
        // const { data } = await clienteAxios('/api/usuarios/perfil', config);
        // setAuth(data);

        // Simulación simplificada por ahora:
        const authData = JSON.parse(localStorage.getItem('authData'));
        if (authData) {
          setAuth(authData);
        }
      } catch (error) {
        console.log(error);
        setAuth({});
      } finally {
        setLoading(false);
      }
    };

    autenticarUsuario();
  }, []);

  const cerrarSesionAuth = () => {
      setAuth({});
      localStorage.removeItem('token_cotizador');
      localStorage.removeItem('authData');
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        loading,
        cerrarSesionAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};