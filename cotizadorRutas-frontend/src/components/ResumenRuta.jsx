// ruta: src/components/ResumenRuta.jsx

import { MapPin, Clock } from "lucide-react";
import { Group, Text, ThemeIcon } from '@mantine/core';

export default function ResumenRuta({ distanciaKm, duracionMin }) {
  return (
    <Group mt="lg" grow>
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
  );
}