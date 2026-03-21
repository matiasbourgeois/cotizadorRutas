import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import clienteAxios from '../../api/clienteAxios';
import {
  Container, Title, Paper, TextInput, PasswordInput, Button, Stack,
  Text, Progress, List, ThemeIcon,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { AtSign, Lock, User, Check, X } from 'lucide-react';

const RegistroPage = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  return (
    <Container size={460} my={40}>
      <Title ta="center" c="var(--app-brand-primary)">Cotizador Logístico</Title>
      <Title ta="center" c="var(--app-brand-primary)" order={2}>Crear Cuenta</Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
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

            <Button fullWidth mt="xl" type="submit" loading={loading}>
              Crear cuenta
            </Button>

            <Text ta="center" mt="md" size="sm">
              ¿Ya tenés cuenta?{' '}
              <Text component={Link} to="/login" c="blue" inherit>
                Iniciá sesión
              </Text>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default RegistroPage;
