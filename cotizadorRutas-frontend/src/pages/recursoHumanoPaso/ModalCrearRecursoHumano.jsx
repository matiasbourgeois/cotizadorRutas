// Archivo: src/pages/recursoHumanoPaso/ModalCrearRecursoHumano.jsx (Versión "Asistente de Alta")

import { Modal, Stack, TextInput, Select, Group, Button, Grid, Divider, Text } from "@mantine/core";
import clienteAxios from "../../api/clienteAxios";
import { useForm } from '@mantine/form'; // ✅ 1. Importamos el hook de formularios
import { User, Mail, Phone, Fingerprint } from "lucide-react"; // Íconos para los campos

const ModalCrearRecursoHumano = ({ show, onHide, onCrear }) => {
  
  // ✅ 2. Configuramos el formulario con Mantine
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      nombre: "",
      dni: "",
      telefono: "",
      email: "",
      tipoContratacion: "empleado",
    },

    // ✅ 3. Definimos las reglas de validación
    validate: {
      nombre: (value) => (value.trim().length < 3 ? 'El nombre es obligatorio' : null),
      dni: (value) => (/^\d{7,8}$/.test(value) ? null : 'El DNI debe tener 7 u 8 números, sin puntos'),
      email: (value) => {
        if (!value) return null; // El email es opcional
        return /^\S+@\S+$/.test(value) ? null : 'El formato del email no es válido';
      },
    },
  });

  const handleSubmit = async (values) => {
    try {
      const res = await clienteAxios.post('/recursos-humanos', values);
      onCrear(res.data);
      form.reset(); // Limpiamos el formulario después de crear
      onHide();
    } catch (error) {
      console.error("❌ Error al crear recurso humano:", error);
      alert("Error al crear el recurso. Verifique los datos o la conexión.");
    }
  };

  return (
    <Modal opened={show} onClose={onHide} title="Asistente de Alta de Personal" size="lg" centered>
      {/* ✅ 4. El <form> ahora usa el onSubmit del hook de Mantine */}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
          
          <Divider label={<Text fw={500}>Información Personal</Text>} labelPosition="left" />
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                withAsterisk
                label="Nombre completo"
                placeholder="Nombre y Apellido"
                leftSection={<User size={16} />}
                {...form.getInputProps('nombre')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                withAsterisk
                label="DNI"
                placeholder="Solo números, sin puntos"
                leftSection={<Fingerprint size={16} />}
                {...form.getInputProps('dni')}
              />
            </Grid.Col>
          </Grid>

          <Divider label={<Text fw={500}>Datos de Contacto (Opcional)</Text>} labelPosition="left" mt="md"/>
          <Grid>
             <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                    label="Email"
                    placeholder="correo@ejemplo.com"
                    leftSection={<Mail size={16} />}
                    {...form.getInputProps('email')}
                />
            </Grid.Col>
             <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                    label="Teléfono"
                    placeholder="Ej: 3511234567"
                    leftSection={<Phone size={16} />}
                    {...form.getInputProps('telefono')}
                />
            </Grid.Col>
          </Grid>
          
          <Divider label={<Text fw={500}>Modalidad de Contratación</Text>} labelPosition="left" mt="md"/>
           <Select
            withAsterisk
            label="Tipo de contratación"
            data={[
              { value: 'empleado', label: 'Empleado (Relación de dependencia)' },
              { value: 'contratado', label: 'Contratado (Monotributista / Autónomo)' },
            ]}
            {...form.getInputProps('tipoContratacion')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onHide}>
              Cancelar
            </Button>
            {/* ✅ 5. El botón de Crear se deshabilita si los campos obligatorios no son válidos */}
            <Button type="submit" disabled={!form.isValid()}>
              Crear Recurso
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default ModalCrearRecursoHumano;