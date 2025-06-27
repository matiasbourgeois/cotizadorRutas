// Archivo: cotizadorRutas-frontend/src/components/TablaPuntos.jsx (Versión Final de "Clase Mundial")

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Trash2, GripVertical } from "lucide-react";
import { Table, ActionIcon, Text, Center, Stack } from "@mantine/core";

const TablaPuntos = ({ puntos, onReordenar, onEliminar }) => {
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const nuevos = Array.from(puntos);
    const [moved] = nuevos.splice(result.source.index, 1);
    nuevos.splice(result.destination.index, 0, moved);
    onReordenar(nuevos);
  };

  const rows = puntos.map((p, index) => (
    <Draggable key={`${p.nombre}-${index}`} draggableId={`punto-${index}`} index={index}>
      {(provided, snapshot) => (
        <Table.Tr
          ref={provided.innerRef}
          {...provided.draggableProps}
          bg={snapshot.isDragging ? 'cyan.0' : undefined}
        >
          <Table.Td w={50} {...provided.dragHandleProps}>
            <Center><GripVertical size={18} color="gray" /></Center>
          </Table.Td>
          <Table.Td>
            <Stack gap={0}>
                <Text fw={500} size="sm">{p.nombre.split('–')[0].trim()}</Text>
                <Text c="dimmed" fz="xs">{p.nombre.split('–')[1]?.trim()}</Text>
            </Stack>
          </Table.Td>
          <Table.Td w={60} ta="right">
            {/* ✅ ICONO Y COLOR MEJORADOS: Sutil por defecto, rojo al pasar el mouse */}
            <ActionIcon color="red" variant="subtle" onClick={() => onEliminar(index)}>
              <Trash2 size={16} />
            </ActionIcon>
          </Table.Td>
        </Table.Tr>
      )}
    </Draggable>
  ));

  return (
    // ✅ SCROLL INTELIGENTE: El contenedor tiene una altura máxima y activa el scroll cuando se necesita.
    <Table.ScrollContainer minWidth={300} style={{ maxHeight: 350 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Table highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={50}></Table.Th>
                <Table.Th>Punto de Entrega</Table.Th>
                <Table.Th w={60}></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Droppable droppableId="tabla-puntos-droppable">
                {(provided) => (
                <Table.Tbody ref={provided.innerRef} {...provided.droppableProps}>
                    {rows.length > 0 ? rows : (
                    <Table.Tr>
                        <Table.Td colSpan={3}>
                        <Text c="dimmed" ta="center" py="lg">
                            La hoja de ruta está vacía.
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
    </Table.ScrollContainer>
  );
};

export default TablaPuntos;