import {
  Container, Title, Text, Paper, Group, Stack, NumberInput, Button,
  ThemeIcon, Divider, Alert, Tabs, SimpleGrid, LoadingOverlay, Badge,
  TextInput, ColorInput, FileButton, Image, Avatar
} from '@mantine/core';
import { useState, useEffect } from 'react';
import {
  Settings, Save, Fuel, Wrench, Disc, Info, Truck, Car, Users,
  Calculator, DollarSign, Shield, Clock, Gauge,
  Weight, Box as BoxIcon, Zap, Building, Phone, Mail, MapPin, Palette, Upload
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
// Sub-tab EMPLEADO — CCT 40/89 (sueldo, adicionales, cargas)
// ═══════════════════════════════════════════════════════════════════
const EmpleadoDefaultsForm = ({ data, onChange }) => {
  const set = (campo, val) => onChange({ ...data, [campo]: val });

  return (
    <Stack gap="md">
      <Seccion icon={DollarSign} color="teal" titulo="Sueldo y Adicionales Base (CCT 40/89)">
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Campo label="Sueldo Básico ($)" value={data.sueldoBasico} onChange={v => set('sueldoBasico', v)} prefix="$" />
          <Campo label="Adicional Actividad (%)" value={data.adicionalActividadPorc} onChange={v => set('adicionalActividadPorc', v)} suffix="%" decimalScale={1} />
          <Campo label="Adicional No Rem. Fijo ($)" value={data.adicionalNoRemunerativoFijo} onChange={v => set('adicionalNoRemunerativoFijo', v)} prefix="$" />
        </SimpleGrid>
      </Seccion>

      <Seccion icon={Gauge} color="cyan" titulo="Adicionales por Kilómetro (CCT ITEMS 4.2.3 / 4.2.4)">
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Campo label="Adicional km Remunerativo ($/km)" value={data.adicionalKmRemunerativo} onChange={v => set('adicionalKmRemunerativo', v)} prefix="$" decimalScale={2} />
          <Campo label="Viático por km No Rem. ($/km)" value={data.viaticoPorKmNoRemunerativo} onChange={v => set('viaticoPorKmNoRemunerativo', v)} prefix="$" decimalScale={2} />
        </SimpleGrid>
      </Seccion>

      <Seccion icon={Weight} color="orange" titulo="Carga y Descarga (CCT ITEM 4.2.6)">
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Campo label="Adicional carga/descarga ($)" value={data.adicionalCargaDescargaCadaXkm} onChange={v => set('adicionalCargaDescargaCadaXkm', v)} prefix="$" decimalScale={2} />
          <Campo label="Cada cuántos km aplica" value={data.kmPorUnidadDeCarga} onChange={v => set('kmPorUnidadDeCarga', v)} suffix=" km" />
        </SimpleGrid>
      </Seccion>

      <Seccion icon={Clock} color="violet" titulo="Jornada Laboral">
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Campo label="Mínimo minutos facturables" value={data.minimoMinutosFacturables} onChange={v => set('minimoMinutosFacturables', v)} suffix=" min" />
        </SimpleGrid>
      </Seccion>

      <Seccion icon={Shield} color="blue" titulo="Cargas Sociales (AFIP/ANSES)">
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Campo label="Cargas Sociales (%)" value={data.porcentajeCargasSociales} onChange={v => set('porcentajeCargasSociales', v)} suffix="%" max={100} />
        </SimpleGrid>
      </Seccion>
    </Stack>
  );
};

// ═══════════════════════════════════════════════════════════════════
// Sub-tab CONTRATADO — Factor sobre empleado
// ═══════════════════════════════════════════════════════════════════
const ContratadoDefaultsForm = ({ data, onChange }) => {
  const set = (campo, val) => onChange({ ...data, [campo]: val });

  return (
    <Stack gap="md">
      <Seccion icon={DollarSign} color="teal" titulo="Factor sobre Empleado CCT">
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Campo label="Factor sobre empleado (%)" value={data.factorSobreEmpleado} onChange={v => set('factorSobreEmpleado', v)} suffix="%" max={100} min={1} />
        </SimpleGrid>
        <Text size="xs" c="dimmed" mt="sm">
          El contratado cobra este porcentaje del costo de un empleado CCT equivalente. Basado en: contribuciones patronales 24%, SAC 8.33%, vacaciones 4%, ART 3.5%, monotributo Cat G, IIBB 3%.
        </Text>
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

const TIPO_RRHH_LABELS = {
  empleado:   { label: 'Empleado (CCT)',       icon: Users, color: 'blue' },
  contratado: { label: 'Contratado (Comercial)', icon: Zap,   color: 'yellow' },
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
        empresa: config.empresa,
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

  const setRRHH = (tipo, data) => {
    setConfig(prev => ({
      ...prev,
      recursosHumanos: { ...prev.recursosHumanos, [tipo]: data },
    }));
  };

  const setCalculo = (campo, val) => {
    setConfig(prev => ({
      ...prev,
      calculos: { ...prev.calculos, [campo]: val },
    }));
  };

  const setEmpresa = (campo, val) => {
    setConfig(prev => ({
      ...prev,
      empresa: { ...prev.empresa, [campo]: val },
    }));
  };

  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (file) => {
    if (!file) return;
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('logo', file);
      const { data } = await clienteAxios.post('/configuracion-defaults/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEmpresa('logoUrl', data.logoUrl);
      notifications.show({ title: 'Logo actualizado ✅', message: 'Se guardó correctamente.', color: 'teal' });
    } catch (error) {
      notifications.show({ title: 'Error', message: 'No se pudo subir el logo.', color: 'red' });
    } finally {
      setUploadingLogo(false);
    }
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
            <Badge size="xs" ml={6} color="blue" variant="light">2 tipos</Badge>
          </Tabs.Tab>
          <Tabs.Tab value="calculos" leftSection={<Calculator size={16} />}>
            Constantes de Cálculo
          </Tabs.Tab>
          <Tabs.Tab value="empresa" leftSection={<Building size={16} />}>
            Mi Empresa
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
          <Tabs defaultValue="empleado" variant="outline" radius="md">
            <Tabs.List mb="md">
              {Object.entries(TIPO_RRHH_LABELS).map(([tipo, { label, icon: Icon, color }]) => (
                <Tabs.Tab key={tipo} value={tipo} leftSection={<Icon size={14} />} color={color}>
                  {label}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {Object.keys(TIPO_RRHH_LABELS).map(tipo => (
              <Tabs.Panel key={tipo} value={tipo}>
                {tipo === 'contratado' ? (
                  <ContratadoDefaultsForm
                    data={config.recursosHumanos?.[tipo] || {}}
                    onChange={data => setRRHH(tipo, data)}
                  />
                ) : (
                  <EmpleadoDefaultsForm
                    data={config.recursosHumanos?.[tipo] || {}}
                    onChange={data => setRRHH(tipo, data)}
                  />
                )}
              </Tabs.Panel>
            ))}
          </Tabs>
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
              <SimpleGrid cols={{ base: 1, sm: 3 }}>
                <Campo label="Semanas por mes" value={config.calculos?.semanasPorMes} onChange={v => setCalculo('semanasPorMes', v)} decimalScale={2} step={0.01} />
                <Campo label="Días laborales por mes" value={config.calculos?.diasLaboralesMes} onChange={v => setCalculo('diasLaboralesMes', v)} />
                <Campo label="Divisor jornal CCT" value={config.calculos?.divisorJornalCCT} onChange={v => setCalculo('divisorJornalCCT', v)} />
              </SimpleGrid>
            </Seccion>

            <Seccion icon={DollarSign} color="green" titulo="Impuestos">
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Campo label="IVA (%)" value={config.calculos?.porcentajeIVA} onChange={v => setCalculo('porcentajeIVA', v)} suffix="%" max={100} />
              </SimpleGrid>
            </Seccion>
          </Stack>
        </Tabs.Panel>

        {/* ════════ TAB MI EMPRESA ════════ */}
        <Tabs.Panel value="empresa">
          <Stack gap="md">
            <Alert icon={<Info size={16} />} color="blue" variant="light" radius="md">
              Estos datos se usan en los <b>PDFs de propuesta y desglose</b> que enviás a tus clientes.
            </Alert>

            <Seccion icon={Building} color="blue" titulo="Identidad">
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput label="Nombre de la empresa" value={config.empresa?.nombre || ''} onChange={e => setEmpresa('nombre', e.target.value)} placeholder="Ej: Transporte Pepito SRL" />
                <TextInput label="Slogan / Descripción" value={config.empresa?.slogan || ''} onChange={e => setEmpresa('slogan', e.target.value)} placeholder="Ej: Logística de confianza" />
              </SimpleGrid>
              <TextInput mt="sm" label="CUIT / RUT" value={config.empresa?.cuit || ''} onChange={e => setEmpresa('cuit', e.target.value)} placeholder="Ej: 30-12345678-9" />
            </Seccion>

            <Seccion icon={Phone} color="green" titulo="Contacto">
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput label="Teléfono" value={config.empresa?.telefono || ''} onChange={e => setEmpresa('telefono', e.target.value)} placeholder="Ej: +54 9 351 123-4567" />
                <TextInput label="Email" value={config.empresa?.email || ''} onChange={e => setEmpresa('email', e.target.value)} placeholder="Ej: info@miempresa.com" />
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, sm: 2 }} mt="sm">
                <TextInput label="Dirección" value={config.empresa?.direccion || ''} onChange={e => setEmpresa('direccion', e.target.value)} placeholder="Ej: Av. Colón 1234" />
                <TextInput label="Ciudad / Provincia" value={config.empresa?.ciudad || ''} onChange={e => setEmpresa('ciudad', e.target.value)} placeholder="Ej: Córdoba, Argentina" />
              </SimpleGrid>
            </Seccion>

            <Seccion icon={Upload} color="orange" titulo="Logo de la Empresa">
              <Group align="flex-end" gap="xl">
                <div>
                  {config.empresa?.logoUrl ? (
                    <Image
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5010'}${config.empresa.logoUrl}`}
                      alt="Logo"
                      w={120}
                      h={120}
                      fit="contain"
                      radius="md"
                      style={{ border: '1px solid #dee2e6', padding: 8, background: '#fff' }}
                    />
                  ) : (
                    <Avatar size={120} radius="md" color="gray">
                      <Building size={40} />
                    </Avatar>
                  )}
                </div>
                <Stack gap="xs">
                  <FileButton onChange={handleLogoUpload} accept="image/png,image/jpeg,image/webp,image/svg+xml">
                    {(props) => (
                      <Button {...props} variant="light" color="orange" leftSection={<Upload size={16} />} loading={uploadingLogo}>
                        Subir Logo
                      </Button>
                    )}
                  </FileButton>
                  <Text size="xs" c="dimmed">PNG, JPG, WebP o SVG. Máx 2MB.</Text>
                </Stack>
              </Group>
            </Seccion>

            <Seccion icon={Palette} color="violet" titulo="Colores de Marca">
              <Alert icon={<Info size={14} />} color="gray" variant="light" radius="md" mb="sm">
                Estos colores se aplican a los <b>PDFs</b> generados (portada, títulos, acentos).
              </Alert>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <ColorInput
                  label="Color Primario (títulos, marca)"
                  value={config.empresa?.colorPrimario || '#3A56A5'}
                  onChange={val => setEmpresa('colorPrimario', val)}
                  format="hex"
                  swatches={['#3A56A5', '#1a1a2e', '#16213e', '#0f3460', '#533483', '#2c3e50', '#c0392b', '#27ae60']}
                />
                <ColorInput
                  label="Color de Acento (botones, highlights)"
                  value={config.empresa?.colorAcento || '#11B7CD'}
                  onChange={val => setEmpresa('colorAcento', val)}
                  format="hex"
                  swatches={['#11B7CD', '#22d3ee', '#06b6d4', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#ec4899']}
                />
              </SimpleGrid>
              {/* Vista previa */}
              <Paper withBorder p="md" mt="md" radius="md">
                <Text size="xs" c="dimmed" mb="xs">Vista previa</Text>
                <Group gap="md">
                  <Paper
                    p="md" radius="md" style={{ backgroundColor: config.empresa?.colorPrimario || '#3A56A5', color: '#fff', minWidth: 140 }}
                  >
                    <Text size="sm" fw={700} ta="center">{config.empresa?.nombre || 'Mi Empresa'}</Text>
                  </Paper>
                  <Paper
                    p="md" radius="md" style={{ backgroundColor: config.empresa?.colorAcento || '#11B7CD', color: '#fff', minWidth: 140 }}
                  >
                    <Text size="sm" fw={700} ta="center">Acento</Text>
                  </Paper>
                </Group>
              </Paper>
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
