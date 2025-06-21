// ruta: src/pages/vehiculoPaso/ModalCrearVehiculo.jsx

import { useState } from "react";
// ✅ --- LA SOLUCIÓN ESTÁ EN ESTA LÍNEA --- ✅
import { Modal, Button, Select, TextInput, Checkbox, Group, Stack } from "@mantine/core";
import { YearPickerInput } from '@mantine/dates';
import axios from "axios";
import 'dayjs/locale/es'; // Soporte para español en fechas
import { API_URL } from '../../apiConfig';

const ModalCrearVehiculo = ({ show, onClose, onVehiculoCreado }) => {
  const [formData, setFormData] = useState({
    tipoVehiculo: "utilitario",
    patente: "",
    marca: "",
    modelo: "",
    año: new Date(),
    tipoCombustible: "nafta",
    tieneGNC: false
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataEnviar = {
        ...formData,
        año: new Date(formData.año).getFullYear()
      };
      const res = await axios.post(`${API_URL}/api/vehiculos`, dataEnviar);
      onVehiculoCreado(res.data);
      onClose(); // Cierra el modal al tener éxito
    } catch (error) {
      console.error("❌ Error al crear vehículo:", error);
      alert("Error al crear vehículo. Ver consola.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal opened={show} onClose={onClose} title="Agregar Nuevo Vehículo" centered>
      <form onSubmit={handleSubmit}>
        <Stack>
          <Select
            label="Tipo de vehículo"
            name="tipoVehiculo"
            value={formData.tipoVehiculo}
            onChange={(value) => handleChange('tipoVehiculo', value)}
            data={['utilitario', 'mediano', 'grande', 'camion']}
            required
          />
          <TextInput label="Patente" name="patente" value={formData.patente} onChange={(e) => handleChange('patente', e.currentTarget.value)} required />
          <TextInput label="Marca" name="marca" value={formData.marca} onChange={(e) => handleChange('marca', e.currentTarget.value)} required />
          <TextInput label="Modelo" name="modelo" value={formData.modelo} onChange={(e) => handleChange('modelo', e.currentTarget.value)} required />
          <YearPickerInput
            label="Año"
            value={formData.año}
            onChange={(date) => handleChange('año', date)}
            locale="es"
          />
          <Select
            label="Tipo de combustible"
            name="tipoCombustible"
            value={formData.tipoCombustible}
            onChange={(value) => handleChange('tipoCombustible', value)}
            data={['nafta', 'gasoil']}
            required
          />
          {formData.tipoCombustible === "nafta" && (
            <Checkbox
              label="¿Tiene GNC?"
              name="tieneGNC"
              checked={formData.tieneGNC}
              onChange={(e) => handleChange('tieneGNC', e.currentTarget.checked)}
            />
          )}
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>Cancelar</Button>
            <Button type="submit" loading={isSaving}>Crear Vehículo</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default ModalCrearVehiculo;