import { useState } from 'react';
import { Link } from 'react-router-dom';
import clienteAxios from '../../api/clienteAxios';
import {
  Paper, TextInput, Button, Stack, Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { AtSign, ArrowLeft, Mail } from 'lucide-react';

const OlvidePasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      notifications.show({ title: 'Campo vacío', message: 'Ingresá tu email para continuar.', color: 'red' });
      return;
    }

    setLoading(true);
    try {
      const { data } = await clienteAxios.post('/auth/olvide-password', { email });
      setEnviado(true);
      notifications.show({ title: 'Email enviado', message: data.msg, color: 'green', autoClose: 8000 });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.msg || 'Hubo un error al procesar la solicitud.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Link to="/landing" className="auth-logo" style={{ textDecoration: 'none' }}>
        <div className="auth-logo-text">
          <img src="/favicon.png" alt="" className="auth-logo-icon-img" /><span>uot</span><span className="auth-logo-accent">argo</span>
        </div>
      </Link>
      <div className="auth-subtitle">Recuperar contraseña</div>

      <div className="auth-card">
        <Paper shadow="lg" p={32} radius="lg">
          {enviado ? (
            <Stack align="center" gap="md">
              <div className="auth-icon-circle success">
                <Mail size={28} color="white" />
              </div>
              <Text fw={700} fz="xl" ta="center">¡Revisá tu email!</Text>
              <Text c="dimmed" ta="center" size="sm">
                Si el email está registrado, recibirás un enlace para restablecer tu contraseña. Revisá también la carpeta de spam.
              </Text>
              <Button
                variant="light"
                color="cyan"
                fullWidth
                mt="md"
                size="md"
                component={Link}
                to="/login"
                leftSection={<ArrowLeft size={16} />}
              >
                Volver al Login
              </Button>
            </Stack>
          ) : (
            <form onSubmit={handleSubmit}>
              <Stack>
                <Text c="dimmed" size="sm" ta="center">
                  Ingresá el email con el que te registraste y te enviaremos un enlace para crear una nueva contraseña.
                </Text>

                <TextInput
                  required
                  label="Email"
                  placeholder="tu.email@dominio.com"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  leftSection={<AtSign size={16} />}
                />

                <Button fullWidth mt="xs" type="submit" loading={loading} className="auth-btn-primary" size="md">
                  Enviar enlace de recuperación
                </Button>

                <Text ta="center" mt="xs" size="sm">
                  <Text component={Link} to="/login" className="auth-link" inherit>
                    <ArrowLeft size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    Volver al Login
                  </Text>
                </Text>
              </Stack>
            </form>
          )}
        </Paper>
      </div>

      <div className="auth-footer">© {new Date().getFullYear()} <img src="/favicon.png" alt="" className="auth-footer-icon" />uot<span className="auth-footer-accent">argo</span></div>
    </div>
  );
};

export default OlvidePasswordPage;
