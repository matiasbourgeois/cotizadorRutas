// Archivo: src/pages/vehiculoPaso/ModalCrearVehiculo.jsx (Versión Final Pulida)

import { useState } from "react";
import { Modal, Button, Select, TextInput, Checkbox, Group, Stack, Grid, Divider, Text } from "@mantine/core";
import { YearPickerInput } from '@mantine/dates';
import clienteAxios from "../../api/clienteAxios";
import 'dayjs/locale/es';
import { useForm } from '@mantine/form';
import { Car, Fuel, Tag, Calendar } from 'lucide-react'; // Íconos para los campos

const ModalCrearVehiculo = ({ show, onClose, onVehiculoCreado }) => {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    mode: 'uncontrolled', 
    initialValues: {
      tipoVehiculo: "utilitario",
      patente: "",
      marca: "",
      modelo: "",
      año: new Date(),
      tipoCombustible: "nafta",
      tieneGNC: false
    },
    validate: {
      patente: (value) => (value.trim().length >= 6 ? null : 'La patente debe tener al menos 6 caracteres'),
      marca: (value) => (value.trim().length > 0 ? null : 'La marca es obligatoria'),
      modelo: (value) => (value.trim().length > 0 ? null : 'El modelo es obligatorio'),
    },
  });

  const handleSubmit = async (values) => {
    setIsSaving(true);
    try {
      const dataEnviar = {
        ...values,
        año: new Date(values.año).getFullYear()
      };
      const res = await clienteAxios.post('/vehiculos', dataEnviar);
      onVehiculoCreado(res.data);
      form.reset();
      onClose();
    } catch (error) {
      console.error("❌ Error al crear vehículo:", error);
      alert("Error al crear vehículo. Ver consola.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal opened={show} onClose={onClose} title="Asistente de Alta de Vehículo" size="lg" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
          
          {/* ✅ Usamos Dividers para separar lógicamente el formulario */}
          <Divider label={<Text fw={500}>Datos de Identificación</Text>} labelPosition="left" />

          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput withAsterisk label="Marca" placeholder="Ej: Fiat" leftSection={<Car size={16}/>} {...form.getInputProps('marca')} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput withAsterisk label="Modelo" placeholder="Ej: Fiorino" {...form.getInputProps('modelo')} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
               <TextInput withAsterisk label="Patente" placeholder="Formato AA 123 BB" leftSection={<Tag size={16}/>} {...form.getInputProps('patente')} />
            </Grid.Col>
             <Grid.Col span={{ base: 12, sm: 6 }}>
                <YearPickerInput label="Año de fabricación" placeholder="Selecciona el año" leftSection={<Calendar size={16}/>} {...form.getInputProps('año')} locale="es" />
            </Grid.Col>
          </Grid>

          <Divider label={<Text fw={500}>Especificaciones Técnicas</Text>} labelPosition="left" mt="md" />
          
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select withAsterisk label="Tipo de vehículo" data={['utilitario', 'mediano', 'grande', 'camion']} {...form.getInputProps('tipoVehiculo')} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select withAsterisk label="Tipo de combustible" data={['nafta', 'gasoil']} leftSection={<Fuel size={16}/>} {...form.getInputProps('tipoCombustible')} />
            </Grid.Col>
            {form.values.tipoCombustible === "nafta" && (
                <Grid.Col span={12}>
                    <Checkbox mt="xs" label="¿Este vehículo está equipado con GNC?" {...form.getInputProps('tieneGNC', { type: 'checkbox' })} />
                </Grid.Col>
            )}
          </Grid>
          
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose} disabled={isSaving}>Cancelar</Button>
            <Button type="submit" loading={isSaving}>Crear Vehículo</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default ModalCrearVehiculo;