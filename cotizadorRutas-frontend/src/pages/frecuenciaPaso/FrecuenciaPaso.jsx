// Archivo: cotizadorRutas-frontend/src/pages/frecuenciaPaso/FrecuenciaPaso.jsx (Versión Rediseño "Cockpit")

import { useState } from "react";
import clienteAxios from "../../api/clienteAxios";
import { useNavigate, useParams } from "react-router-dom";
import { useCotizacion } from "../../context/Cotizacion";
import { 
    Stack, Title, NumberInput, Group, Textarea, Button, Paper, Text, UnstyledButton, useMantineTheme 
} from "@mantine/core";
import { Calendar, Repeat, MessageSquare, ArrowRight, ArrowLeft } from "lucide-react";
import { notifications } from '@mantine/notifications';
import { motion, AnimatePresence } from "framer-motion";

// --- Componente interno para las tarjetas de selección ---
const SelectionCard = ({ icon: Icon, label, description, selected, ...props }) => {
    const theme = useMantineTheme();
    return (
        <UnstyledButton
            {...props}
            style={{
                flex: 1,
                padding: '20px',
                border: `2px solid ${selected ? theme.colors.cyan[6] : theme.colors.gray[3]}`,
                borderRadius: theme.radius.md,
                backgroundColor: selected ? theme.colors.cyan[0] : 'transparent',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                transform: selected ? 'translateY(-2px)' : 'none',
                boxShadow: selected ? theme.shadows.sm : 'none'
            }}
        >
            <Icon size={32} color={selected ? theme.colors.cyan[7] : theme.colors.gray[6]} style={{ marginBottom: 10 }} />
            <Text fw={700} size="lg">{label}</Text>
            <Text size="xs" c="dimmed">{description}</Text>
        </UnstyledButton>
    );
};

// --- Componente interno para el calendario semanal ---
const WeekdayPicker = ({ value, onChange }) => {
    const theme = useMantineTheme();
    const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const fullDays = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

    const handleDayClick = (day) => {
        const newValue = value.includes(day)
            ? value.filter((d) => d !== day)
            : [...value, day];
        onChange(newValue);
    };

    return (
        <Group justify="center" gap="xs">
            {days.map((day, index) => {
                const fullDay = fullDays[index];
                const isSelected = value.includes(fullDay);
                return (
                    <UnstyledButton
                        key={fullDay}
                        onClick={() => handleDayClick(fullDay)}
                        style={{
                            width: 36, height: 36,
                            borderRadius: '50%',
                            backgroundColor: isSelected ? theme.colors.cyan[6] : theme.colors.gray[1],
                            color: isSelected ? 'white' : theme.colors.gray[7],
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700,
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {day}
                    </UnstyledButton>
                );
            })}
        </Group>
    );
};


const FrecuenciaPaso = () => {
    const [tipo, setTipo] = useState("esporadico");
    const [vueltasTotales, setVueltasTotales] = useState(1);
    const [diasSeleccionados, setDiasSeleccionados] = useState([]);
    const [viajesPorDia, setViajesPorDia] = useState(1);
    const [observaciones, setObservaciones] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const { idRuta } = useParams();
    const navigate = useNavigate();
    const { setFrecuencia } = useCotizacion();

    const handleSubmit = async () => {
        // ... (lógica de submit no cambia)
        setIsSaving(true);
        const data = {
          tipo,
          viajesPorDia,
          observaciones,
          vueltasTotales: tipo === 'esporadico' ? vueltasTotales : null,
          diasSeleccionados: tipo === 'mensual' ? diasSeleccionados : [],
          rutaId: idRuta
        };
        try {
          await clienteAxios.post(`/frecuencias-ruta`, data);
          setFrecuencia(data);
          navigate(`/cotizador/vehiculo/${idRuta}`);
        } catch (error) {
          console.error("❌ Error al guardar frecuencia:", error);
          notifications.show({ title: 'Error al Guardar', message: 'No se pudo guardar la frecuencia.', color: 'red'});
        } finally {
          setIsSaving(false);
        }
    };

    return (
        <Paper withBorder p="xl" radius="md" shadow="sm">
            <Stack gap="xl">
                <Title order={3} c="deep-blue.8">¿Cuál es la frecuencia del servicio?</Title>

                <Group grow align="stretch">
                    <SelectionCard
                        icon={Repeat}
                        label="Esporádico"
                        description="Para uno o varios viajes puntuales."
                        selected={tipo === 'esporadico'}
                        onClick={() => setTipo('esporadico')}
                    />
                    <SelectionCard
                        icon={Calendar}
                        label="Mensual"
                        description="Para operativas recurrentes y fijas."
                        selected={tipo === 'mensual'}
                        onClick={() => setTipo('mensual')}
                    />
                </Group>
                
                <AnimatePresence>
                    {tipo === 'esporadico' && (
                        <motion.div
                            key="esporadico"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                           <Paper withBorder p="md" radius="sm" mt="md">
                                <NumberInput
                                    label="Cantidad total de viajes a cotizar"
                                    value={vueltasTotales}
                                    onChange={(value) => setVueltasTotales(Number(value))}
                                    min={1}
                                    allowDecimal={false}
                                />
                           </Paper>
                        </motion.div>
                    )}

                    {tipo === 'mensual' && (
                         <motion.div
                            key="mensual"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                           <Paper withBorder p="md" radius="sm" mt="md">
                                <Stack>
                                    <Text fw={500} size="sm">Selecciona los días de la semana</Text>
                                    <WeekdayPicker value={diasSeleccionados} onChange={setDiasSeleccionados} />
                                    <NumberInput
                                        label="¿Cuántas vueltas se realizarán por día seleccionado?"
                                        value={viajesPorDia}
                                        onChange={(value) => setViajesPorDia(Number(value))}
                                        min={1}
                                        allowDecimal={false}
                                    />
                                </Stack>
                           </Paper>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <Textarea
                    label="Observaciones Adicionales"
                    placeholder="Comentarios sobre la frecuencia, horarios preferidos, etc."
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    leftSection={<MessageSquare size={16} />}
                    autosize
                    minRows={3}
                />

                <Group justify="space-between" mt="md">
                    <Button variant="default" onClick={() => navigate(-1)} leftSection={<ArrowLeft size={16} />}>
                        Volver
                    </Button>
                    <Button onClick={handleSubmit} loading={isSaving} rightSection={<ArrowRight size={16} />} size="md">
                        Siguiente: Vehículo
                    </Button>
                </Group>
            </Stack>
        </Paper>
    );
};

export default FrecuenciaPaso;