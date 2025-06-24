// Archivo: cotizadorRutas-frontend/src/layouts/RutaProtegida.jsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader, Center } from '@mantine/core';

const RutaProtegida = () => {
  const { auth, loading } = useAuth();

  if (loading) {
    // Mostramos un loader mientras se verifica la sesión
    return (
      <Center style={{ height: '100vh' }}>
        <Loader color="cyan" />
      </Center>
    );
  }

  // Si hay un usuario autenticado, muestra el contenido de la ruta (el cotizador).
  // Si no, lo redirige a la página de login.
  return auth?._id ? <Outlet /> : <Navigate to="/login" />;
};

export default RutaProtegida;