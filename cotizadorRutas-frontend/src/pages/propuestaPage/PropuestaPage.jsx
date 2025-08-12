// Archivo: src/pages/propuestaPage/PropuestaPage.jsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import clienteAxios from '../../api/clienteAxios';
import {
    Loader, Center, Text, Paper, Title, Button, Grid, Group,
    Divider, ThemeIcon, Stack, SimpleGrid, Textarea
} from '@mantine/core';
import {
    Printer, Calendar, MapPin, Truck, Clock, Target,
    Satellite, ShieldCheck, MessageCircle
} from 'lucide-react';
import MapaRuta from '../../components/MapaRuta';
import QRCode from 'qrcode';
import './PropuestaPage.css';

// Sub-componentes
const KpiCard = ({ icon, label, value }) => (
    <Paper withBorder p="md" radius="md" className="prop-kpi-card">
        <Group wrap="nowrap">
            <ThemeIcon color="cyan" variant="light" size={40} radius="md">{icon}</ThemeIcon>
            <div>
                <Text fz="xs" c="dimmed">{label}</Text>
                <Text fz="md" fw={600}>{value}</Text>
            </div>
        </Group>
    </Paper>
);

const BeneficioCard = ({ icon, label, description }) => (
    <Paper p="md" radius="md" withBorder bg="gray.0">
        <Stack align="center" gap="xs">
            <ThemeIcon color="green" variant="light" size={42} radius="md">
                {icon}
            </ThemeIcon>
            <Text fz="sm" fw={600} ta="center">{label}</Text>
            <Text fz="xs" c="dimmed" ta="center">{description}</Text>
        </Stack>
    </Paper>
);

const PropuestaPage = () => {
    const { id } = useParams();
    const [presupuesto, setPresupuesto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    // Fondo portada: primario (Wikimedia, estable) + fallback (Unsplash)
    const PORTADA_BG_PRIMARY =
        'https://upload.wikimedia.org/wikipedia/commons/3/3a/Containerterminal_Tollerort_Hamburg_2013a.jpg';
    const PORTADA_BG_FALLBACK =
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80';
    const [portadaBg, setPortadaBg] = useState(PORTADA_BG_FALLBACK);

    useEffect(() => {
        const img = new Image();
        img.onload = () => setPortadaBg(PORTADA_BG_PRIMARY);
        img.onerror = () => setPortadaBg(PORTADA_BG_FALLBACK);
        img.src = PORTADA_BG_PRIMARY;
    }, []);

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
                console.error('Error al obtener el presupuesto:', error);
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
        if (hours > 0) result += `${hours}h `;
        if (minutes > 0 || hours === 0) result += `${minutes}m`;
        return result.trim();
    };

    const Header = () => (
        <table className="header-table">
            <tbody>
                <tr>
                    <td className="header-info-cell">
                        <h3>Sol del Amanecer SRL</h3>
                        <p>Transporte y Logística de Confianza</p>
                    </td>
                </tr>
            </tbody>
        </table>
    );

    const Footer = ({ pageNumber, totalPages }) => (
        <div className="footer">
            <Text size="xs" c="dimmed">
                Propuesta Confidencial | Página {pageNumber} de {totalPages}
            </Text>
        </div>
    );

    if (loading) return <Center h="100vh"><Loader color="cyan" /></Center>;
    if (!presupuesto) return <Center h="100vh"><Text>Propuesta no encontrada.</Text></Center>;

    const MAX_PRINT_ITINERARY = 3;

    return (
        <div className="propuesta-background">
            <div className="prop-print-button-container">
                <Button leftSection={<Printer size={18} />} onClick={() => window.print()} size="lg" radius="xl">
                    Imprimir o Guardar PDF
                </Button>
            </div>

            <div className="prop-page-container">

                {/* PÁGINA 1: Portada */}
                <div
                    className="prop-page prop-page-portada"
                    style={{ '--portada-bg': `url('${portadaBg}')` }}
                >

                    <div className="portada-overlay" />
                    <div className="portada-content">
                        <img src="/icons/logosol2.png" alt="Logo" className="portada-logo" />
                        <h1>Propuesta de Servicio Logístico</h1>
                        <div className="linea-decorativa" />
                        <p>Preparado para:</p>
                        <h2>{presupuesto.cliente || 'No especificado'}</h2>
                    </div>
                    <div className="portada-footer">
                        <p><strong>Propuesta N°:</strong> {presupuesto._id}</p>
                        <p><strong>Fecha de Emisión:</strong> {new Date(presupuesto.fechaCreacion).toLocaleDateString('es-AR')}</p>
                    </div>
                </div>

                {/* PÁGINA 2: Resumen Ejecutivo */}
                <div className="prop-page">
                    <Header />
                    <div className="content">
                        <Grid gutter="xl" className="prop-grid-resumen">
                            {/* COLUMNA IZQUIERDA */}
                            <Grid.Col span={7} className="prop-col-7">
                                <Title order={2} className="section-title">Resumen de la Operación</Title>
                                <SimpleGrid cols={2} spacing="md">
                                    <KpiCard icon={<MapPin size={22} />} label="Distancia por Viaje" value={`${presupuesto.totalKilometros.toFixed(1)} km`} />
                                    <KpiCard icon={<Clock size={22} />} label="Duración Estimada" value={formatDuration(presupuesto.duracionMin)} />
                                    <KpiCard icon={<Truck size={22} />} label="Vehículo Dedicado" value={`${presupuesto.vehiculo.datos.marca} ${presupuesto.vehiculo.datos.modelo}`} />
                                    <KpiCard icon={<Calendar size={22} />} label="Frecuencia del Servicio" value={presupuesto.frecuencia.tipo} />
                                </SimpleGrid>

                                <Paper p="lg" radius="md" mt="xl" withBorder>
                                    <Title order={4} className="section-subtitle" mt={0} mb="md">
                                        Nuestra Garantía de Servicio
                                    </Title>
                                    <SimpleGrid cols={3}>
                                        <BeneficioCard icon={<Satellite size={24} />} label="Seguimiento 24/7" description="Visibilidad total de su carga." />
                                        <BeneficioCard icon={<ShieldCheck size={24} />} label="Carga Asegurada" description="Protección completa ante imprevistos." />
                                        <BeneficioCard icon={<MessageCircle size={24} />} label="Atención Directa" description="Comunicación fluida y sin intermediarios." />
                                    </SimpleGrid>
                                </Paper>
                            </Grid.Col>

                            {/* COLUMNA DERECHA (Precio) */}
                            <Grid.Col span={5} className="prop-col-5">
                                <Paper withBorder p="xl" radius="md" shadow="md" className="prop-price-card">
                                    <Stack align="center" gap="xs">
                                        <ThemeIcon color="cyan" size={50} radius="xl"><Target size={28} /></ThemeIcon>
                                        <Text c="dimmed" tt="uppercase" size="sm" fw={700} mt="md">
                                            Inversión del Servicio
                                        </Text>
                                        {/* Tamaño responsive para que nunca desborde */}
                                        <Title
                                            order={1}
                                            className="price-value"
                                            style={{ fontSize: 'clamp(28px, 4.2vw, 44px)' }}
                                        >
                                            ${Math.round(presupuesto.resumenCostos.totalFinal).toLocaleString('es-AR')}
                                        </Title>
                                        <Text size="sm" c="dimmed" ta="center">
                                            (Valor mensual expresado en Pesos Argentinos, no incluye IVA)
                                        </Text>
                                    </Stack>
                                </Paper>
                            </Grid.Col>
                        </Grid>
                    </div>
                    <Footer pageNumber={2} totalPages={3} />
                </div>

                {/* PÁGINA 3: Operación e Itinerario */}
                <div className="prop-page">
                    <Header />
                    <div className="content">
                        <Grid gutter="xl" className="prop-grid-cierre">
                            <Grid.Col span={6} className="prop-col-6">
                                <Title order={2} className="section-title">Mapa de la Operación</Title>
                                <Paper withBorder radius="md" p={4} shadow="sm" className="prop-map-container">
                                    <MapaRuta puntos={presupuesto.puntosEntrega} onRutaCalculada={() => { }} />
                                </Paper>
                            </Grid.Col>

                            <Grid.Col span={6} className="prop-col-6">
                                <Title order={2} className="section-title">Itinerario de Entrega</Title>

                                <div className="itinerary-wrapper" style={{ marginTop: '1rem' }}>
                                    {/* PANTALLA: lista completa con scroll */}
                                    <div className="itinerary-scroll screen-only">
                                        {presupuesto.puntosEntrega.map((punto, idx) => {
                                            const [titulo, direccion] = String(punto?.nombre ?? '').split('–');
                                            return (
                                                <div key={`it-screen-${idx}`} className="itinerary-node">
                                                    <div className="itinerary-icon">
                                                        <span className="itinerary-index">{idx + 1}</span>
                                                    </div>
                                                    <div className="itinerary-details">
                                                        <Text fw={600} size="md" className="itinerary-point-name">
                                                            {(titulo || '').trim()}
                                                        </Text>
                                                        <Text c="dimmed" size="sm" className="itinerary-point-address">
                                                            {(direccion || '').trim()}
                                                        </Text>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* IMPRESIÓN: solo primeras N paradas */}
                                    <div className="print-only">
                                        {(presupuesto.puntosEntrega || [])
                                            .slice(0, MAX_PRINT_ITINERARY)
                                            .map((punto, idx) => {
                                                const [titulo, direccion] = String(punto?.nombre ?? '').split('–');
                                                return (
                                                    <div key={`it-print-${idx}`} className="itinerary-node">
                                                        <div className="itinerary-icon">
                                                            <span className="itinerary-index">{idx + 1}</span>
                                                        </div>
                                                        <div className="itinerary-details">
                                                            <Text fw={600} size="sm" className="itinerary-point-name">
                                                                {(titulo || '').trim()}
                                                            </Text>
                                                            <Text c="dimmed" size="sm" className="itinerary-point-address">
                                                                {(direccion || '').trim()}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                        {/* Si hay más paradas que las que imprimimos, mostramos aviso */}
                                        {presupuesto.puntosEntrega.length > MAX_PRINT_ITINERARY && (
                                            <Text size="sm" c="dimmed">
                                                …y {presupuesto.puntosEntrega.length - MAX_PRINT_ITINERARY} puntos más.
                                                Escaneá el QR para ver el itinerario completo en Google Maps.
                                            </Text>
                                        )}
                                    </div>
                                </div>

                                {qrCodeUrl && (
                                    <Paper p="md" radius="md" className="qr-paper-final">
                                        <Group>
                                            <img src={qrCodeUrl} alt="Código QR para Google Maps" className="qr-code-image-final" />
                                            <div style={{ flex: 1 }}>
                                                <Text size="sm" fw={500}>Ver Ruta en tu Móvil</Text>
                                                <Text size="xs" c="dimmed">Escaneá para abrir la ruta en Google Maps.</Text>
                                            </div>
                                        </Group>
                                    </Paper>
                                )}
                            </Grid.Col>

                        </Grid>

                        <h3 className="section-subtitle">Términos y Próximos Pasos</h3>
                        <Textarea
                            readOnly
                            variant="unstyled"
                            value={presupuesto.terminos || 'Validez de la oferta: 15 días.'}
                            autosize
                            className="terms-textarea"
                        />

                        <Grid mt="xl" className="signature-area">
                            <Grid.Col span={6}>
                                <div className="signature-box">
                                    <p className="signature-line" />
                                    <p className="signature-title">Firma por Sol del Amanecer SRL</p>
                                </div>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <div className="signature-box">
                                    <p className="signature-line" />
                                    <p className="signature-title">Firma y Aclaración del Cliente</p>
                                </div>
                            </Grid.Col>
                        </Grid>
                    </div>
                    <Footer pageNumber={3} totalPages={3} />
                </div>
            </div>
        </div>
    );
};

export default PropuestaPage;
