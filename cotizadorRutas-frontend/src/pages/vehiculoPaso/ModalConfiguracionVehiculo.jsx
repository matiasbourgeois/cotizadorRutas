// ruta: src/pages/vehiculoPaso/ModalConfiguracionVehiculo.jsx

import { useEffect, useState } from "react";
import { Modal, Button, SimpleGrid, Group, NumberInput, Textarea, Stack, Tabs, rem, Title, Grid } from "@mantine/core";
import axios from "axios";
import { Settings, Wallet, Route as RouteIcon, MessageCircle } from "lucide-react";
import { API_URL } from '../../apiConfig';

const ModalConfiguracionVehiculo = ({ show, onClose, vehiculo, onGuardarCambios }) => {
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (vehiculo) {
      setFormData({ ...vehiculo });
    }
  }, [vehiculo]);

  const handleChange = (name, value) => {
    const finalValue = typeof value === 'string' && value.trim() === '' ? '' : parseFloat(value) || 0;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleGuardar = async () => {
    setIsSaving(true);
    try {
      const { data } = await axios.put(`${API_URL}/api/vehiculos/${vehiculo._id}`, formData);
      onGuardarCambios(data);
      onClose();
    } catch (error) {
      console.error("❌ Error al guardar cambios:", error);
      alert("Hubo un error al guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  };

  const CampoNumerico = ({ label, name, unidad = "" }) => (
    <NumberInput
      label={label}
      name={name}
      value={formData[name] ?? ''}
      onChange={(value) => handleChange(name, value)}
      placeholder={`Valor actual: ${vehiculo[name] ?? "(no definido)"}`}
      // ✅ 1. AJUSTE: Si no hay unidad, usamos un espacio para mantener la altura.
      description={unidad || '\u00A0'} 
      allowDecimal
      thousandSeparator=","
      decimalScale={2}
      min={0}
    />
  );

  if (!vehiculo) return null;

  return (
    <Modal opened={show} onClose={onClose} title={`Configuración Avanzada – ${vehiculo.marca} ${vehiculo.modelo}`} size="xl" centered>
        <Tabs defaultValue="tecnica" color="cyan">
            {/* ... (La lista de pestañas no cambia) ... */}
            <Tabs.List>
                <Tabs.Tab value="tecnica" leftSection={<Settings style={{ width: rem(16), height: rem(16) }} />}>Técnica</Tabs.Tab>
                <Tabs.Tab value="costos" leftSection={<Wallet style={{ width: rem(16), height: rem(16) }} />}>Costos Fijos</Tabs.Tab>
                <Tabs.Tab value="desgaste" leftSection={<RouteIcon style={{ width: rem(16), height: rem(16) }} />}>Desgaste y Vida Útil</Tabs.Tab>
                <Tabs.Tab value="obs" leftSection={<MessageCircle style={{ width: rem(16), height: rem(16) }} />}>Observaciones</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="tecnica" pt="lg">
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                    <CampoNumerico label="Rendimiento" name="rendimientoKmLitro" unidad="km por litro/m³" />
                    <CampoNumerico label="Capacidad de carga" name="capacidadKg" unidad="kg" />
                    <CampoNumerico label="Volumen útil" name="volumenM3" unidad="m³" />
                    <CampoNumerico label="Precio litro combustible" name="precioLitroCombustible" unidad="$ ARS" />
                    <CampoNumerico label="Precio GNC (por m³)" name="precioGNC" unidad="$ ARS" />
                </SimpleGrid>
            </Tabs.Panel>

            <Tabs.Panel value="costos" pt="lg">
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                    <CampoNumerico label="Seguro del vehículo" name="costoSeguroMensual" unidad="$ ARS (mensual)" />
                    <CampoNumerico label="Mantenimiento preventivo" name="costoMantenimientoPreventivoMensual" unidad="$ ARS (mensual)" />
                    <CampoNumerico label="Patente Municipal" name="costoPatenteMunicipal" unidad="$ ARS (mensual)" />
                    <CampoNumerico label="Patente Provincial" name="costoPatenteProvincial" unidad="$ ARS (mensual)" />
                </SimpleGrid>
            </Tabs.Panel>
            
            <Tabs.Panel value="desgaste" pt="lg">
                <Grid>
                    <Grid.Col span={12}>
                        <Title order={5}>Vehículo</Title>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <CampoNumerico label="Precio de compra (nuevo)" name="precioVehiculoNuevo" unidad="$ ARS" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <CampoNumerico label="Km vida útil del vehículo" name="kmsVidaUtilVehiculo" unidad="km" />
                    </Grid.Col>
                    
                    <Grid.Col span={12} mt="sm">
                        <Title order={5}>Cubiertas</Title>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        {/* ✅ 2. AJUSTE: Añadimos la unidad que faltaba. */}
                        <CampoNumerico label="Cantidad de Cubiertas" name="cantidadCubiertas" unidad="unidades" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <CampoNumerico label="Precio por cubierta" name="precioCubierta" unidad="$ ARS" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <CampoNumerico label="Km vida útil de cubiertas" name="kmsVidaUtilCubiertas" unidad="km" />
                    </Grid.Col>

                    <Grid.Col span={12} mt="sm">
                        <Title order={5}>Aceite</Title>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                       <CampoNumerico label="Precio cambio de aceite" name="precioCambioAceite" unidad="$ ARS" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                       <CampoNumerico label="Km entre cambios de aceite" name="kmsCambioAceite" unidad="km" />
                    </Grid.Col>
                </Grid>
            </Tabs.Panel>

            <Tabs.Panel value="obs" pt="lg">
                <Textarea
                  label="Anotaciones sobre el vehículo"
                  name="observaciones"
                  value={formData.observaciones || ""}
                  onChange={(e) => setFormData(prev => ({...prev, observaciones: e.currentTarget.value}))}
                  autosize
                  minRows={4}
                />
            </Tabs.Panel>
        </Tabs>

        <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleGuardar} loading={isSaving}>Guardar Cambios</Button>
        </Group>
    </Modal>
  );
};

export default ModalConfiguracionVehiculo;