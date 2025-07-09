// Archivo: src/pages/propuestaPage/PropuestaPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import clienteAxios from '../../api/clienteAxios';
import { Loader, Center, Container, Text, Paper, Title, Button, Grid } from '@mantine/core';
import { Printer } from 'lucide-react';
import './PropuestaPage.css'; // <-- Importamos nuestro archivo de estilos

const PropuestaPage = () => {
    const { id } = useParams();
    const [presupuesto, setPresupuesto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerPresupuesto = async () => {
            try {
                const { data } = await clienteAxios.get(`/presupuestos/${id}`);
                setPresupuesto(data);
            } catch (error) {
                console.error("Error al obtener el presupuesto:", error);
            } finally {
                setLoading(false);
            }
        };
        obtenerPresupuesto();
    }, [id]);

    if (loading) {
        return <Center style={{ height: '100vh' }}><Loader color="cyan" /></Center>;
    }

    if (!presupuesto) {
        return (
            <Center style={{ height: '100vh' }}>
                <Paper p="xl" withBorder>
                    <Title order={3}>Error</Title>
                    <Text>No se pudo encontrar la propuesta.</Text>
                    <Button component={Link} to="/historial" mt="md">Volver al Historial</Button>
                </Paper>
            </Center>
        );
    }

    // --- 👇👇 AQUÍ COMIENZA LA NUEVA MAQUETACIÓN PROFESIONAL 👇👇 ---
    return (
        <div className="propuesta-background">
            <div className="print-button-container">
                <Button
                    leftSection={<Printer size={18} />}
                    onClick={() => window.print()}
                    size="lg"
                    radius="xl"
                >
                    Imprimir o Guardar como PDF
                </Button>
            </div>

            <div className="page-container">
                {/* --- PÁGINA 1: PORTADA --- */}
                <div className="page page-portada">
                    <div className="portada-content">
                        <img src="https://www.sdatransporte.com.ar/img/logo-sda-transporte.png" alt="Logo" className="portada-logo" />
                        <h1>Propuesta de Servicio Logístico</h1>
                        <div className="linea-decorativa"></div>
                        <p>Preparado para:</p>
                        <h2>{presupuesto.cliente || 'No especificado'}</h2>
                    </div>
                    <div className="portada-footer">
                        <p><strong>Propuesta N°:</strong> {presupuesto._id}</p>
                        <p><strong>Fecha de Emisión:</strong> {new Date(presupuesto.fechaCreacion).toLocaleDateString('es-AR')}</p>
                    </div>
                </div>

                {/* --- PÁGINA 2: RESUMEN EJECUTIVO --- */}
                <div className="page">
                    {/* Este es el NUEVO código con la solución de tablas */}
                    <table className="header">
                        <tbody>
                            <tr>
                                <td className="header-logo-cell">
                                    <img src="https://www.sdatransporte.com.ar/img/logo-sda-transporte.png" alt="Logo" />
                                </td>
                                <td className="header-info-cell">
                                    <h3>Sol del Amanecer SRL</h3>
                                    <p>+54 9 351 123-4567</p>
                                    <p>contacto@sdatransporte.com.ar</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="content">
                        <h2 className="section-title">Resumen del Servicio</h2>
                        <div className="card">
                            <Grid>
                                <Grid.Col span={{ base: 12, sm: 6 }}><Text><strong>Frecuencia:</strong> {presupuesto.frecuencia.tipo}</Text></Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 6 }}><Text><strong>Distancia / Viaje:</strong> {presupuesto.totalKilometros.toFixed(2)} km</Text></Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 6 }}><Text><strong>Total de Paradas:</strong> {presupuesto.puntosEntrega.length} puntos</Text></Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 6 }}><Text><strong>Tipo de Vehículo:</strong> {presupuesto.vehiculo.datos.marca} {presupuesto.vehiculo.datos.modelo}</Text></Grid.Col>
                            </Grid>
                        </div>

                        <h2 className="section-title">Propuesta Económica</h2>
                        <Paper withBorder p="xl" radius="md" shadow="sm" className="price-card">
                            <Text>Valor Total del Servicio</Text>
                            <Title order={1} className="price-value">${Math.round(presupuesto.resumenCostos.totalFinal).toLocaleString('es-AR')}</Title>
                            <Text size="xs" c="dimmed">El valor expresado no incluye IVA.</Text>
                        </Paper>
                    </div>
                    <div className="footer">
                        <Text size="xs" c="dimmed">Sol del Amanecer SRL | Propuesta de Servicio Logístico</Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropuestaPage;