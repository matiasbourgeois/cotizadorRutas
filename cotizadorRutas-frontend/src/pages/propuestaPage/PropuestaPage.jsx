// Archivo: src/pages/propuestaPage/PropuestaPage.jsx (Versión Final con Beneficios "Otro Universo")

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import clienteAxios from '../../api/clienteAxios';
import { Loader, Center, Text, Paper, Title, Button, Grid, Group, Divider, ThemeIcon, Stack, SimpleGrid, Textarea } from '@mantine/core';
import { Printer, Calendar, MapPin, Truck, Clock, CheckCircle2, Target, Satellite, ShieldCheck, MessageCircle } from 'lucide-react';
import MapaRuta from '../../components/MapaRuta';
import QRCode from 'qrcode';
import './PropuestaPage.css';

// --- Sub-componentes para un diseño más limpio ---
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

// ✅ NUEVO COMPONENTE "DISEÑO DIOS" PARA LOS BENEFICIOS
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
        if (hours > 0) { result += `${hours}h `; }
        if (minutes > 0 || hours === 0) { result += `${minutes}m`; }
        return result.trim();
    };

    const Header = () => (
        <table className="header-table">
            <tbody>
                <tr>
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

    return (
        <div className="propuesta-background">
            <div className="prop-print-button-container">
                <Button leftSection={<Printer size={18} />} onClick={() => window.print()} size="lg" radius="xl">
                    Imprimir o Guardar como PDF
                </Button>
            </div>
            
            <div className="prop-page-container">
                {/* --- PÁGINA 1: PORTADA IMPACTANTE --- */}
                <div className="prop-page prop-page-portada">
                    <div className="portada-overlay"></div>
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

                {/* --- PÁGINA 2: RESUMEN EJECUTIVO --- */}
                <div className="prop-page">
                    <Header />
                    <div className="content">
                        <Grid gutter="xl" className="prop-grid-resumen">
                            {/* COLUMNA IZQUIERDA: EL SERVICIO */}
                            <Grid.Col span={7} className="prop-col-7">
                                <Title order={2} className="section-title">Resumen de la Operación</Title>
                                <SimpleGrid cols={2} spacing="md">
                                    <KpiCard icon={<MapPin size={22}/>} label="Distancia por Viaje" value={`${presupuesto.totalKilometros.toFixed(1)} km`} />
                                    <KpiCard icon={<Clock size={22}/>} label="Duración Estimada" value={formatDuration(presupuesto.duracionMin)} />
                                    <KpiCard icon={<Truck size={22}/>} label="Vehículo Dedicado" value={`${presupuesto.vehiculo.datos.marca} ${presupuesto.vehiculo.datos.modelo}`} />
                                    <KpiCard icon={<Calendar size={22}/>} label="Frecuencia del Servicio" value={presupuesto.frecuencia.tipo} />
                                </SimpleGrid>
                                
                                {/* ✅ SECCIÓN DE BENEFICIOS "OTRO UNIVERSO" */}
                                <Paper p="lg" radius="md" mt="xl" withBorder>
                                    <Title order={4} className="section-subtitle" mt={0} mb="md">Nuestra Garantía de Servicio</Title>
                                    <SimpleGrid cols={3}>
                                        <BeneficioCard icon={<Satellite size={24} />} label="Seguimiento 24/7" description="Visibilidad total de su carga." />
                                        <BeneficioCard icon={<ShieldCheck size={24} />} label="Carga Asegurada" description="Protección completa ante imprevistos." />
                                        <BeneficioCard icon={<MessageCircle size={24} />} label="Atención Directa" description="Comunicación fluida y sin intermediarios." />
                                    </SimpleGrid>
                                </Paper>

                            </Grid.Col>

                            {/* COLUMNA DERECHA: LA INVERSIÓN */}
                            <Grid.Col span={5} className="prop-col-5">
                                <Paper withBorder p="xl" radius="md" shadow="md" className="prop-price-card">
                                    <Stack align="center" gap="xs">
                                        <ThemeIcon color="cyan" size={50} radius="xl"><Target size={28} /></ThemeIcon>
                                        <Text c="dimmed" tt="uppercase" size="sm" fw={700} mt="md">Inversión del Servicio</Text>
                                        <Title order={1} className="price-value">
                                            ${Math.round(presupuesto.resumenCostos.totalFinal).toLocaleString('es-AR')}
                                        </Title>
                                        <Text size="sm" c="dimmed" ta="center">(Valor mensual expresado en Pesos Argentinos, no incluye IVA)</Text>
                                    </Stack>
                                </Paper>
                            </Grid.Col>
                        </Grid>
                    </div>
                    <Footer pageNumber={2} totalPages={3} />
                </div>

                {/* --- PÁGINA 3: CONFIANZA OPERATIVA Y CIERRE --- */}
                <div className="prop-page">
                    <Header />
                    <div className="content">
                         <Grid gutter="xl" className="prop-grid-cierre">
                            <Grid.Col span={6} className="prop-col-6">
                                <Title order={2} className="section-title">Mapa de la Operación</Title>
                                <Paper withBorder radius="md" p={4} shadow="sm" className="prop-map-container">
                                    <MapaRuta
                                        puntos={presupuesto.puntosEntrega}
                                        onRutaCalculada={() => {}}
                                    />
                                </Paper>
                            </Grid.Col>
                            <Grid.Col span={6} className="prop-col-6">
                                <Title order={2} className="section-title">Itinerario de Entrega</Title>
                                <div className="itinerary-wrapper" style={{ marginTop: '1rem' }}>
                                    {presupuesto.puntosEntrega.map((punto, index) => (
                                        <div key={index} className="itinerary-node">
                                            <div className="itinerary-icon"><Text fw={700} c="white">{index + 1}</Text></div>
                                            <div className="itinerary-details">
                                                <Text fw={600} size="md" className="itinerary-point-name">{punto.nombre.split('–')[0].trim()}</Text>
                                                <Text c="dimmed" size="sm" className="itinerary-point-address">{punto.nombre.split('–')[1]?.trim()}</Text>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {qrCodeUrl && (
                                    <Paper p="md" radius="md" mt="lg" className="qr-paper-final">
                                        <Group>
                                            <img src={qrCodeUrl} alt="Código QR para Google Maps" className="qr-code-image-final" />
                                            <div style={{flex: 1}}><Text size="sm" fw={500}>Ver Ruta en tu Móvil</Text><Text size="xs" c="dimmed">Escanea para abrir la ruta en Google Maps.</Text></div>
                                        </Group>
                                    </Paper>
                                )}
                            </Grid.Col>
                        </Grid>
                        <Divider my="xl" />
                        <h3 className="section-subtitle">Términos y Próximos Pasos</h3>
                        <Textarea readOnly variant="unstyled" value={presupuesto.terminos || "Validez de la oferta: 15 días."} autosize className="terms-textarea" />
                        <Grid mt="xl" className="signature-area">
                            <Grid.Col span={6}><div className="signature-box"><p className="signature-line"></p><p className="signature-title">Firma por Sol del Amanecer SRL</p></div></Grid.Col>
                            <Grid.Col span={6}><div className="signature-box"><p className="signature-line"></p><p className="signature-title">Firma y Aclaración del Cliente</p></div></Grid.Col>
                        </Grid>
                    </div>
                    <Footer pageNumber={3} totalPages={3} />
                </div>
            </div>
        </div>
    );
};

export default PropuestaPage;