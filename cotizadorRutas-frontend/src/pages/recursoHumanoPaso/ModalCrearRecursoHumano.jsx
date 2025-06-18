// ruta: src/pages/recursoHumanoPaso/ModalCrearRecursoHumano.jsx

import React, { useState } from "react";
import { Modal, Stack, TextInput, Select, Group, Button } from "@mantine/core";
import axios from "axios";

const ModalCrearRecursoHumano = ({ show, onHide, onCrear }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    telefono: "",
    email: "",
    tipoContratacion: "empleado",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/recursos-humanos`, formData);
      onCrear(res.data);
      onHide();
    } catch (error) {
      console.error("❌ Error al crear recurso humano:", error);
      alert("Error al crear el recurso. Verifique los datos o la conexión.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal opened={show} onClose={onHide} title="Nuevo Recurso Humano" centered>
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Nombre completo"
            name="nombre"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.currentTarget.value)}
            required
          />
          <TextInput
            label="DNI"
            name="dni"
            value={formData.dni}
            onChange={(e) => handleChange('dni', e.currentTarget.value)}
            required
          />
          <TextInput
            label="Teléfono"
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.currentTarget.value)}
          />
          <TextInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.currentTarget.value)}
          />
          <Select
            label="Tipo de contratación"
            name="tipoContratacion"
            value={formData.tipoContratacion}
            onChange={(value) => handleChange('tipoContratacion', value)}
            data={[
              { value: 'empleado', label: 'Empleado (Relación de dependencia)' },
              { value: 'contratado', label: 'Contratado (Monotributista / Autónomo)' },
            ]}
            required
          />
        </Stack>
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onHide} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSaving}>
            Crear Recurso
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default ModalCrearRecursoHumano;