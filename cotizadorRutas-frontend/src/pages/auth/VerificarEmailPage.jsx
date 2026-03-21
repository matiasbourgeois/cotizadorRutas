import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import clienteAxios from '../../api/clienteAxios';
import {
  Container, Title, Paper, Text, Button, Stack, Loader, Center,
} from '@mantine/core';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const VerificarEmailPage = () => {
  const { token } = useParams();
  const [estado, setEstado] = useState('cargando'); // cargando | exito | error | expirado
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
    <Container size={460} my={60}>
      <Paper withBorder shadow="md" p={40} radius="md">
        {estado === 'cargando' && (
          <Center>
            <Stack align="center" gap="md">
              <Loader size="lg" />
              <Text size="lg">Verificando tu cuenta...</Text>
            </Stack>
          </Center>
        )}

        {estado === 'exito' && (
          <Stack align="center" gap="md">
            <CheckCircle size={64} color="var(--mantine-color-green-6)" />
            <Title order={2} ta="center" c="green">¡Cuenta verificada!</Title>
            <Text ta="center" c="dimmed" size="lg">{mensaje}</Text>
            <Button component={Link} to="/login" fullWidth mt="md" size="md">
              Iniciar sesión
            </Button>
          </Stack>
        )}

        {(estado === 'error' || estado === 'expirado') && (
          <Stack align="center" gap="md">
            <XCircle size={64} color="var(--mantine-color-red-6)" />
            <Title order={2} ta="center" c="red">Verificación fallida</Title>
            <Text ta="center" c="dimmed" size="lg">{mensaje}</Text>
            {estado === 'expirado' && (
              <Text ta="center" size="sm" c="dimmed">
                Podés solicitar un nuevo enlace desde la pantalla de login.
              </Text>
            )}
            <Button component={Link} to="/login" fullWidth mt="md" variant="light" size="md">
              Ir al login
            </Button>
          </Stack>
        )}
      </Paper>
    </Container>
  );
};

export default VerificarEmailPage;
