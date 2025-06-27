// Archivo: src/pages/recursoHumanoPaso/ModalConfiguracionEmpleado.jsx (Versión Final Definitiva)

import { useEffect } from "react";
import { Modal, Button, Grid, Group, NumberInput, Textarea, Stack, Tabs, rem, Text, Paper, Title } from "@mantine/core";
import clienteAxios from "../../api/clienteAxios";
import { useForm } from '@mantine/form'; // ✅ 1. Importamos el hook que soluciona el bug del foco
import { Wallet, Percent, Truck, HandCoins, FileText, MessageCircle } from "lucide-react"; // Íconos relevantes

// Componente estable para los campos numéricos
const CampoNumerico = ({ form, label, name, description, unidad = " " }) => (
    <NumberInput
      label={label}
      description={description}
      {...form.getInputProps(name)}
      thousandSeparator=","
      decimalScale={2}
      min={0}
      rightSection={<Text fz="xs" c="dimmed">{unidad}</Text>}
      rightSectionWidth={60}
    />
);

const ModalConfiguracionEmpleado = ({ show, onClose, recursoHumano, onGuardarCambios }) => {
  
  // ✅ 2. Configuramos el formulario con todos los campos necesarios
  const form = useForm({
    initialValues: {
      sueldoBasico: 0,
      adicionalActividadPorc: 0,
      adicionalNoRemunerativoFijo: 0,
      adicionalKmRemunerativo: 0,
      viaticoPorKmNoRemunerativo: 0,
      adicionalCargaDescargaCadaXkm: 0,
      kmPorUnidadDeCarga: 0,
      porcentajeCargasSociales: 0,
      porcentajeOverheadContratado: 0,
      observaciones: "",
    },
  });

  // ✅ 3. Rellenamos el formulario con los datos del recurso cuando el modal se abre
  useEffect(() => {
    if (recursoHumano) {
      form.setValues(recursoHumano);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recursoHumano, show]);

  const handleGuardar = async (values) => {
    try {
      const { data } = await clienteAxios.put(`/recursos-humanos/${recursoHumano._id}`, values);
      onGuardarCambios(data);
      onClose();
    } catch (error) {
      console.error("❌ Error al guardar cambios:", error);
      alert("Ocurrió un error al guardar los cambios.");
    }
  };

  if (!recursoHumano) return null;

  return (
    <Modal opened={show} onClose={onClose} title={`Configuración Avanzada: ${recursoHumano.nombre}`} size="lg" centered>
      <form onSubmit={form.onSubmit(handleGuardar)}>
        <Tabs defaultValue="salario" color="cyan">
            {/* ✅ 4. Pestañas reorganizadas por especialidad */}
            <Tabs.List grow>
                <Tabs.Tab value="salario" leftSection={<Wallet size={16} />}>Salario Base</Tabs.Tab>
                <Tabs.Tab value="variables" leftSection={<Truck size={16} />}>Costos Variables</Tabs.Tab>
                <Tabs.Tab value="indirectos" leftSection={<FileText size={16} />}>Costos Indirectos</Tabs.Tab>
                <Tabs.Tab value="obs" leftSection={<MessageCircle size={16} />}>Observaciones</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="salario" pt="xl">
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <CampoNumerico form={form} label="Sueldo Básico" name="sueldoBasico" description="Sueldo bruto de convenio." unidad="$ ARS" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <CampoNumerico form={form} label="Adicional por Actividad" name="adicionalActividadPorc" description="Porcentaje sobre el básico." unidad="%" />
                    </Grid.Col>
                     <Grid.Col span={12}>
                        <CampoNumerico form={form} label="Adicional Fijo (No Remunerativo)" name="adicionalNoRemunerativoFijo" description="Monto fijo que no recibe descuentos." unidad="$ ARS" />
                    </Grid.Col>
                </Grid>
            </Tabs.Panel>
            
            <Tabs.Panel value="variables" pt="xl">
                <Stack gap="lg">
                    <Paper withBorder p="md" radius="sm">
                        <Title order={6} c="dimmed" mb="xs">POR KILÓMETRO RECORRIDO</Title>
                        <Grid>
                            <Grid.Col span={{ base: 12, sm: 6 }}><CampoNumerico form={form} label="Adicional por Km (Remun.)" name="adicionalKmRemunerativo" description="Pago extra por km." unidad="$ / km" /></Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6 }}><CampoNumerico form={form} label="Viático por Km (No Remun.)" name="viaticoPorKmNoRemunerativo" description="Compensación de gastos." unidad="$ / km" /></Grid.Col>
                        </Grid>
                    </Paper>
                    <Paper withBorder p="md" radius="sm">
                        <Title order={6} c="dimmed" mb="xs">POR CARGA Y DESCARGA</Title>
                        <Grid>
                            <Grid.Col span={{ base: 12, sm: 6 }}><CampoNumerico form={form} label="Adicional por Lote de Km" name="adicionalCargaDescargaCadaXkm" description="Bonus por distancia." unidad="$ ARS" /></Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6 }}><CampoNumerico form={form} label="Cada cuántos Km se paga" name="kmPorUnidadDeCarga" description="Frecuencia del bonus." unidad="km" /></Grid.Col>
                        </Grid>
                    </Paper>
                </Stack>
            </Tabs.Panel>
            
            <Tabs.Panel value="indirectos" pt="lg">
                <Text size="sm" c="dimmed" mb="md">
                  Estos costos dependen de la modalidad de contratación del personal.
                </Text>
                {recursoHumano.tipoContratacion === "empleado" ? (
                    <CampoNumerico form={form} label="% Cargas Sociales" name="porcentajeCargasSociales" description="Aportes y contribuciones sobre el sueldo remunerativo." unidad="%" />
                ) : (
                    <CampoNumerico form={form} label="% Overhead Contratado" name="porcentajeOverheadContratado" description="Costos asociados al monotributo, seguro, etc." unidad="%" />
                )}
            </Tabs.Panel>

            <Tabs.Panel value="obs" pt="lg">
                <Textarea label="Anotaciones sobre el colaborador" autosize minRows={8} {...form.getInputProps('observaciones')} />
            </Tabs.Panel>
        </Tabs>

        <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Guardar Cambios</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default ModalConfiguracionEmpleado;