// Archivo: src/pages/propuestaPage/PropuestaPage.jsx (Versión final de 3 páginas)

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import clienteAxios from '../../api/clienteAxios';
import { Loader, Center, Text, Paper, Title, Button, Grid, Group, Divider, ThemeIcon, Stack, List, SimpleGrid, Textarea } from '@mantine/core';
import { Printer, Calendar, MapPin, Truck, Route, Clock } from 'lucide-react';
import MapaRuta from '../../components/MapaRuta';
import QRCode from 'qrcode';
import './PropuestaPage.css';

const PropuestaPage = () => {
    const { id } = useParams();
    const [presupuesto, setPresupuesto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        const obtenerPresupuesto = async () => {
            try {
                const { data } = await clienteAxios.get(`/presupuestos/${id}`);
                setPresupuesto(data);

                if (data && data.puntosEntrega.length >= 2) {
                    const puntos = data.puntosEntrega;
                    const origin = `${puntos[0].lat},${puntos[0].lng}`;
                    const destination = `${puntos[puntos.length - 1].lat},${puntos[puntos.length - 1].lng}`;
                    const waypoints = puntos.slice(1, -1).map(p => `${p.lat},${p.lng}`).join('|');
                    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}`;

                    QRCode.toDataURL(googleMapsUrl, { width: 180, margin: 2, errorCorrectionLevel: 'H' })
                        .then(url => setQrCodeUrl(url))
                        .catch(err => console.error('Error al generar QR:', err));
                }
            } catch (error) {
                console.error("Error al obtener el presupuesto:", error);
            } finally {
                setLoading(false);
            }
        };
        obtenerPresupuesto();
    }, [id]);

    const formatDuration = (totalMinutes) => {
        if (!totalMinutes) return 'N/A';
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        let result = '';
        if (hours > 0) {
            result += `${hours}h `;
        }
        if (minutes > 0 || hours === 0) {
            result += `${minutes}m`;
        }
        return result.trim();
    };

    const Header = () => (
        <table className="header-table">
            <tbody>
                <tr>
                    {/* ✅ RUTA CORREGIDA para apuntar a tu logo local */}
                    <td></td>
                    <td className="header-info-cell"><h3>Sol del Amanecer SRL</h3><p>Transporte y Logística de Confianza</p></td>
                </tr>
            </tbody>
        </table>
    );

    const Footer = ({ pageNumber, totalPages }) => (
        <div className="footer"><Text size="xs" c="dimmed">Propuesta Confidencial | Página {pageNumber} de {totalPages}</Text></div>
    );

    if (loading) return <Center h="100vh"><Loader color="cyan" /></Center>;
    if (!presupuesto) return <Center h="100vh"><Text>Propuesta no encontrada.</Text></Center>;

    const totalPages = 3;

    return (
        <div className="propuesta-background">
            <div className="print-button-container">
                <Button leftSection={<Printer size={18} />} onClick={() => window.print()} size="lg" radius="xl">
                    Imprimir o Guardar como PDF
                </Button>
            </div>

            <div className="page-container">
                {/* --- PÁGINA 1: PORTADA --- */}
                <div className="page page-portada">
                    <div className="portada-content">
                        <img src="/icons/logosol2.png" alt="Logo" className="portada-logo" />
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

                {/* --- PÁGINA 2: RESUMEN, PRECIO Y MAPA (VERSIÓN CON AJUSTES FINALES) --- */}
                <div className="page">
                    <Header />
                    <div className="content">
                        {/* Título con margen reducido */}
                        <h2 className="section-title compact-title">Detalles Clave del Servicio</h2>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                            <Paper withBorder p="sm" radius="md" className="kpi-card">
                                <Group wrap="nowrap">
                                    <ThemeIcon color="cyan" variant="light" size={36} radius="md"><Clock size={18} /></ThemeIcon>
                                    <div>
                                        <Text c="dimmed" size="xs">Duración Estimada</Text>
                                        {/* ✅ LÍNEA MODIFICADA PARA USAR LA FUNCIÓN */}
                                        <Text fw={600} fz="sm">{formatDuration(presupuesto.duracionMin)}</Text>
                                    </div>
                                </Group>
                            </Paper>
                            <Paper withBorder p="sm" radius="md" className="kpi-card">
                                <Group wrap="nowrap">
                                    <ThemeIcon color="cyan" variant="light" size={36} radius="md"><MapPin size={18} /></ThemeIcon>
                                    <div><Text c="dimmed" size="xs">Distancia por Viaje</Text><Text fw={600} fz="sm">{presupuesto.totalKilometros.toFixed(2)} km</Text></div>
                                </Group>
                            </Paper>
                            <Paper withBorder p="sm" radius="md" className="kpi-card">
                                <Group wrap="nowrap">
                                    <ThemeIcon color="cyan" variant="light" size={36} radius="md"><Truck size={18} /></ThemeIcon>
                                    <div><Text c="dimmed" size="xs">Vehículo Asignado</Text><Text fw={600} fz="sm">{presupuesto.vehiculo.datos.marca} {presupuesto.vehiculo.datos.modelo}</Text></div>
                                </Group>
                            </Paper>
                            <Paper withBorder p="sm" radius="md" className="kpi-card">
                                <Group wrap="nowrap">
                                    <ThemeIcon color="cyan" variant="light" size={36} radius="md"><Calendar size={18} /></ThemeIcon>
                                    <div><Text c="dimmed" size="xs">Frecuencia</Text><Text fw={600} fz="sm">{presupuesto.frecuencia.tipo}</Text></div>
                                </Group>
                            </Paper>
                        </SimpleGrid>

                        {/* Título con margen reducido */}
                        <h2 className="section-title compact-title">Inversión del Servicio</h2>
                        <Paper withBorder p="md" radius="md" shadow="sm" className="price-card-compact">
                            <Text c="dimmed" tt="uppercase" size="xs" fw={700}>Valor del servicio</Text>
                            <Title order={2} className="price-value-compact">${Math.round(presupuesto.resumenCostos.totalFinal).toLocaleString('es-AR')}</Title>
                            <Text size="xs" c="dimmed">(Valor expresado en Pesos Argentinos, no incluye IVA)</Text>
                        </Paper>

                        {/* Título con margen reducido */}
                        <h2 className="section-title compact-title">Mapa de la Operación</h2>
                        <Paper withBorder radius="md" p={4} shadow="sm" className="map-container-final">
                            {/* ✅ SOLUCIÓN AL PROBLEMA DEL RECORRIDO: Añadimos la prop onRutaCalculada */}
                            <MapaRuta
                                puntos={presupuesto.puntosEntrega}
                                initialDirections={presupuesto.directionsResult}
                                onRutaCalculada={() => { }}
                            />
                        </Paper>
                    </div>
                    <Footer pageNumber={2} totalPages={totalPages} />
                </div>

                {/* --- PÁGINA 3: ITINERARIO Y CIERRE --- */}
                <div className="page">
                    <Header />
                    <div className="content">
                        <h2 className="section-title">Itinerario y Cierre</h2>
                        <Grid gutter="xl">
                            <Grid.Col span={8}>
                                <div className="itinerary-wrapper">
                                    {presupuesto.puntosEntrega.map((punto, index) => (
                                        <div key={index} className="itinerary-node">
                                            <div className="itinerary-icon"><Text fw={700} c="white">{index + 1}</Text></div>
                                            <div className="itinerary-details">
                                                <Text fw={600} size="lg" className="itinerary-point-name">{punto.nombre.split('–')[0].trim()}</Text>
                                                <Text c="dimmed" size="sm" className="itinerary-point-address">{punto.nombre.split('–')[1]?.trim()}</Text>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Grid.Col>
                            <Grid.Col span={4}>
                                {qrCodeUrl && (
                                    <Paper withBorder p="lg" radius="md" className="qr-paper-final">
                                        <Title order={5} ta="center" mb="md">Ver Ruta en tu Móvil</Title>
                                        <Center><img src={qrCodeUrl} alt="Código QR para Google Maps" className="qr-code-image-final" /></Center>
                                        <Text size="xs" c="dimmed" mt="md" ta="center">Escanea para abrir la ruta en Google Maps.</Text>
                                    </Paper>
                                )}
                            </Grid.Col>
                        </Grid>

                        <Divider my="xl" />

                        <h3 className="section-subtitle">Términos y Condiciones</h3>
                        <Textarea readOnly variant="unstyled" value={presupuesto.terminos || "Validez de la oferta: 15 días."} autosize className="terms-textarea" />

                        <Grid mt="xl" className="signature-area">
                            <Grid.Col span={6}><div className="signature-box"><p className="signature-line"></p><p className="signature-title">Firma por Sol del Amanecer SRL</p></div></Grid.Col>
                            <Grid.Col span={6}><div className="signature-box"><p className="signature-line"></p><p className="signature-title">Firma y Aclaración del Cliente</p></div></Grid.Col>
                        </Grid>
                    </div>
                    <Footer pageNumber={3} totalPages={totalPages} />
                </div>
            </div>
        </div>
    );
};

export default PropuestaPage;