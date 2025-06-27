// Archivo: src/pages/vehiculoPaso/ModalConfiguracionVehiculo.jsx (Versión Definitiva con Foco Corregido)

import { useEffect, useState } from "react";
import { Modal, Button, Grid, Group, NumberInput, Textarea, Stack, Tabs, rem, Text, Paper, Title } from "@mantine/core";
import clienteAxios from "../../api/clienteAxios";
import { Gauge, Wrench, Wallet, MessageCircle } from "lucide-react";
import { useForm } from '@mantine/form';

// ✅ PASO 1: DEFINIMOS EL COMPONENTE FUERA DEL PRINCIPAL
// Ahora es un componente estable y reutilizable. Le pasamos 'form' como prop.
const CampoNumerico = ({ form, label, name, description, unidad = " " }) => (
    <NumberInput
      label={label}
      description={description}
      // Usamos el 'form' que recibe por props
      {...form.getInputProps(name)}
      thousandSeparator=","
      decimalScale={2}
      min={0}
      rightSection={<Text fz="xs" c="dimmed">{unidad}</Text>}
      rightSectionWidth={60}
    />
);

const ModalConfiguracionVehiculo = ({ show, onClose, vehiculo, onGuardarCambios }) => {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    initialValues: {
      observaciones: '',
      rendimientoKmLitro: 0, precioLitroCombustible: 0, precioGNC: 0,
      precioVehiculoNuevo: 0, kmsVidaUtilVehiculo: 0,
      cantidadCubiertas: 0, precioCubierta: 0, kmsVidaUtilCubiertas: 0,
      precioCambioAceite: 0, kmsCambioAceite: 0,
      costoSeguroMensual: 0, costoPatenteProvincial: 0, costoPatenteMunicipal: 0, costoMantenimientoPreventivoMensual: 0
    },
  });

  useEffect(() => {
    if (vehiculo) {
      form.setValues(vehiculo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehiculo, show]); // Añadimos 'show' para asegurar que se recargue si se abre con otro vehículo

  const handleGuardar = async (values) => {
    setIsSaving(true);
    try {
      const { data } = await clienteAxios.put(`/vehiculos/${vehiculo._id}`, values);
      onGuardarCambios(data);
      onClose();
    } catch (error) {
      console.error("❌ Error al guardar cambios:", error);
      alert("Hubo un error al guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!vehiculo) return null;

  return (
    <Modal opened={show} onClose={onClose} title={`Ajustes Avanzados: ${vehiculo.marca} ${vehiculo.modelo}`} size="lg" centered>
        <form onSubmit={form.onSubmit(handleGuardar)}>
            <Tabs defaultValue="rendimiento" color="cyan">
                <Tabs.List grow>
                    <Tabs.Tab value="rendimiento" leftSection={<Gauge size={16} />}>Rendimiento</Tabs.Tab>
                    <Tabs.Tab value="desgaste" leftSection={<Wrench size={16} />}>Desgaste</Tabs.Tab>
                    <Tabs.Tab value="costos" leftSection={<Wallet size={16} />}>Costos Fijos</Tabs.Tab>
                    <Tabs.Tab value="obs" leftSection={<MessageCircle size={16} />}>Observaciones</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="rendimiento" pt="xl">
                    <Grid>
                        {/* ✅ PASO 2: Pasamos el 'form' como prop a cada campo */}
                        <Grid.Col span={{ base: 12, sm: 4 }}><CampoNumerico form={form} label="Rendimiento" name="rendimientoKmLitro" description="Eficiencia del motor." unidad="km/l" /></Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 4 }}><CampoNumerico form={form} label="Precio Combustible" name="precioLitroCombustible" description="Nafta/Gasoil." unidad="$ ARS" /></Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 4 }}><CampoNumerico form={form} label="Precio GNC" name="precioGNC" description="Por m³ (si aplica)." unidad="$ ARS" /></Grid.Col>
                    </Grid>
                </Tabs.Panel>

                <Tabs.Panel value="desgaste" pt="xl">
                  <Stack gap="lg">
                      <Paper withBorder p="md" radius="sm">
                          <Title order={6} c="dimmed" mb="xs">DEPRECIACIÓN DEL VEHÍCULO</Title>
                          <Grid>
                              <Grid.Col span={{ base: 12, md: 6 }}><CampoNumerico form={form} label="Precio de compra (nuevo)" name="precioVehiculoNuevo" description="Calcula la pérdida de valor por uso." unidad="$ ARS" /></Grid.Col>
                              <Grid.Col span={{ base: 12, md: 6 }}><CampoNumerico form={form} label="Kilómetros de Vida Útil" name="kmsVidaUtilVehiculo" description="Total de km que se estima durará el vehículo." unidad="km" /></Grid.Col>
                          </Grid>
                      </Paper>
                      <Paper withBorder p="md" radius="sm">
                           <Title order={6} c="dimmed" mb="xs">NEUMÁTICOS</Title>
                          <Grid>
                              <Grid.Col span={{ base: 12, md: 4 }}><CampoNumerico form={form} label="Cantidad" name="cantidadCubiertas" description="Total que utiliza." unidad="u." /></Grid.Col>
                              <Grid.Col span={{ base: 12, md: 4 }}><CampoNumerico form={form} label="Precio Unitario" name="precioCubierta" description="Costo de cada uno." unidad="$ ARS" /></Grid.Col>
                              <Grid.Col span={{ base: 12, md: 4 }}><CampoNumerico form={form} label="Vida Útil" name="kmsVidaUtilCubiertas" description="Km que rinde c/u." unidad="km" /></Grid.Col>
                          </Grid>
                      </Paper>
                       <Paper withBorder p="md" radius="sm">
                            <Title order={6} c="dimmed" mb="xs">ACEITE Y FILTROS</Title>
                           <Grid>
                              <Grid.Col span={{ base: 12, md: 6 }}><CampoNumerico form={form} label="Costo del Service" name="precioCambioAceite" description="Valor del cambio de aceite y filtros." unidad="$ ARS" /></Grid.Col>
                              <Grid.Col span={{ base: 12, md: 6 }}><CampoNumerico form={form} label="Km entre Cambios" name="kmsCambioAceite" description="Frecuencia del service." unidad="km" /></Grid.Col>
                          </Grid>
                       </Paper>
                  </Stack>
                </Tabs.Panel>
                
                <Tabs.Panel value="costos" pt="lg">
                    <Grid>
                        <Grid.Col span={{ base: 12, md: 6 }}><CampoNumerico form={form} label="Seguro del vehículo" name="costoSeguroMensual" description="Costo mensual de la póliza." unidad="$ / mes" /></Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}><CampoNumerico form={form} label="Patente Provincial" name="costoPatenteProvincial" description="Costo mensual estimado." unidad="$ / mes" /></Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}><CampoNumerico form={form} label="Patente Municipal" name="costoPatenteMunicipal" description="Costo mensual estimado." unidad="$ / mes" /></Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}><CampoNumerico form={form} label="Mantenimiento preventivo" name="costoMantenimientoPreventivoMensual" description="Frenos, correas, etc." unidad="$ / mes" /></Grid.Col>
                    </Grid>
                </Tabs.Panel>

                <Tabs.Panel value="obs" pt="lg">
                    <Textarea label="Anotaciones sobre el vehículo" description="Información adicional relevante..." autosize minRows={12} {...form.getInputProps('observaciones')} />
                </Tabs.Panel>
            </Tabs>
            <Group justify="flex-end" mt="xl">
                <Button variant="default" onClick={onClose} disabled={isSaving}>Cancelar</Button>
                {/* Reintegramos la lógica de 'isSaving' para el estado de carga */}
                <Button type="submit" loading={isSaving}>Guardar Cambios</Button>
            </Group>
        </form>
    </Modal>
  );
};

export default ModalConfiguracionVehiculo;