
import { useEffect } from "react";
import { Modal, Button, Grid, Group, NumberInput, Textarea, Stack, Tabs, Text, Paper, Title } from "@mantine/core";
import { notifications } from '@mantine/notifications';
import clienteAxios from "../../api/clienteAxios";
import { useForm } from '@mantine/form';
import { Wallet, Truck, FileText, MessageCircle } from "lucide-react";
import CampoNumerico from '../../components/CampoNumerico';


const ModalConfiguracionEmpleado = ({ show, onClose, recursoHumano, onGuardarCambios }) => {
  
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
      factorSobreEmpleado: 75,
      observaciones: "",
    },
  });

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
      console.error("Error al guardar cambios:", error);
      notifications.show({ title: 'Error', message: 'No se pudieron guardar los cambios del colaborador.', color: 'red' });
    }
  };

  if (!recursoHumano) return null;

  return (
    <Modal opened={show} onClose={onClose} title={`Configuración Avanzada: ${recursoHumano.nombre}`} size="lg" centered>
      <form onSubmit={form.onSubmit(handleGuardar)}>
        {recursoHumano.tipoContratacion === 'contratado' ? (
          /* ═══ CONTRATADO — Factor sobre empleado ═══ */
          <Tabs defaultValue="factor" color="cyan">
            <Tabs.List grow>
              <Tabs.Tab value="factor" leftSection={<Wallet size={16} />}>Costo del Servicio</Tabs.Tab>
              <Tabs.Tab value="obs" leftSection={<MessageCircle size={16} />}>Observaciones</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="factor" pt="xl">
              <Grid>
                <Grid.Col span={12}>
                  <CampoNumerico form={form} label="Factor sobre empleado" name="factorSobreEmpleado" description="Porcentaje del costo de un empleado CCT equivalente que se cobra al contratado." unidad="%" />
                </Grid.Col>

              </Grid>
            </Tabs.Panel>

            <Tabs.Panel value="obs" pt="lg">
              <Textarea label="Anotaciones sobre el colaborador" autosize minRows={8} {...form.getInputProps('observaciones')} />
            </Tabs.Panel>
          </Tabs>
        ) : (
          /* ═══ EMPLEADO — Configuración completa CCT 40/89 ═══ */
          <Tabs defaultValue="salario" color="cyan">
            <Tabs.List grow>
                <Tabs.Tab value="salario" leftSection={<Wallet size={16} />}>Salario Base</Tabs.Tab>
                <Tabs.Tab value="variables" leftSection={<Truck size={16} />}>Costos Variables</Tabs.Tab>
                <Tabs.Tab value="indirectos" leftSection={<FileText size={16} />}>Costos Indirectos</Tabs.Tab>
                <Tabs.Tab value="obs" leftSection={<MessageCircle size={16} />}>Observaciones</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="salario" pt="xl">
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                        <CampoNumerico form={form} label="Sueldo Básico" name="sueldoBasico" description="Sueldo bruto de convenio CCT 40/89." unidad="$ ARS" />
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
                            <Grid.Col span={{ base: 12, sm: 6 }}><CampoNumerico form={form} label="Adicional por Km (Remun.)" name="adicionalKmRemunerativo" description="ITEM 4.2.3 CCT." unidad="$ / km" /></Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6 }}><CampoNumerico form={form} label="Viático por Km (No Remun.)" name="viaticoPorKmNoRemunerativo" description="ITEM 4.2.4 CCT." unidad="$ / km" /></Grid.Col>
                        </Grid>
                    </Paper>
                    <Paper withBorder p="md" radius="sm">
                        <Title order={6} c="dimmed" mb="xs">POR CARGA Y DESCARGA</Title>
                        <Grid>
                            <Grid.Col span={{ base: 12, sm: 6 }}><CampoNumerico form={form} label="Adicional por Lote de Km" name="adicionalCargaDescargaCadaXkm" description="ITEM 4.2.6 CCT." unidad="$ ARS" /></Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6 }}><CampoNumerico form={form} label="Cada cuántos Km se paga" name="kmPorUnidadDeCarga" description="Frecuencia del bonus." unidad="km" /></Grid.Col>
                        </Grid>
                    </Paper>
                </Stack>
            </Tabs.Panel>
            
            <Tabs.Panel value="indirectos" pt="lg">
                <Text size="sm" c="dimmed" mb="md">
                  Cargas sociales obligatorias sobre la remuneración del empleado (AFIP/ANSES).
                </Text>
                <CampoNumerico form={form} label="% Cargas Sociales" name="porcentajeCargasSociales" description="Aportes y contribuciones patronales sobre el sueldo remunerativo." unidad="%" />
            </Tabs.Panel>

            <Tabs.Panel value="obs" pt="lg">
                <Textarea label="Anotaciones sobre el colaborador" autosize minRows={8} {...form.getInputProps('observaciones')} />
            </Tabs.Panel>
          </Tabs>
        )}

        <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Guardar Cambios</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default ModalConfiguracionEmpleado;