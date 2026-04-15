import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clienteAxios from '../../api/clienteAxios';
import {
  Paper, TextInput, PasswordInput, Button, Stack,
  Text, Progress, List, ThemeIcon,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { AtSign, Lock, User, Check, X } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const RegistroPage = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  // Validaciones de contraseña en tiempo real
  const requisitos = [
    { label: 'Al menos 8 caracteres', cumple: password.length >= 8 },
    { label: 'Una letra mayúscula', cumple: /[A-Z]/.test(password) },
    { label: 'Un número', cumple: /\d/.test(password) },
  ];
  const passwordValido = requisitos.every(r => r.cumple);
  const passwordsCoinciden = password === confirmarPassword && confirmarPassword.length > 0;
  const fuerzaPassword = requisitos.filter(r => r.cumple).length;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !email || !password || !confirmarPassword) {
      notifications.show({ title: 'Campos incompletos', message: 'Completá todos los campos.', color: 'red' });
      return;
    }

    if (!passwordValido) {
      notifications.show({ title: 'Contraseña débil', message: 'La contraseña no cumple los requisitos de seguridad.', color: 'red' });
      return;
    }

    if (!passwordsCoinciden) {
      notifications.show({ title: 'Las contraseñas no coinciden', message: 'Verificá que ambas contraseñas sean iguales.', color: 'red' });
      return;
    }

    setLoading(true);
    try {
      const { data } = await clienteAxios.post('/auth/registro', { nombre, email, password });
      notifications.show({ title: '¡Cuenta creada!', message: data.msg, color: 'green', autoClose: 8000 });
      navigate('/login');
    } catch (error) {
      notifications.show({
        title: 'Error al registrarse',
        message: error.response?.data?.msg || 'No se pudo crear la cuenta.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await clienteAxios.post('/auth/google', {
        credential: credentialResponse.credential,
      });
      localStorage.setItem('token_cotizador', data.token);
      localStorage.setItem('authData', JSON.stringify(data));
      setAuth(data);
      navigate('/');
    } catch (error) {
      notifications.show({
        title: 'Error con Google',
        message: error.response?.data?.msg || 'No se pudo registrar con Google.',
        color: 'red',
      });
    }
  };

  return (
    <div className="auth-page">
      <Link to="/landing" className="auth-logo" style={{ textDecoration: 'none' }}>
        <div className="auth-logo-text">
          <img src="/favicon.png" alt="" className="auth-logo-icon-img" /><span>uot</span><span className="auth-logo-accent">argo</span>
        </div>
      </Link>
      <div className="auth-subtitle">Creá tu cuenta</div>

      <div className="auth-card">
        <Paper shadow="lg" p={32} radius="lg">
          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                required
                label="Nombre completo"
                placeholder="Tu nombre y apellido"
                value={nombre}
                onChange={(e) => setNombre(e.currentTarget.value)}
                leftSection={<User size={16} />}
              />

              <TextInput
                required
                label="Email"
                placeholder="tu.email@dominio.com"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                leftSection={<AtSign size={16} />}
              />

              <div>
                <PasswordInput
                  required
                  label="Contraseña"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  leftSection={<Lock size={16} />}
                />
                {password.length > 0 && (
                  <>
                    <Progress
                      value={(fuerzaPassword / 3) * 100}
                      color={fuerzaPassword === 3 ? 'green' : fuerzaPassword >= 2 ? 'yellow' : 'red'}
                      size="xs"
                      mt={8}
                    />
                    <List spacing={4} mt={8} size="sm">
                      {requisitos.map((req, i) => (
                        <List.Item
                          key={i}
                          icon={
                            <ThemeIcon color={req.cumple ? 'green' : 'gray'} size={18} radius="xl">
                              {req.cumple ? <Check size={12} /> : <X size={12} />}
                            </ThemeIcon>
                          }
                        >
                          <Text size="sm" c={req.cumple ? 'green' : 'dimmed'}>{req.label}</Text>
                        </List.Item>
                      ))}
                    </List>
                  </>
                )}
              </div>

              <PasswordInput
                required
                label="Confirmar contraseña"
                placeholder="Repetí tu contraseña"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.currentTarget.value)}
                leftSection={<Lock size={16} />}
                error={confirmarPassword.length > 0 && !passwordsCoinciden ? 'Las contraseñas no coinciden' : null}
              />

              <Button fullWidth mt="xs" type="submit" loading={loading} className="auth-btn-primary" size="md">
                Crear cuenta
              </Button>

              <div className="auth-divider">
                <Text size="xs" c="dimmed">o</Text>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    notifications.show({
                      title: 'Error',
                      message: 'No se pudo conectar con Google.',
                      color: 'red',
                    });
                  }}
                  text="signup_with"
                  shape="pill"
                  size="large"
                  width="300"
                  locale="es"
                />
              </div>

              <Text ta="center" mt="xs" size="sm">
                ¿Ya tenés cuenta?{' '}
                <Text component={Link} to="/login" className="auth-link" inherit>
                  Iniciá sesión
                </Text>
              </Text>
            </Stack>
          </form>
        </Paper>
      </div>

      <div className="auth-footer">© {new Date().getFullYear()} <img src="/favicon.png" alt="" className="auth-footer-icon" />uot<span className="auth-footer-accent">argo</span></div>
    </div>
  );
};

export default RegistroPage;
