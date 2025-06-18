// ruta: src/pages/recursoHumanoPaso/RecursoHumanoPaso.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCotizacion } from "../../context/Cotizacion";
import ModalCrearRecursoHumano from "./ModalCrearRecursoHumano";
import ModalConfiguracionEmpleado from "./ModalConfiguracionEmpleado";
import axios from "axios";
import { Stack, Title, Select, Group, Button, Paper, Text, ActionIcon, Badge } from '@mantine/core';
import { useDisclosure } from "@mantine/hooks";
import { Settings, ArrowRight, ArrowLeft } from "lucide-react";

const RecursoHumanoPaso = () => {
  const { recursoHumano, setRecursoHumano } = useCotizacion();
  const navigate = useNavigate();
  const [recursosDisponibles, setRecursosDisponibles] = useState([]);
  
  const [modalCrearAbierto, { open: abrirModalCrear, close: cerrarModalCrear }] = useDisclosure(false);
  const [modalConfigAbierto, { open: abrirModalConfig, close: cerrarModalConfig }] = useDisclosure(false);

  useEffect(() => {
    const obtenerRecursos = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL_LOCAL}/api/recursos-humanos`);
        setRecursosDisponibles(data.map(r => ({
            value: r._id,
            label: `${r.nombre} (${r.tipoContratacion})`
        })));
      } catch (error) {
        console.error("Error al obtener recursos humanos:", error);
      }
    };
    obtenerRecursos();
  }, []);

  const handleSeleccionar = (id) => {
    if (!id) {
        setRecursoHumano(null);
        return;
    }
     axios.get(`${import.meta.env.VITE_API_URL_LOCAL}/api/recursos-humanos/${id}`)
        .then(res => setRecursoHumano(res.data))
        .catch(err => console.error("Error al buscar detalles del recurso", err));
  };

  const handleRecursoCreado = (nuevoRecurso) => {
    setRecursosDisponibles(prev => [...prev, {
        value: nuevoRecurso._id,
        label: `${nuevoRecurso.nombre} (${nuevoRecurso.tipoContratacion})`
    }]);
    setRecursoHumano(nuevoRecurso);
    cerrarModalCrear();
  };

  const handleGuardarConfiguracion = (recursoActualizado) => {
    setRecursoHumano(recursoActualizado);
    setRecursosDisponibles(prev => 
      prev.map(r => r.value === recursoActualizado._id ? {
          value: recursoActualizado._id,
          label: `${recursoActualizado.nombre} (${recursoActualizado.tipoContratacion})`
      } : r)
    );
    cerrarModalConfig();
  };

  const avanzar = () => {
    if (!recursoHumano) {
      alert("Por favor, seleccione un recurso humano.");
      return;
    }
    navigate("/cotizador/configuracion-final");
  };

  return (
    <Stack gap="xl">
      <Title order={2} c="deep-blue.7">Selección del Recurso Humano</Title>

      <Group grow align="flex-end">
        <Select
          label="Recurso Humano Registrado"
          placeholder="Seleccionar un empleado o contratado"
          data={recursosDisponibles}
          value={recursoHumano?._id || null}
          onChange={handleSeleccionar}
          searchable
          clearable
        />
        <Button onClick={abrirModalCrear}>Nuevo Recurso</Button>
      </Group>

      {recursoHumano && (
        <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
                <Stack gap="xs">
                    <Title order={4}>{recursoHumano.nombre}</Title>
                    <Text c="dimmed">DNI: {recursoHumano.dni}</Text>
                    <Badge variant="light" color="teal" size="lg" tt="capitalize">
                        {recursoHumano.tipoContratacion}
                    </Badge>
                </Stack>
                <ActionIcon variant="light" size="lg" onClick={abrirModalConfig} title="Configuración Avanzada">
                    <Settings size={20} />
                </ActionIcon>
            </Group>
        </Paper>
      )}

      <Group justify="space-between" mt="md">
        <Button variant="default" onClick={() => navigate(-1)} leftSection={<ArrowLeft size={16} />}>
          Volver
        </Button>
        <Button onClick={avanzar} disabled={!recursoHumano} rightSection={<ArrowRight size={16} />}>
          Siguiente
        </Button>
      </Group>

      <ModalCrearRecursoHumano
        show={modalCrearAbierto}
        onHide={cerrarModalCrear}
        onCrear={handleRecursoCreado}
      />
      
      {recursoHumano && (
        <ModalConfiguracionEmpleado
          show={modalConfigAbierto}
          onClose={cerrarModalConfig}
          recursoHumano={recursoHumano}
          onGuardarCambios={handleGuardarConfiguracion}
        />
      )}
    </Stack>
  );
};

export default RecursoHumanoPaso;