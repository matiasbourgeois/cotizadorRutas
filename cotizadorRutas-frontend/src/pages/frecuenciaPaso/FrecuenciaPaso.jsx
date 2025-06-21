// ruta: src/pages/frecuenciaPaso/FrecuenciaPaso.jsx

import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useCotizacion } from "../../context/Cotizacion";
import { 
    Stack, 
    Title, 
    SegmentedControl, 
    NumberInput, 
    Chip, 
    Group, 
    Textarea,
    Button 
} from "@mantine/core";
import { Calendar, Repeat, MessageSquare, ArrowRight, ArrowLeft } from "lucide-react";
import { API_URL } from '../../apiConfig';

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

  const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

  const handleSubmit = async () => {
    setIsSaving(true);
    const data = {
      tipo,
      viajesPorDia,
      observaciones,
      vueltasTotales: tipo === 'esporadico' ? vueltasTotales : null,
      diasSeleccionados: tipo === 'mensual' ? diasSeleccionados : [],
    };

    try {
      // Aunque el backend no usa directamente este endpoint para el cálculo final,
      // es una buena práctica guardar la selección de frecuencia.
      const res = await axios.post(`${API_URL}/api/frecuencias-ruta`, data);
      setFrecuencia(data); // Guardamos la data localmente en el contexto
      navigate(`/cotizador/vehiculo/${idRuta}`);
    } catch (error) {
      console.error("❌ Error al guardar frecuencia:", error);
      alert("Error al guardar frecuencia. Revisa la consola.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Stack gap="xl">
        <Title order={2} c="deep-blue.7">Frecuencia del Servicio</Title>

        <SegmentedControl
            value={tipo}
            onChange={setTipo}
            color="cyan"
            size="md"
            data={[
                { label: 'Esporádico', value: 'esporadico' },
                { label: 'Mensual', value: 'mensual' },
            ]}
        />

        {tipo === 'esporadico' && (
            <NumberInput
                label="¿Cuántas vueltas en total se realizarán?"
                value={vueltasTotales}
                onChange={(value) => setVueltasTotales(Number(value))}
                min={1}
                allowDecimal={false}
                leftSection={<Repeat size={16} />}
            />
        )}

        {tipo === 'mensual' && (
             <Chip.Group multiple value={diasSeleccionados} onChange={setDiasSeleccionados}>
                <Group justify="center" gap="xs">
                    {diasSemana.map((dia) => (
                        <Chip key={dia} value={dia} variant="outline" size="sm">
                           {dia.charAt(0).toUpperCase() + dia.slice(1)}
                        </Chip>
                    ))}
                </Group>
            </Chip.Group>
        )}
        
        <NumberInput
            label="¿Cuántas vueltas se realizarán por día seleccionado?"
            value={viajesPorDia}
            onChange={(value) => setViajesPorDia(Number(value))}
            min={1}
            allowDecimal={false}
            leftSection={<Calendar size={16} />}
        />

        <Textarea
            label="Observaciones Adicionales"
            placeholder="Comentarios sobre la frecuencia, horarios preferidos, etc."
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            leftSection={<MessageSquare size={16} />}
            autosize
            minRows={2}
        />

        <Group justify="space-between" mt="md">
            <Button 
                variant="default"
                onClick={() => navigate(-1)}
                leftSection={<ArrowLeft size={16} />}
            >
                Volver
            </Button>
            <Button
                onClick={handleSubmit}
                loading={isSaving}
                rightSection={<ArrowRight size={16} />}
            >
                Siguiente
            </Button>
      </Group>
    </Stack>
  );
};

export default FrecuenciaPaso;