// cotizadorRutas-frontend/src/pages/desglosePage/partials/CapituloRutaFrecuencia.jsx

import { Paper, Title, Grid, Text, Group, ThemeIcon, Stack, Center, Divider, Badge } from '@mantine/core';
import { Route, Calendar, Repeat } from 'lucide-react';
import MapaRuta from '../../../components/MapaRuta';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

// Componente para los días de la semana
const WeekdayPickerVisual = ({ diasSeleccionados = [] }) => {
    const weekDays = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
    return (
        <Group justify="center" gap="xs">
            {weekDays.map(day => {
                const inicial = day.charAt(0).toUpperCase();
                const isSelected = diasSeleccionados.includes(day);
                return (
                    <ThemeIcon key={day} size="lg" radius="xl" color={isSelected ? 'cyan' : 'gray'}>
                        <Text size="xs" fw={700}>{inicial}</Text>
                    </ThemeIcon>
                );
            })}
        </Group>
    );
};


const CapituloRutaFrecuencia = ({ presupuesto }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        if (presupuesto?.puntosEntrega?.length >= 2) {
            const puntos = presupuesto.puntosEntrega;
            const origin = `${puntos[0].lat},${puntos[0].lng}`;
            const destination = `${puntos[puntos.length - 1].lat},${puntos[puntos.length - 1].lng}`;
            const waypoints = puntos.slice(1, -1).map(p => `${p.lat},${p.lng}`).join('|');
            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}`;

            QRCode.toDataURL(googleMapsUrl, { width: 180, margin: 2 })
                .then(url => setQrCodeUrl(url))
                .catch(err => console.error('Error al generar QR:', err));
        }
    }, [presupuesto.puntosEntrega]);


    return (
        <div className="page">
            <div className="header-table-placeholder"></div>
            <div className="content">
                <Title order={2} className="chapter-title">Capítulo 1: Análisis de Ruta y Frecuencia</Title>
                <Text c="dimmed" mb="xl">
                    Detalles operativos del recorrido, los puntos de entrega y la cadencia programada del servicio.
                </Text>

                <Grid gutter="xl">
                    {/* COLUMNA IZQUIERDA: Mapa e Itinerario */}
                    <Grid.Col span={7}>
                        <Stack>
                            <Paper withBorder radius="md" p={4} shadow="sm" className="map-container-final">
                                 <MapaRuta
                                    puntos={presupuesto.puntosEntrega}
                                    onRutaCalculada={() => {}} // No necesita recalcular aquí
                                />
                            </Paper>
                             <Title order={4} className="section-subtitle" mt="md">Itinerario de Entrega</Title>
                             <div className="itinerary-wrapper">
                                {presupuesto.puntosEntrega.map((punto, index) => (
                                    <div key={index} className="itinerary-node">
                                        <div className="itinerary-icon"><Text fw={700} c="white">{index + 1}</Text></div>
                                        <div className="itinerary-details">
                                            <Text fw={600} size="md">{punto.nombre.split('–')[0].trim()}</Text>
                                            <Text c="dimmed" size="sm">{punto.nombre.split('–')[1]?.trim()}</Text>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Stack>
                    </Grid.Col>

                    {/* COLUMNA DERECHA: Frecuencia y QR */}
                    <Grid.Col span={5}>
                         <Stack>
                            <Paper withBorder p="lg" radius="md">
                                 <Title order={4} className="section-subtitle">Frecuencia del Servicio</Title>
                                <Divider my="sm"/>
                                {presupuesto.frecuencia.tipo === 'mensual' ? (
                                    <Stack align="center" gap="md">
                                        <Badge size="xl" variant="light" color="blue" leftSection={<Calendar size={18}/>}>Servicio Mensual</Badge>
                                        <WeekdayPickerVisual diasSeleccionados={presupuesto.frecuencia.diasSeleccionados} />
                                        <Text size="sm">Viajes por día: <strong>{presupuesto.frecuencia.viajesPorDia}</strong></Text>
                                        <Text size="sm" c="dimmed">Total proyectado: <strong>~{((presupuesto.frecuencia.diasSeleccionados?.length || 0) * (presupuesto.frecuencia.viajesPorDia || 1) * 4.33).toFixed(1)} viajes/mes</strong></Text>
                                    </Stack>
                                ) : (
                                    <Stack gap="lg">
                                        <Group>
                                            <ThemeIcon variant="light" color="gray" size="lg" radius="md">
                                                <Repeat size={20} />
                                            </ThemeIcon>
                                            <Title order={5} c="dimmed">Servicio Esporádico</Title>
                                        </Group>
                                        <Center>
                                            <Stack align="center" gap={0}>
                                                <Text fz={48} fw={700} c="gray.8" lh={1}>
                                                    {presupuesto.frecuencia.vueltasTotales}
                                                </Text>
                                                <Text c="dimmed">Viajes Totales Programados</Text>
                                            </Stack>
                                        </Center>
                                    </Stack>
                                )}
                            </Paper>
                            {qrCodeUrl && (
                                <Paper withBorder p="lg" radius="md" mt="md">
                                    <Title order={5} ta="center" mb="md">Ver Ruta en Móvil</Title>
                                    <Center><img src={qrCodeUrl} alt="Código QR para Google Maps" className="qr-code-image-final" /></Center>
                                </Paper>
                            )}
                        </Stack>
                    </Grid.Col>
                </Grid>
            </div>
            <div className="footer-placeholder"></div>
        </div>
    );
};

export default CapituloRutaFrecuencia;