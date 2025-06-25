// Archivo: cotizadorRutas-frontend/src/components/TablaPuntos.jsx

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Trash2, GripVertical } from "lucide-react";
import { Table, ActionIcon, Text, Center, Box } from "@mantine/core";

// Ahora recibe 'onReordenar' y 'onEliminar' en lugar de 'setPuntos'
const TablaPuntos = ({ puntos, onReordenar, onEliminar, setOptimizar }) => { 
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const nuevos = Array.from(puntos);
    const [moved] = nuevos.splice(result.source.index, 1);
    nuevos.splice(result.destination.index, 0, moved);
    setOptimizar(false);
    onReordenar(nuevos); // Llama a la nueva función
  };

  const rows = puntos.map((p, index) => (
    <Draggable key={p.nombre + index} draggableId={`punto-${index}`} index={index}>
      {(provided) => (
        <Table.Tr ref={provided.innerRef} {...provided.draggableProps}>
          <Table.Td {...provided.dragHandleProps} style={{ width: 40 }}>
            <Center><GripVertical size={20} color="gray" /></Center>
          </Table.Td>
          <Table.Td style={{ width: 40 }}>{index + 1}</Table.Td>
          <Table.Td>{p.nombre}</Table.Td>
          <Table.Td style={{ width: 60 }}>
            <ActionIcon color="red" variant="subtle" onClick={() => onEliminar(index)}>
              <Trash2 size={18} />
            </ActionIcon>
          </Table.Td>
        </Table.Tr>
      )}
    </Draggable>
  ));
  
  // ... el resto del componente no cambia ...
  return (
    <Box mt="md" style={{ overflowX: 'auto' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Table miw={400} verticalSpacing="sm" withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th></Table.Th>
              <Table.Th>#</Table.Th>
              <Table.Th>Dirección</Table.Th>
              <Table.Th>Acción</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Droppable droppableId="tabla-puntos">
            {(provided) => (
              <Table.Tbody ref={provided.innerRef} {...provided.droppableProps}>
                {rows.length > 0 ? rows : (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text c="dimmed" ta="center" py="lg">
                        Aún no has agregado ninguna dirección.
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
                {provided.placeholder}
              </Table.Tbody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
    </Box>
  );
};


export default TablaPuntos;