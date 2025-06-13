import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Trash2, GripVertical } from "lucide-react";
import '../styles/tablasSistema.css';
import '../styles/botonesSistema.css';


const TablaPuntos = ({ puntos, setPuntos, setOptimizar }) => {
  const eliminarPunto = (index) => {
    const nuevos = [...puntos];
    nuevos.splice(index, 1);
    setPuntos(nuevos);
  };

const onDragEnd = (result) => {
  if (!result.destination) return;
  const nuevos = Array.from(puntos);
  const [moved] = nuevos.splice(result.source.index, 1);
  nuevos.splice(result.destination.index, 0, moved);
  setOptimizar(false); 
  setPuntos(nuevos);
};


  return (
    <div className="table-responsive mt-4">
      <table className="table align-middle text-center shadow-sm rounded tabla-montserrat">
        <thead className="encabezado-moderno">
          <tr>
            <th></th>
            <th>#</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tabla-puntos">
            {(provided) => (
              <tbody ref={provided.innerRef} {...provided.droppableProps}>
                {puntos.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-muted py-4">
                      No hay direcciones agregadas.
                    </td>
                  </tr>
                ) : (
                  puntos.map((p, index) => (
                    <Draggable key={index} draggableId={`punto-${index}`} index={index}>
                      {(providedDrag) => (
                        <tr
                          className="tabla-moderna-fila"
                          ref={providedDrag.innerRef}
                          {...providedDrag.draggableProps}
                        >
                          <td {...providedDrag.dragHandleProps}>
                            <GripVertical size={20} className="text-muted" />
                          </td>
                          <td>{index + 1}</td>
                          <td>{p.nombre}</td>
                          <td>
                            <button
                              className="btn-icono btn-eliminar"
                              title="Eliminar"
                              onClick={() => eliminarPunto(index)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </DragDropContext>
      </table>
    </div>
  );
};

export default TablaPuntos;
