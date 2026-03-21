
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clienteAxios from '../../api/clienteAxios';
import {
    Container, Title, Paper, TextInput, PasswordInput, Button, Stack, Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { AtSign, Lock } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [noVerificado, setNoVerificado] = useState(false);
    const [reenviando, setReenviando] = useState(false);

    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ([email, password].includes('')) {
            notifications.show({
                title: 'Campos vacíos',
                message: 'Por favor, completá todos los campos.',
                color: 'red',
            });
            return;
        }

        setLoading(true);
        setNoVerificado(false);
        try {
            const { data } = await clienteAxios.post('/auth/login', { email, password });
            localStorage.setItem('token_cotizador', data.token);
            localStorage.setItem('authData', JSON.stringify(data));
            setAuth(data);
            navigate('/');
        } catch (error) {
            const data = error.response?.data;
            if (data?.noVerificado) {
                setNoVerificado(true);
            }
            notifications.show({
                title: 'Error de autenticación',
                message: data?.msg || 'No se pudo iniciar sesión.',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReenviarVerificacion = async () => {
        setReenviando(true);
        try {
            const { data } = await clienteAxios.post('/auth/reenviar-verificacion', { email });
            notifications.show({ title: 'Email enviado', message: data.msg, color: 'green' });
            setNoVerificado(false);
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: error.response?.data?.msg || 'No se pudo reenviar el email.',
                color: 'red',
            });
        } finally {
            setReenviando(false);
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center" c="var(--app-brand-primary)">Cotizador Logístico</Title>
            <Title ta="center" c="var(--app-brand-primary)">
                Iniciar Sesión
            </Title>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={handleSubmit}>
                    <Stack>
                        <TextInput
                            required
                            label="Email"
                            placeholder="tu.email@dominio.com"
                            value={email}
                            onChange={(event) => setEmail(event.currentTarget.value)}
                            leftSection={<AtSign size={16} />}
                        />

                        <PasswordInput
                            required
                            label="Contraseña"
                            placeholder="Tu contraseña"
                            value={password}
                            onChange={(event) => setPassword(event.currentTarget.value)}
                            leftSection={<Lock size={16} />}
                        />

                        {noVerificado && (
                            <Button
                                variant="light"
                                color="yellow"
                                fullWidth
                                loading={reenviando}
                                onClick={handleReenviarVerificacion}
                            >
                                Reenviar email de verificación
                            </Button>
                        )}

                        <Button fullWidth mt="xl" type="submit" loading={loading}>
                            Ingresar
                        </Button>

                        <Text ta="center" mt="md" size="sm">
                            ¿No tenés cuenta?{' '}
                            <Text component={Link} to="/registro" c="blue" inherit>
                                Registrate
                            </Text>
                        </Text>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default LoginPage;