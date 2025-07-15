// Archivo: cotizadorRutas-frontend/src/components/AsistenteContextual.jsx (Versión Final sin Sombra)

import { Paper, Title, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { HelpCircle } from 'lucide-react';
import './Asistente.css';

const AsistenteContextual = ({ consejos }) => {
    if (!consejos || consejos.length === 0) {
        return null;
    }

    return (
        // ✅ Se eliminó la propiedad shadow="xs" de este componente Paper
        <Paper p="md" mt="xl" radius="md">
            <Group mb="sm">
                <ThemeIcon variant="light" color="blue" size="lg" radius="xl" className="icon-pulse">
                    <HelpCircle size={20} />
                </ThemeIcon>
                <Title order={5} c="deep-blue.7">Asistente Contextual</Title>
            </Group>
            <Stack gap="sm">
                {consejos.map((tip, index) => (
                    <Text key={index} size="sm" c="dimmed">
                        {tip.texto}
                    </Text>
                ))}
            </Stack>
        </Paper>
    );
};

export default AsistenteContextual;