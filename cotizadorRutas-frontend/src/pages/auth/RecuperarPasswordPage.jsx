import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import clienteAxios from '../../api/clienteAxios';
import {
  Paper, PasswordInput, Button, Stack, Text,
  Progress, List, ThemeIcon,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Lock, Check, X, ArrowLeft, ShieldCheck } from 'lucide-react';

const RecuperarPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);

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

    if (!passwordValido) {
      notifications.show({ title: 'Contraseña débil', message: 'La contraseña no cumple los requisitos.', color: 'red' });
      return;
    }
    if (!passwordsCoinciden) {
      notifications.show({ title: 'No coinciden', message: 'Las contraseñas deben ser iguales.', color: 'red' });
      return;
    }

    setLoading(true);
    try {
      const { data } = await clienteAxios.post(`/auth/recuperar-password/${token}`, { password });
      setExito(true);
      notifications.show({ title: '¡Listo!', message: data.msg, color: 'green', autoClose: 8000 });
    } catch (error) {
      const msg = error.response?.data?.msg || 'Error al restablecer la contraseña.';
      const expirado = error.response?.data?.expirado;
      notifications.show({ title: expirado ? 'Enlace expirado' : 'Error', message: msg, color: 'red' });
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
      <div className="auth-subtitle">Creá tu nueva contraseña</div>

      <div className="auth-card">
        <Paper shadow="lg" p={32} radius="lg">
          {exito ? (
            <Stack align="center" gap="md">
              <div className="auth-icon-circle success">
                <ShieldCheck size={28} color="white" />
              </div>
              <Text fw={700} fz="xl" ta="center">¡Contraseña actualizada!</Text>
              <Text c="dimmed" ta="center" size="sm">
                Tu contraseña fue cambiada exitosamente. Ya podés iniciar sesión con tu nueva contraseña.
              </Text>
              <Button
                fullWidth
                mt="md"
                size="md"
                className="auth-btn-primary"
                onClick={() => navigate('/login')}
              >
                Ir al Login
              </Button>
            </Stack>
          ) : (
            <form onSubmit={handleSubmit}>
              <Stack>
                <Text c="dimmed" size="sm" ta="center">
                  Ingresá tu nueva contraseña. Debe cumplir con los requisitos de seguridad.
                </Text>

                <div>
                  <PasswordInput
                    required
                    label="Nueva contraseña"
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
                  Restablecer contraseña
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

export default RecuperarPasswordPage;
