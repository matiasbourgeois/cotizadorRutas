import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import clienteAxios from '../../api/clienteAxios';
import {
  Paper, Text, Button, Stack, Loader, Center,
} from '@mantine/core';
import { Check, X, ArrowLeft } from 'lucide-react';

const VerificarEmailPage = () => {
  const { token } = useParams();
  const [estado, setEstado] = useState('cargando');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const verificar = async () => {
      try {
        const { data } = await clienteAxios.get(`/auth/verificar/${token}`);
        setEstado('exito');
        setMensaje(data.msg);
      } catch (error) {
        const data = error.response?.data;
        if (data?.expirado) {
          setEstado('expirado');
        } else {
          setEstado('error');
        }
        setMensaje(data?.msg || 'Error al verificar la cuenta');
      }
    };

    verificar();
  }, [token]);

  return (
    <div className="auth-page">
      <Link to="/landing" className="auth-logo" style={{ textDecoration: 'none' }}>
        <div className="auth-logo-text">
          <img src="/favicon.png" alt="" className="auth-logo-icon-img" /><span>uot</span><span className="auth-logo-accent">argo</span>
        </div>
      </Link>
      <div className="auth-subtitle">Verificación de cuenta</div>

      <div className="auth-card">
        <Paper shadow="lg" p={40} radius="lg">
          {estado === 'cargando' && (
            <Center>
              <Stack align="center" gap="md">
                <Loader size="lg" color="cyan" />
                <Text size="lg" fw={500}>Verificando tu cuenta...</Text>
              </Stack>
            </Center>
          )}

          {estado === 'exito' && (
            <Stack align="center" gap="md">
              <div className="auth-icon-circle success">
                <Check size={32} color="white" />
              </div>
              <Text fw={700} fz="xl" ta="center">¡Cuenta verificada!</Text>
              <Text ta="center" c="dimmed">{mensaje}</Text>
              <Button
                component={Link}
                to="/login"
                fullWidth
                mt="md"
                size="md"
                className="auth-btn-primary"
              >
                Iniciar sesión
              </Button>
            </Stack>
          )}

          {(estado === 'error' || estado === 'expirado') && (
            <Stack align="center" gap="md">
              <div className="auth-icon-circle error">
                <X size={32} color="white" />
              </div>
              <Text fw={700} fz="xl" ta="center" c="red.6">Verificación fallida</Text>
              <Text ta="center" c="dimmed">{mensaje}</Text>
              {estado === 'expirado' && (
                <Text ta="center" size="sm" c="dimmed">
                  Podés solicitar un nuevo enlace desde la pantalla de login.
                </Text>
              )}
              <Button
                component={Link}
                to="/login"
                fullWidth
                mt="md"
                variant="light"
                color="cyan"
                size="md"
                leftSection={<ArrowLeft size={16} />}
              >
                Ir al login
              </Button>
            </Stack>
          )}
        </Paper>
      </div>

      <div className="auth-footer">© {new Date().getFullYear()} <img src="/favicon.png" alt="" className="auth-footer-icon" />uot<span className="auth-footer-accent">argo</span></div>
    </div>
  );
};

export default VerificarEmailPage;
