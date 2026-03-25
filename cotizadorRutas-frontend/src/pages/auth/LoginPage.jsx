
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clienteAxios from '../../api/clienteAxios';
import {
    Paper, TextInput, PasswordInput, Button, Stack, Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { AtSign, Lock } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

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
                message: error.response?.data?.msg || 'No se pudo iniciar sesión con Google.',
                color: 'red',
            });
        }
    };

    return (
        <div className="auth-page">
            <Link to="/landing" className="auth-logo" style={{ textDecoration: 'none' }}>
                <div className="auth-logo-icon"><img src="/favicon.png" alt="" /></div>
                <div className="auth-logo-text">
                    Cotizador <span className="auth-logo-accent">Logístico</span>
                </div>
            </Link>
            <div className="auth-subtitle">Iniciá sesión en tu cuenta</div>

            <div className="auth-card">
                <Paper shadow="lg" p={32} radius="lg">
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

                            <Text ta="right" size="xs">
                                <Text component={Link} to="/olvide-password" className="auth-link" inherit>
                                    ¿Olvidaste tu contraseña?
                                </Text>
                            </Text>

                            <Button fullWidth type="submit" loading={loading} className="auth-btn-primary" size="md">
                                Ingresar
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
                                    text="continue_with"
                                    shape="pill"
                                    size="large"
                                    width="300"
                                    locale="es"
                                />
                            </div>

                            <Text ta="center" mt="xs" size="sm">
                                ¿No tenés cuenta?{' '}
                                <Text component={Link} to="/registro" className="auth-link" inherit>
                                    Registrate
                                </Text>
                            </Text>
                        </Stack>
                    </form>
                </Paper>
            </div>

            <div className="auth-footer">© {new Date().getFullYear()} Cotizador Logístico</div>
        </div>
    );
};

export default LoginPage;