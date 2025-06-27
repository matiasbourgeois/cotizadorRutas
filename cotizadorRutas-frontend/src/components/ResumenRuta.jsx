// Archivo: src/components/ResumenRuta.jsx (Versión Rediseñada)

import { MapPin, Clock } from "lucide-react";
import { Group, Text, ThemeIcon, Paper } from '@mantine/core';

export default function ResumenRuta({ distanciaKm, duracionMin }) {
  return (
    // Envolvemos todo en un Paper para darle un fondo y borde consistentes
    <Paper withBorder p="md" radius="md" bg="gray.0">
      <Group grow>
        <Group>
          <ThemeIcon color="cyan" size="lg" radius="md">
            <MapPin size={20} />
          </ThemeIcon>
          <div>
            <Text fz="xs" c="dimmed">Distancia estimada</Text>
            <Text fw={700}>{distanciaKm} km</Text>
          </div>
        </Group>
        <Group>
          <ThemeIcon color="cyan" size="lg" radius="md">
            <Clock size={20} />
          </ThemeIcon>
          <div>
            <Text fz="xs" c="dimmed">Duración aproximada</Text>
            <Text fw={700}>{duracionMin} minutos</Text>
          </div>
        </Group>
      </Group>
    </Paper>
  );
}