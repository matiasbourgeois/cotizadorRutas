import {
  Container, Title, Text, Paper, Group, Stack, NumberInput, Button,
  ThemeIcon, Divider, Alert, Tabs, SimpleGrid, LoadingOverlay, Badge
} from '@mantine/core';
import { useState, useEffect } from 'react';
import {
  Settings, Save, Fuel, Wrench, Disc, Info, Truck, Car, Users,
  Calculator, DollarSign, Shield, Clock, Gauge,
  Weight, Box as BoxIcon, Zap
} from 'lucide-react';
import { notifications } from '@mantine/notifications';
import clienteAxios from '../../api/clienteAxios';

// ═══════════════════════════════════════════════════════════════════
// Campo numérico reutilizable con format helpers
// ═══════════════════════════════════════════════════════════════════
const Campo = ({ label, value, onChange, prefix = '', suffix = '', min = 0, max, step, decimalScale = 0 }) => (
  <NumberInput
    label={label}
    value={value ?? ''}
    onChange={onChange}
    prefix={prefix}
    suffix={suffix}
    min={min}
    max={max}
    step={step}
    decimalScale={decimalScale}
    thousandSeparator="."
    decimalSeparator=","
    styles={{ label: { fontSize: 12, marginBottom: 4 } }}
  />
);

// ═══════════════════════════════════════════════════════════════════
// Sección con icono + título
// ═══════════════════════════════════════════════════════════════════
const Seccion = ({ icon: Icon, color, titulo, children }) => (
  <Paper withBorder p="md" radius="md" shadow="sm">
    <Group mb="sm">
      <ThemeIcon color={color} variant="light" size="lg" radius="md">
        <Icon size={18} />
      </ThemeIcon>
      <Text fw={700} fz="sm">{titulo}</Text>
    </Group>
    {children}
  </Paper>
);

// ═══════════════════════════════════════════════════════════════════
// Sub-tab para un tipo de vehículo
// ═══════════════════════════════════════════════════════════════════
const VehiculoForm = ({ data, onChange }) => {
  const set = (campo, val) => onChange({ ...data, [campo]: val });

  return (
    <Stack gap="md">
      <Seccion icon={Fuel} color="orange" titulo="Combustible">
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Campo label="Precio combustible ($/L)" value={data.precioLitroCombustible} onChange={v => set('precioLitroCombustible', v)} prefix="$" />
          <Campo label="Precio GNC ($/m³)" value={data.precioGNC} onChange={v => set('precioGNC', v)} prefix="$" />
          <Campo label="Rendimiento (km/L)" value={data.rendimientoKmLitro} onChange={v => set('rendimientoKmLitro', v)} suffix=" km/L" decimalScale={1} />
        </SimpleGrid>
      </Seccion>

      <Seccion icon={Gauge} color="cyan" titulo="Capacidad">
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Campo label="Capacidad (kg)" value={data.capacidadKg} onChange={v => set('capacidadKg', v)} suffix=" kg" />
          <Campo label="Volumen (m³)" value={data.volumenM3} onChange={v => set('volumenM3', v)} suffix=" m³" decimalScale={1} />
          <Campo label="Cantidad cubiertas" value={data.cantidadCubiertas} onChange={v => set('cantidadCubiertas', v)} />
        </SimpleGrid>
      </Seccion>

      <Seccion icon={DollarSign} color="teal" titulo="Precios de Referencia">
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Campo label="Precio cubierta ($)" value={data.precioCubierta} onChange={v => set('precioCubierta', v)} prefix="$" />
          <Campo label="Cambio aceite ($)" value={data.precioCambioAceite} onChange={v => set('precioCambioAceite', v)} prefix="$" />
          <Campo label="Vehículo nuevo ($)" value={data.precioVehiculoNuevo} onChange={v => set('precioVehiculoNuevo', v)} prefix="$" />
        </SimpleGrid>
      </Seccion>

      <Seccion icon={Shield} color="violet" titulo="Costos Fijos Mensuales">
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Campo label="Mantenimiento preventivo ($)" value={data.costoMantenimientoPreventivoMensual} onChange={v => set('costoMantenimientoPreventivoMensual', v)} prefix="$" />
          <Campo label="Seguro ($)" value={data.costoSeguroMensual} onChange={v => set('costoSeguroMensual', v)} prefix="$" />
          <Campo label="Patente Municipal ($)" value={data.costoPatenteMunicipal} onChange={v => set('costoPatenteMunicipal', v)} prefix="$" />
          <Campo label="Patente Provincial ($)" value={data.costoPatenteProvincial} onChange={v => set('costoPatenteProvincial', v)} prefix="$" />
        </SimpleGrid>
      </Seccion>

      <Seccion icon={Wrench} color="red" titulo="Desgaste y Vida Útil">
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Campo label="Vida útil vehículo (km)" value={data.kmsVidaUtilVehiculo} onChange={v => set('kmsVidaUtilVehiculo', v)} suffix=" km" />
          <Campo label="Vida útil cubiertas (km)" value={data.kmsVidaUtilCubiertas} onChange={v => set('kmsVidaUtilCubiertas', v)} suffix=" km" />
          <Campo label="Kms cambio aceite" value={data.kmsCambioAceite} onChange={v => set('kmsCambioAceite', v)} suffix=" km" />
          <Campo label="Valor residual (%)" value={data.valorResidualPorcentaje} onChange={v => set('valorResidualPorcentaje', v)} suffix="%" max={100} />
        </SimpleGrid>
      </Seccion>
    </Stack>
  );
};

// ═══════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════

const TIPO_LABELS = {
  utilitario: { label: 'Utilitario', icon: Car, color: 'cyan' },
  mediano: { label: 'Mediano', icon: Truck, color: 'teal' },
  grande: { label: 'Grande', icon: Truck, color: 'violet' },
  camion: { label: 'Camión', icon: Truck, color: 'red' },
};

const ConfiguracionGlobal = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch config on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await clienteAxios.get('/configuracion-defaults');
        setConfig(data);
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'No se pudieron cargar los valores predefinidos.',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // Save handler
  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await clienteAxios.put('/configuracion-defaults', {
        vehiculos: config.vehiculos,
        recursosHumanos: config.recursosHumanos,
        calculos: config.calculos,
      });
      setConfig(data);
      notifications.show({
        title: 'Configuración actualizada ✅',
        message: 'Los nuevos vehículos y personal se crearán con estos valores.',
        color: 'teal',
      });
    } catch (error) {
      notifications.show({
        title: 'Error al guardar',
        message: error.response?.data?.error || 'Error desconocido.',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };



  // Updater helpers
  const setVehiculo = (tipo, data) => {
    setConfig(prev => ({
      ...prev,
      vehiculos: { ...prev.vehiculos, [tipo]: data },
    }));
  };

  const setRRHH = (campo, val) => {
    setConfig(prev => ({
      ...prev,
      recursosHumanos: { ...prev.recursosHumanos, [campo]: val },
    }));
  };

  const setCalculo = (campo, val) => {
    setConfig(prev => ({
      ...prev,
      calculos: { ...prev.calculos, [campo]: val },
    }));
  };

  if (loading) {
    return (
      <Container size="lg" pos="relative" mih={400}>
        <LoadingOverlay visible />
      </Container>
    );
  }

  if (!config) {
    return (
      <Container size="lg">
        <Alert color="red" title="Error">No se pudo cargar la configuración.</Alert>
      </Container>
    );
  }

  return (
    <Container size="lg">
      {/* Header */}
      <Group mb="lg">
        <Group>
          <ThemeIcon color="orange" variant="light" size="xl" radius="md">
            <Settings size={22} />
          </ThemeIcon>
          <div>
            <Title order={2} c="var(--app-brand-primary)">Configuración de Predefinidos</Title>
            <Text c="dimmed" size="sm">
              Valores que se aplican automáticamente al crear vehículos y personal nuevos
            </Text>
          </div>
        </Group>
      </Group>

      <Alert icon={<Info size={18} />} color="cyan" variant="light" mb="lg" radius="md">
        Al modificar estos valores, los <b>próximos vehículos y personal</b> que crees se cargarán con estos datos automáticamente. Los registros existentes no se modifican.
      </Alert>

      {/* Main tabs */}
      <Tabs defaultValue="vehiculos" variant="pills" radius="md">
        <Tabs.List mb="lg">
          <Tabs.Tab value="vehiculos" leftSection={<Truck size={16} />}>
            Vehículos
            <Badge size="xs" ml={6} color="cyan" variant="light">4 tipos</Badge>
          </Tabs.Tab>
          <Tabs.Tab value="rrhh" leftSection={<Users size={16} />}>
            Recursos Humanos
          </Tabs.Tab>
          <Tabs.Tab value="calculos" leftSection={<Calculator size={16} />}>
            Constantes de Cálculo
          </Tabs.Tab>
        </Tabs.List>

        {/* ════════ TAB VEHÍCULOS ════════ */}
        <Tabs.Panel value="vehiculos">
          <Tabs defaultValue="utilitario" variant="outline" radius="md">
            <Tabs.List mb="md">
              {Object.entries(TIPO_LABELS).map(([tipo, { label, icon: Icon, color }]) => (
                <Tabs.Tab key={tipo} value={tipo} leftSection={<Icon size={14} />} color={color}>
                  {label}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {Object.keys(TIPO_LABELS).map(tipo => (
              <Tabs.Panel key={tipo} value={tipo}>
                <VehiculoForm
                  data={config.vehiculos?.[tipo] || {}}
                  onChange={data => setVehiculo(tipo, data)}
                />
              </Tabs.Panel>
            ))}
          </Tabs>
        </Tabs.Panel>

        {/* ════════ TAB RRHH ════════ */}
        <Tabs.Panel value="rrhh">
          <Stack gap="md">
            <Seccion icon={DollarSign} color="teal" titulo="Sueldo y Adicionales Base">
              <SimpleGrid cols={{ base: 1, sm: 3 }}>
                <Campo label="Sueldo Básico ($)" value={config.recursosHumanos?.sueldoBasico} onChange={v => setRRHH('sueldoBasico', v)} prefix="$" />
                <Campo label="Adicional Actividad (%)" value={config.recursosHumanos?.adicionalActividadPorc} onChange={v => setRRHH('adicionalActividadPorc', v)} suffix="%" decimalScale={1} />
                <Campo label="Adicional No Rem. Fijo ($)" value={config.recursosHumanos?.adicionalNoRemunerativoFijo} onChange={v => setRRHH('adicionalNoRemunerativoFijo', v)} prefix="$" />
              </SimpleGrid>
            </Seccion>

            <Seccion icon={Gauge} color="cyan" titulo="Adicionales por Kilómetro">
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Campo label="Adicional km Remunerativo ($/km)" value={config.recursosHumanos?.adicionalKmRemunerativo} onChange={v => setRRHH('adicionalKmRemunerativo', v)} prefix="$" decimalScale={2} />
                <Campo label="Mínimo km Remunerativo" value={config.recursosHumanos?.minKmRemunerativo} onChange={v => setRRHH('minKmRemunerativo', v)} suffix=" km" />
                <Campo label="Viático por km No Rem. ($/km)" value={config.recursosHumanos?.viaticoPorKmNoRemunerativo} onChange={v => setRRHH('viaticoPorKmNoRemunerativo', v)} prefix="$" decimalScale={2} />
                <Campo label="Mínimo km No Remunerativo" value={config.recursosHumanos?.minKmNoRemunerativo} onChange={v => setRRHH('minKmNoRemunerativo', v)} suffix=" km" />
              </SimpleGrid>
            </Seccion>

            <Seccion icon={Weight} color="orange" titulo="Carga y Descarga">
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Campo label="Adicional carga/descarga ($)" value={config.recursosHumanos?.adicionalCargaDescargaCadaXkm} onChange={v => setRRHH('adicionalCargaDescargaCadaXkm', v)} prefix="$" decimalScale={2} />
                <Campo label="Cada cuántos km aplica" value={config.recursosHumanos?.kmPorUnidadDeCarga} onChange={v => setRRHH('kmPorUnidadDeCarga', v)} suffix=" km" />
              </SimpleGrid>
            </Seccion>

            <Seccion icon={Clock} color="violet" titulo="Jornada Laboral">
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Campo label="Horas laborales mensuales" value={config.recursosHumanos?.horasLaboralesMensuales} onChange={v => setRRHH('horasLaboralesMensuales', v)} suffix=" hs" />
                <Campo label="Mínimo minutos facturables" value={config.recursosHumanos?.minimoMinutosFacturables} onChange={v => setRRHH('minimoMinutosFacturables', v)} suffix=" min" />
              </SimpleGrid>
            </Seccion>

            <Divider label="Por tipo de contratación" labelPosition="center" />

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <Seccion icon={Users} color="blue" titulo="Empleado (Rel. Dependencia)">
                <Campo label="Cargas Sociales (%)" value={config.recursosHumanos?.porcentajeCargasSociales} onChange={v => setRRHH('porcentajeCargasSociales', v)} suffix="%" max={100} />
              </Seccion>

              <Seccion icon={Zap} color="yellow" titulo="Contratado (Monotributista)">
                <Campo label="Overhead (%)" value={config.recursosHumanos?.porcentajeOverheadContratado} onChange={v => setRRHH('porcentajeOverheadContratado', v)} suffix="%" max={100} />
              </Seccion>
            </SimpleGrid>
          </Stack>
        </Tabs.Panel>

        {/* ════════ TAB CÁLCULOS ════════ */}
        <Tabs.Panel value="calculos">
          <Stack gap="md">
            <Alert icon={<Info size={16} />} color="orange" variant="light" radius="md">
              Estas constantes afectan a <b>todos los cálculos</b> del sistema.
              Modificar con precaución.
            </Alert>

            <Seccion icon={Clock} color="cyan" titulo="Tiempos de Misión">
              <SimpleGrid cols={{ base: 1, sm: 3 }}>
                <Campo label="Carga/Descarga (min)" value={config.calculos?.tiempoCargaDescargaMin} onChange={v => setCalculo('tiempoCargaDescargaMin', v)} suffix=" min" />
                <Campo label="Umbral jornada completa (min)" value={config.calculos?.umbralJornadaCompletaMin} onChange={v => setCalculo('umbralJornadaCompletaMin', v)} suffix=" min" />
                <Campo label="Jornada completa (min)" value={config.calculos?.jornadaCompletaMinutos} onChange={v => setCalculo('jornadaCompletaMinutos', v)} suffix=" min" />
              </SimpleGrid>
            </Seccion>

            <Seccion icon={Fuel} color="orange" titulo="Combustible y Carga">
              <SimpleGrid cols={{ base: 1, sm: 3 }}>
                <Campo label="Factor GNC (×)" value={config.calculos?.factorRendimientoGNC} onChange={v => setCalculo('factorRendimientoGNC', v)} suffix="×" decimalScale={2} step={0.01} />
                <Campo label="Factor carga refrigerada (×)" value={config.calculos?.factorCargaRefrigerada} onChange={v => setCalculo('factorCargaRefrigerada', v)} suffix="×" decimalScale={2} step={0.01} />
                <Campo label="Costo adicional km peligrosa ($)" value={config.calculos?.costoAdicionalKmPeligrosa} onChange={v => setCalculo('costoAdicionalKmPeligrosa', v)} prefix="$" />
              </SimpleGrid>
            </Seccion>

            <Seccion icon={Calculator} color="violet" titulo="Parámetros del Mes">
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Campo label="Semanas por mes" value={config.calculos?.semanasPorMes} onChange={v => setCalculo('semanasPorMes', v)} decimalScale={2} step={0.01} />
                <Campo label="Días laborales por mes" value={config.calculos?.diasLaboralesMes} onChange={v => setCalculo('diasLaboralesMes', v)} />
              </SimpleGrid>
            </Seccion>
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* Bottom save bar */}
      <Divider my="lg" />
      <Group justify="flex-end">
        <Button
          size="lg"
          color="cyan"
          leftSection={<Save size={18} />}
          onClick={handleSave}
          loading={saving}
        >
          Guardar Configuración
        </Button>
      </Group>
    </Container>
  );
};

export default ConfiguracionGlobal;
