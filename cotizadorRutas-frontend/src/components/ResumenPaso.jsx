// Archivo: src/components/ResumenPaso.jsx — Rediseño compacto + acordeón exclusivo
import { useMemo, useState } from 'react';
import { useCotizacion } from '../context/Cotizacion'; // ← ajustá si tu ruta es distinta
import {
  Paper, Title, Text, Stack, Group, ThemeIcon, Divider, Center,
  Loader, Progress, Grid, Badge
} from '@mantine/core';
import { MapPin, Calendar, Truck, User, AlertCircle, Clock, Route, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import '../styles/ResumenPaso.css';

// ─────────────────────────── Subcomponentes ───────────────────────────
const Kpi = ({ icon: Icon, label, value }) => (
  <Grid.Col span={6}>
    <Group gap="sm" wrap="nowrap">
      <ThemeIcon color="gray" variant="light" size={34} radius="md">
        <Icon size={18} />
      </ThemeIcon>
      <div>
        <Text fz="xs" c="dimmed" lh={1.2}>{label}</Text>
        <Text fz="sm" fw={700} c="deep-blue.8">{value}</Text>
      </div>
    </Group>
  </Grid.Col>
);

const RowItem = ({ label, valor }) => (
  <Group justify="space-between" gap="xs" mt={4}>
    <Text fz="xs" c="dimmed">{label}</Text>
    <Text fz="xs" fw={600}>
      ${(Number(valor) || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
    </Text>
  </Group>
);

// Ahora la card NO maneja estado propio: recibe open/onToggle del padre
const CostCard = ({ icon: Icon, title, selection, cost, children, isLoading, color, open = false, onToggle }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Paper
        withBorder
        radius="md"
        p="md"
        onClick={() => selection && onToggle?.()}
        style={{ cursor: selection ? 'pointer' : 'default' }}
      >
        <Stack gap="xs">
          <Group justify="space-between" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              <ThemeIcon color={color} variant="light" size="lg" radius="md">
                <Icon size={18} />
              </ThemeIcon>
              <Text fz="sm" fw={700}>{title}</Text>
              {selection && (
                <Badge size="sm" variant="light" color="gray" title={selection} style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selection}
                </Badge>
              )}
            </Group>
            {selection && (
              <ChevronDown
                size={18}
                color="var(--mantine-color-gray-5)"
                style={{ transform: `rotate(${open ? 180 : 0}deg)`, transition: 'transform .16s ease' }}
              />
            )}
          </Group>

          {isLoading ? (
            <Center py={2}><Loader size="xs" color="gray" /></Center>
          ) : (
            <Group justify="space-between" pl={4} pr={2}>
              <Text fz="xs" c="dimmed">Costo estimado</Text>
              <Text fz="lg" fw={800} c="deep-blue.7">
                ${(Number(cost) || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
              </Text>
            </Group>
          )}

          <AnimatePresence>
            {open && !isLoading && (
              <motion.div
                key="body"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Divider my="xs" />
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </Stack>
      </Paper>
    </motion.div>
  );
};

// ─────────────────────────── Componente principal ───────────────────────────
const ResumenPaso = () => {
  const {
    puntosEntrega, frecuencia, vehiculo, recursoHumano,
    detalleVehiculo, detalleRecurso, resumenCostos
  } = useCotizacion();

  const location = useLocation();
  // Paso final: usá tu ruta real. Esto cubre /configuracion, /configuracion-presupuesto, etc.
  const esPasoFinal = /configuracion/i.test(location.pathname);

  // Controla qué card está abierta (acordeón exclusivo)
  const [openCard, setOpenCard] = useState(null); // 'vehiculo' | 'recurso' | null

  if (!puntosEntrega) {
    return (
      <Paper withBorder p="lg" radius="md" shadow="sm" style={{ height: '100%', maxHeight: '100vh' }}>
        <Center h={200}>
          <Stack align="center" gap="xs">
            <AlertCircle size={28} color="var(--mantine-color-gray-4)" />
            <Text c="dimmed" size="sm" ta="center">Define una ruta para activar el resumen.</Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  // Frecuencia y KMs
  const distanciaPorViaje = Number(puntosEntrega.distanciaKm) || 0;
  const duracionPorViaje = Number(puntosEntrega.duracionMin) || 0;

  let frecuenciaTexto = 'No definida';
  let kmsTotales = distanciaPorViaje;
  if (frecuencia) {
    if (frecuencia.tipo === 'esporadico') {
      const vueltas = Number(frecuencia.vueltasTotales) || 1;
      frecuenciaTexto = `${vueltas} viaje(s)`;
      kmsTotales *= vueltas;
    } else {
      const viajesMensuales = (frecuencia.diasSeleccionados?.length || 0) * (Number(frecuencia.viajesPorDia) || 1) * 4.12;
      frecuenciaTexto = `~${viajesMensuales.toFixed(1)} viajes/mes`;
      kmsTotales *= viajesMensuales;
    }
  }

  // Resumen costos
  const {
    totalVehiculo = 0,
    totalRecurso = 0,
    totalOperativo = 0,
    totalFinal = 0
  } = resumenCostos || {};

  const totalOtrosCalc = totalOperativo - totalVehiculo - totalRecurso;
  const totalOtros = totalOtrosCalc < 0 ? 0 : totalOtrosCalc;

  const pctVehiculo = totalOperativo > 0 ? (totalVehiculo / totalOperativo) * 100 : 0;
  const pctRecurso  = totalOperativo > 0 ? (totalRecurso  / totalOperativo) * 100 : 0;
  const pctOtros    = totalOperativo > 0 ? (totalOtros    / totalOperativo) * 100 : 0;

  return (
    <Paper
      withBorder
      p="lg"
      radius="md"
      shadow="sm"
      className="resumen-shell"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxHeight: '100vh', // jamás más alto que la ventana
        overflow: 'hidden'  // sin scroll interno
      }}
    >
      {/* Encabezado */}
      <Group justify="space-between" align="center">
        <Title order={4} c="deep-blue.7">Panel de Misión</Title>
        <Badge variant="light" color={frecuencia ? 'cyan' : 'gray'} size="sm">
          {frecuencia ? 'FRECUENCIA DEFINIDA' : 'FRECUENCIA PENDIENTE'}
        </Badge>
      </Group>

      {/* KPIs compactos */}
      <Grid gutter="xs">
        <Kpi icon={MapPin}  label="Distancia / viaje" value={`${distanciaPorViaje.toFixed(1)} km`} />
        <Kpi icon={Clock}   label="Tiempo / viaje"    value={`${duracionPorViaje} min`} />
        <Kpi icon={Calendar} label="Frecuencia"       value={frecuenciaTexto} />
        <Kpi icon={Route}    label="Distancia Total"  value={`${kmsTotales.toFixed(0)} km`} />
      </Grid>

      <Divider />

      {/* Tarjetas (acordeón exclusivo, colapsadas por defecto) */}
      <Stack gap="xs" style={{ flexShrink: 0 }}>
        {frecuencia && (
          <CostCard
            icon={Truck}
            title="Vehículo"
            selection={vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}` : null}
            cost={detalleVehiculo?.totalFinal}
            isLoading={!!vehiculo && !detalleVehiculo}
            color="cyan"
            open={openCard === 'vehiculo'}
            onToggle={() => setOpenCard(openCard === 'vehiculo' ? null : 'vehiculo')}
          >
            <RowItem
              label="Combustible y Desgaste"
              valor={
                (detalleVehiculo?.detalle?.combustible || 0) +
                (detalleVehiculo?.detalle?.cubiertas || 0) +
                (detalleVehiculo?.detalle?.aceite || 0)
              }
            />
            <RowItem label="Depreciación"           valor={detalleVehiculo?.detalle?.depreciacion} />
            <RowItem label="Costos Fijos Asignados" valor={detalleVehiculo?.detalle?.costosFijosProrrateados} />
          </CostCard>
        )}

        {vehiculo && (
          <CostCard
            icon={User}
            title="Recurso Humano"
            selection={recursoHumano?.nombre}
            cost={detalleRecurso?.totalFinal}
            isLoading={!!recursoHumano && !detalleRecurso}
            color="blue"
            open={openCard === 'recurso'}
            onToggle={() => setOpenCard(openCard === 'recurso' ? null : 'recurso')}
          >
            <RowItem
              label="Costo Base y Adicionales"
              valor={
                (detalleRecurso?.detalle?.costoBaseRemunerativo || 0) +
                (detalleRecurso?.detalle?.adicionalKm || 0) +
                (detalleRecurso?.detalle?.adicionalPorCargaDescarga || 0)
              }
            />
            <RowItem
              label="Viáticos y No Remunerativos"
              valor={
                (detalleRecurso?.detalle?.viaticoKm || 0) +
                (detalleRecurso?.detalle?.adicionalFijoNoRemunerativo || 0)
              }
            />
            <RowItem
              label={detalleRecurso?.detalle?.costoIndirectoLabel || 'Costos Indirectos'}
              valor={detalleRecurso?.detalle?.costoIndirecto}
            />
          </CostCard>
        )}
      </Stack>

      {/* Overview final (solo en el paso 5). Compacto y sin labels internos en el progreso */}
      {esPasoFinal && resumenCostos && (
        <Stack gap="xs" style={{ flexShrink: 0 }}>
          <Divider label="Resumen Final" labelPosition="center" />

          <Progress.Root size={18} radius="sm">
            <Progress.Section value={pctVehiculo} color="cyan"  tooltip={`Vehículo: $${(totalVehiculo || 0).toLocaleString('es-AR')}`} />
            <Progress.Section value={pctRecurso}  color="blue"  tooltip={`RRHH: $${(totalRecurso || 0).toLocaleString('es-AR')}`} />
            <Progress.Section value={pctOtros}    color="indigo" tooltip={`Otros: $${(totalOtros || 0).toLocaleString('es-AR')}`} />
          </Progress.Root>

          <Group justify="center" gap="sm" mt={2}>
            <Text fz="xs">Vehículo ({pctVehiculo.toFixed(1)}%)</Text>
            <Text fz="xs">RRHH ({pctRecurso.toFixed(1)}%)</Text>
            <Text fz="xs">Otros ({pctOtros.toFixed(1)}%)</Text>
          </Group>

          <Paper withBorder p="sm" radius="md" bg="gray.0">
            <Group justify="space-between">
              <Text fz="sm" c="dimmed" fw={600}>Costo Operativo</Text>
              <Text fz="lg" fw={700}>${(totalOperativo || 0).toLocaleString('es-AR')}</Text>
            </Group>
          </Paper>

          <Paper p="md" radius="md" bg="teal.0">
            <Group justify="space-between" align="flex-start">
              <Stack gap={0}>
                <Text fz="lg" fw={800} c="teal.9">Precio Venta</Text>
                <Text fz="xs" c="teal.8">(sin IVA)</Text>
              </Stack>
              <Text fz={26} fw={900} c="teal.9" lh={1}>
                ${(totalFinal || 0).toLocaleString('es-AR')}
              </Text>
            </Group>
          </Paper>
        </Stack>
      )}
    </Paper>
  );
};

export default ResumenPaso;
