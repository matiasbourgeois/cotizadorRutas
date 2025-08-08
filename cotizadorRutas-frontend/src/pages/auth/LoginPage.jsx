// Archivo: cotizadorRutas-frontend/src/pages/auth/LoginPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Lo crearemos en el siguiente paso
import clienteAxios from '../../api/clienteAxios';
import {
    Container,
    Title,
    Paper,
    TextInput,
    PasswordInput,
    Button,
    Stack,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { AtSign, Lock } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { setAuth } = useAuth(); // Función que guardará los datos del usuario

    // Dentro de LoginPage.jsx
    const handleSubmit = async (e) => {
        e.preventDefault();
        if ([email, password].includes('')) {
            notifications.show({
                title: 'Campos vacíos',
                message: 'Por favor, completa todos los campos.',
                color: 'red',
            });
            return;
        }

        setLoading(true);
        try {
            // Usamos nuestro cliente de Axios para llamar al backend
            const { data } = await clienteAxios.post('/auth/login', { email, password });

            // Guardamos el token y los datos del usuario en el Local Storage
            localStorage.setItem('token_cotizador', data.token);
            localStorage.setItem('authData', JSON.stringify(data));

            // Actualizamos el estado global de autenticación
            setAuth(data);

            // Redirigimos al cotizador
            navigate('/');

        } catch (error) {
            console.log('ERROR DETALLADO:', error); // <-- AÑADE ESTA LÍNEA
            notifications.show({
                title: 'Error de autenticación',
                message: error.response?.data?.msg || 'No se pudo iniciar sesión.',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center" c="deep-blue.7">Cotizador Logístico</Title> 
            <Title ta="center" c="deep-blue.7">
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

                        <Button fullWidth mt="xl" type="submit" loading={loading}>
                            Ingresar
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default LoginPage;