import { Container, Title, Text, Paper, Group, SimpleGrid, ThemeIcon, Stack, Center, Loader, RingProgress } from '@mantine/core';
import { useState, useEffect } from 'react';
import { BarChart3, Truck, Users, FileText, TrendingUp, DollarSign } from 'lucide-react';
import clienteAxios from '../../api/clienteAxios';

const KpiCard = ({ icon: Icon, label, value, color, description }) => (
  <Paper withBorder p="lg" radius="md" shadow="sm">
    <Group justify="space-between" align="flex-start">
      <div>
        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>{label}</Text>
        <Text fw={800} size="xl" mt={4}>{value}</Text>
        {description && <Text c="dimmed" size="xs" mt={4}>{description}</Text>}
      </div>
      <ThemeIcon color={color} variant="light" size="xl" radius="md">
        <Icon size={22} />
      </ThemeIcon>
    </Group>
  </Paper>
);

const DashboardBI = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCotizaciones: 0,
    totalVehiculos: 0,
    totalRRHH: 0,
    costoPromedio: 0,
    ultimasCotizaciones: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [presupuestos, vehiculos, rrhh] = await Promise.all([
          clienteAxios.get('/presupuestos').catch(() => ({ data: [] })),
          clienteAxios.get('/vehiculos').catch(() => ({ data: [] })),
          clienteAxios.get('/recursos-humanos').catch(() => ({ data: [] })),
        ]);

        const pList = Array.isArray(presupuestos.data) ? presupuestos.data : [];
        const costoTotal = pList.reduce((sum, p) => sum + (p.resumenCostos?.totalFinal || 0), 0);

        setStats({
          totalCotizaciones: pList.length,
          totalVehiculos: vehiculos.data?.length || 0,
          totalRRHH: rrhh.data?.length || 0,
          costoPromedio: pList.length > 0 ? Math.round(costoTotal / pList.length) : 0,
          ultimasCotizaciones: pList.slice(-5).reverse(),
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const fmt = (n) => `$${Number(n || 0).toLocaleString('es-AR')}`;

  if (loading) {
    return (
      <Center h="60vh">
        <Loader color="violet" size="lg" />
      </Center>
    );
  }

  return (
    <Container fluid>
      <Group mb="lg">
        <ThemeIcon color="violet" variant="light" size="xl" radius="md">
          <BarChart3 size={22} />
        </ThemeIcon>
        <div>
          <Title order={2} c="var(--app-brand-primary)">Business Intelligence</Title>
          <Text c="dimmed" size="sm">Indicadores clave de tu operación logística</Text>
        </div>
      </Group>

      {/* KPI Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="xl">
        <KpiCard
          icon={FileText}
          label="Cotizaciones"
          value={stats.totalCotizaciones}
          color="cyan"
          description="Total generadas"
        />
        <KpiCard
          icon={DollarSign}
          label="Precio Venta Promedio"
          value={fmt(stats.costoPromedio)}
          color="teal"
          description="Por cotización"
        />
        <KpiCard
          icon={Truck}
          label="Vehículos"
          value={stats.totalVehiculos}
          color="blue"
          description="En la flota"
        />
        <KpiCard
          icon={Users}
          label="Recursos Humanos"
          value={stats.totalRRHH}
          color="orange"
          description="Registrados"
        />
      </SimpleGrid>

      {/* Recent cotizaciones */}
      <Paper withBorder p="lg" radius="md" shadow="sm">
        <Title order={4} mb="md" c="var(--app-brand-primary)">Últimas Cotizaciones</Title>
        {stats.ultimasCotizaciones.length === 0 ? (
          <Center py="xl">
            <Stack align="center" gap="xs">
              <TrendingUp size={32} color="var(--app-text-muted)" />
              <Text c="dimmed">Aún no hay cotizaciones generadas</Text>
            </Stack>
          </Center>
        ) : (
          <Stack gap="sm">
            {stats.ultimasCotizaciones.map((p, i) => (
              <Paper key={p._id || i} withBorder p="sm" radius="sm">
                <Group justify="space-between">
                  <div>
                    <Text fw={600} size="sm">
                      {p.vehiculo ? `${p.vehiculo.marca} ${p.vehiculo.modelo}` : 'Sin vehículo'}
                    </Text>
                    <Text c="dimmed" size="xs">
                      {p.puntosEntrega?.distanciaKm?.toFixed(1) || '?'} km — {p.frecuencia?.tipo || '?'}
                    </Text>
                  </div>
                  <Text fw={700} c="var(--app-brand-primary)">
                    {fmt(p.resumenCostos?.totalFinal)}
                  </Text>
                </Group>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Container>
  );
};

export default DashboardBI;
