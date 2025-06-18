// ruta: src/pages/recursoHumanoPaso/ModalConfiguracionEmpleado.jsx

import { useEffect, useState } from "react";
import { Modal, Button, SimpleGrid, Group, NumberInput, Textarea, Stack, Tabs, rem, Title } from "@mantine/core";
import axios from "axios";
import { Settings, Wallet, FileText, MessageCircle } from "lucide-react";

const ModalConfiguracionEmpleado = ({ show, onClose, recursoHumano, onGuardarCambios }) => {
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (recursoHumano) {
      setFormData({ ...recursoHumano });
    }
  }, [recursoHumano]);

  const handleChange = (name, value) => {
    const finalValue = typeof value === 'string' && value.trim() === '' ? '' : parseFloat(value) || 0;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };
  
  const handleGuardar = async () => {
    setIsSaving(true);
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/recursos-humanos/${formData._id}`, formData);
      onGuardarCambios(res.data);
      onClose();
    } catch (error) {
      console.error("❌ Error al guardar cambios:", error);
      alert("Ocurrió un error al guardar los cambios.");
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
      placeholder={`Valor actual: ${recursoHumano[name] ?? "(no definido)"}`}
      description={unidad || '\u00A0'}
      allowDecimal
      thousandSeparator=","
      decimalScale={2}
      min={0}
    />
  );

  if (!recursoHumano) return null;

  return (
    <Modal opened={show} onClose={onClose} title={`Configuración Avanzada – ${recursoHumano.nombre}`} size="xl" centered>
      <Tabs defaultValue="economicos" color="cyan">
        <Tabs.List>
          <Tabs.Tab value="economicos" leftSection={<Wallet style={{ width: rem(16), height: rem(16) }} />}>Parámetros Económicos</Tabs.Tab>
          <Tabs.Tab value="contratacion" leftSection={<FileText style={{ width: rem(16), height: rem(16) }} />}>Contratación</Tabs.Tab>
          <Tabs.Tab value="obs" leftSection={<MessageCircle style={{ width: rem(16), height: rem(16) }} />}>Observaciones</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="economicos" pt="lg">
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                <CampoNumerico label="Sueldo Básico" name="sueldoBasico" unidad="$ ARS" />
                <CampoNumerico label="% Adicional por Actividad" name="adicionalActividadPorc" unidad="%" />
                <CampoNumerico label="Adicional No Remunerativo Fijo" name="adicionalNoRemunerativoFijo" unidad="$ ARS" />
                <CampoNumerico label="Adicional por Km (Remunerativo)" name="adicionalKmRemunerativo" unidad="$ por km" />
                <CampoNumerico label="Viático por Km (No Remun.)" name="viaticoPorKmNoRemunerativo" unidad="$ por km" />
                <CampoNumerico label="Adicional Carga/Descarga" name="adicionalCargaDescargaCadaXkm" unidad="$ por lote de km" />
                <CampoNumerico label="Km por unidad de Carga/Descarga" name="kmPorUnidadDeCarga" unidad="km" />
            </SimpleGrid>
        </Tabs.Panel>
        
        <Tabs.Panel value="contratacion" pt="lg">
          <Stack>
            {recursoHumano.tipoContratacion === "empleado" && (
                <CampoNumerico label="% Cargas Sociales" name="porcentajeCargasSociales" unidad="Porcentaje sobre remunerativo" />
            )}
            {recursoHumano.tipoContratacion === "contratado" && (
                <CampoNumerico label="% Overhead Contratado" name="porcentajeOverheadContratado" unidad="Monotributo, Seguro, etc." />
            )}
          </Stack>
        </Tabs.Panel>
        
        <Tabs.Panel value="obs" pt="lg">
            <Textarea
              label="Anotaciones sobre el recurso humano"
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

export default ModalConfiguracionEmpleado;