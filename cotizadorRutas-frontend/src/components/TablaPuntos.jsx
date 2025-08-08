// Archivo: cotizadorRutas-frontend/src/components/TablaPuntos.jsx
import { useRef, useLayoutEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Trash2, GripVertical } from "lucide-react";
import { Table, ActionIcon, Text, Center, Stack, Paper } from "@mantine/core";

const ROW_HEIGHT = 56;            // alto aprox por fila
const MAX_VISIBLE_ROWS = 3;       // 3 filas visibles
const MAX_HEIGHT = ROW_HEIGHT * MAX_VISIBLE_ROWS; // 168px aprox

const TablaPuntos = ({ puntos, onReordenar, onEliminar }) => {
  // medir ancho real del contenedor para el clon del drag
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    const update = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.clientWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    // Reordenamos copia local
    const nuevos = Array.from(puntos);
    const [moved] = nuevos.splice(result.source.index, 1);
    nuevos.splice(result.destination.index, 0, moved);

    // ⚠️ No persistimos el punto "regreso" (isReturn) en el estado real
    onReordenar(nuevos.filter((p) => !p?.isReturn));
  };

  const renderRow = (p, index, provided, isDragging = false) => {
    const nombre = String(p?.nombre ?? "");
    const [titulo, subtitulo] = nombre.split("–");
    const esRegreso = p?.isReturn === true;

    return (
      <Table.Tr
        ref={provided?.innerRef}
        {...(provided ? provided.draggableProps : {})}
        bg={isDragging ? "cyan.0" : esRegreso ? "blue.0" : undefined}
        style={{
          ...(provided?.draggableProps?.style || {}),
          height: ROW_HEIGHT,
        }}
      >
        <Table.Td
          w={50}
          {...(!esRegreso ? provided?.dragHandleProps : {})}
          style={{ cursor: esRegreso ? "default" : "grab" }}
        >
          <Center>{!esRegreso && <GripVertical size={18} color="gray" />}</Center>
        </Table.Td>

        <Table.Td>
          <Stack gap={0}>
            <Text fw={esRegreso ? 600 : 500} size="sm">
              {(titulo || "").trim()} {esRegreso && "(Regreso)"}
            </Text>
            <Text c="dimmed" fz="xs">{(subtitulo || "").trim()}</Text>
          </Stack>
        </Table.Td>

        <Table.Td w={60} ta="right">
          {!esRegreso && (
            <ActionIcon color="red" variant="subtle" onClick={() => onEliminar(index)}>
              <Trash2 size={16} />
            </ActionIcon>
          )}
        </Table.Td>
      </Table.Tr>
    );
  };

  return (
    <div
      ref={containerRef}
      style={{
        maxHeight: puntos.length > 3 ? MAX_HEIGHT : "unset",
        overflowY: puntos.length > 3 ? "auto" : "visible",
        minWidth: 300,
        position: "relative",
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="tabla-puntos-droppable"
          renderClone={(provided, snapshot, rubric) => {
            const p = puntos?.[rubric?.source?.index];
            const nombre = String(p?.nombre ?? "");
            const [titulo, subtitulo] = nombre.split("–");

            return (
              <Paper
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                shadow="md"
                withBorder
                radius="md"
                p="sm"
                style={{
                  ...provided.draggableProps.style,
                  width: Math.max(0, (containerWidth || 0) - 16),
                  marginLeft: 8,
                  boxSizing: "border-box",
                  background: "var(--mantine-color-cyan-0)",
                  pointerEvents: "none",
                }}
              >
                <Stack gap={4}>
                  <Text fw={600} size="sm">{(titulo || "").trim()}</Text>
                  <Text c="dimmed" fz="xs">{(subtitulo || "").trim()}</Text>
                </Stack>
              </Paper>
            );
          }}
        >
          {(dropProvided) => (
            <Table highlightOnHover verticalSpacing="sm" style={{ position: "relative" }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th w={50}></Table.Th>
                  <Table.Th>Puntos de Entrega</Table.Th>
                  <Table.Th w={60}></Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
                {puntos.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={3}>
                      <Text c="dimmed" ta="center" py="lg">
                        La hoja de ruta está vacía.
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  puntos.map((p, index) => {
                    const esRegreso = p?.isReturn === true;
                    return esRegreso ? (
                      // Fila de regreso: SIN <Draggable>, no arrastrable ni eliminable
                      renderRow(p, index, null, false)
                    ) : (
                      <Draggable key={`${p?.nombre ?? "p"}-${index}`} draggableId={`punto-${index}`} index={index}>
                        {(dragProvided, snapshot) =>
                          renderRow(p, index, dragProvided, snapshot.isDragging)
                        }
                      </Draggable>
                    );
                  })
                )}
                {dropProvided.placeholder}
              </Table.Tbody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TablaPuntos;
