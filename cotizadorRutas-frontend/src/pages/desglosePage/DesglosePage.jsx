// Archivo: src/pages/desglosePage/DesglosePage.jsx (Versión Orquestador)

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import clienteAxios from '../../api/clienteAxios';
import { Loader, Center, Text, Paper, Title, Button, Grid, Group, SimpleGrid, ThemeIcon, Divider, Stack } from '@mantine/core';
import { Printer, Calendar, MapPin, Truck, Box, Clock } from 'lucide-react';
import './DesglosePage.css';

// ✅ IMPORTAMOS NUESTRO NUEVO COMPONENTE "PARCIAL"
import CapituloVehiculoFicha from './partials/CapituloVehiculoFicha';
import CapituloVehiculoCostos from './partials/CapituloVehiculoCostos';
import CapituloRecursoHumanoFicha from './partials/CapituloRecursoHumanoFicha';
import CapituloRecursoHumanoCostos from './partials/CapituloRecursoHumanoCostos';   
import CapituloFinalConsolidado from './partials/CapituloFinalConsolidado';

const DesglosePage = () => {
    const { id } = useParams();
    const [presupuesto, setPresupuesto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerPresupuesto = async () => {
            try {
                const { data } = await clienteAxios.get(`/presupuestos/${id}`);
                setPresupuesto(data);
            } catch (error) {
                console.error("Error al obtener el presupuesto para el desglose:", error);
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
    <table className="header-table"><tbody><tr>
        {/* ✅ RUTA CORREGIDA para apuntar a tu logo local */}
        <td className="header-logo-cell"><img src="/icons/logosol.png" alt="Logo de la Empresa" /></td>
        <td className="header-info-cell"><h3>Sol del Amanecer SRL</h3><p>Transporte y Logística de Confianza</p></td>
    </tr></tbody></table>
);

    const Footer = ({ pageNumber }) => (
        <div className="footer"><Text size="xs" c="dimmed">Documento de Análisis Interno | Página {pageNumber}</Text></div>
    );
    
    if (loading) return <Center h="100vh"><Loader color="cyan" /></Center>;
    if (!presupuesto) return <Center h="100vh"><Text>Desglose de presupuesto no encontrado.</Text></Center>;

    return (
        <div className="propuesta-background">
            <div className="print-button-container">
                <Button leftSection={<Printer size={18} />} onClick={() => window.print()} size="lg" radius="xl">
                    Imprimir o Guardar PDF
                </Button>
            </div>

            <div className="page-container">
                {/* --- HOJA 1: PORTADA Y PARÁMETROS CLAVE --- */}
                <div className="page">
                    <Header />
                    <div className="content">
                        <Title order={1} className="main-title">Análisis de Costos y Rentabilidad</Title>
                        <Text c="dimmed" mb="xl">
                            Propuesta N°: {presupuesto._id} | Cliente: {presupuesto.cliente || 'No especificado'}
                        </Text>
                        <h2 className="section-title">Parámetros de la Misión</h2>
                        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                            <Paper withBorder p="md"><Group wrap="nowrap"><ThemeIcon variant="light"><MapPin size={20} /></ThemeIcon><div><Text size="xs" c="dimmed">Distancia/Viaje</Text><Text fw={600}>{presupuesto.totalKilometros.toFixed(2)} km</Text></div></Group></Paper>
                            <Paper withBorder p="md"><Group wrap="nowrap"><ThemeIcon variant="light"><Clock size={20} /></ThemeIcon><div><Text size="xs" c="dimmed">Duración/Viaje</Text><Text fw={600}>{formatDuration(presupuesto.duracionMin)}</Text></div></Group></Paper>
                            <Paper withBorder p="md"><Group wrap="nowrap"><ThemeIcon variant="light"><Calendar size={20} /></ThemeIcon><div><Text size="xs" c="dimmed">Frecuencia</Text><Text fw={600}>{presupuesto.frecuencia.tipo}</Text></div></Group></Paper>
                            <Paper withBorder p="md"><Group wrap="nowrap"><ThemeIcon variant="light"><Truck size={20} /></ThemeIcon><div><Text size="xs" c="dimmed">Viajes/Mes</Text><Text fw={600}>~{((presupuesto.frecuencia.diasSeleccionados?.length || 0) * (presupuesto.frecuencia.viajesPorDia || 1) * 4.33).toFixed(0)}</Text></div></Group></Paper>
                            <Paper withBorder p="md" span={2}><Group wrap="nowrap"><ThemeIcon variant="light"><Box size={20} /></ThemeIcon><div><Text size="xs" c="dimmed">Tipo de Carga</Text><Text fw={600}>{presupuesto.detallesCarga.tipo}</Text></div></Group></Paper>
                        </SimpleGrid>
                    </div>
                    <Footer pageNumber={1} />
                </div>

                {/* ✅ LLAMAMOS A NUESTRO NUEVO COMPONENTE PASÁNDOLE LA DATA */}
                <CapituloVehiculoFicha presupuesto={presupuesto} />
                <CapituloVehiculoCostos presupuesto={presupuesto} />
                <CapituloRecursoHumanoFicha presupuesto={presupuesto} />
                <CapituloRecursoHumanoCostos presupuesto={presupuesto} />
                <CapituloFinalConsolidado presupuesto={presupuesto} />

            </div>
        </div>
    );
};

export default DesglosePage;