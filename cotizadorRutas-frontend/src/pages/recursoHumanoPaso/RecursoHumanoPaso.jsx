import React, { useContext, useEffect, useState } from "react";
import { useCotizacion } from "../../context/Cotizacion";
import calcularCostoRecursoHumano from "../../utils/calcularCostoRecursoHumano";
import ModalCrearRecursoHumano from "./ModalCrearRecursoHumano";
import ModalConfiguracionEmpleado from "./ModalConfiguracionEmpleado";

const RecursoHumanoPaso = ({ onSiguiente }) => {
  const {
    recursoHumano,
    setRecursoHumano,
    puntosEntrega,
    frecuencia,
    costoRecursoHumano,
    setCostoRecursoHumano,
  } = useCotizacion();

  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalConfiguracion, setMostrarModalConfiguracion] = useState(false);
  const [recursosDisponibles, setRecursosDisponibles] = useState([]);

  useEffect(() => {
    const obtenerRecursos = async () => {
      try {
        const respuesta = await fetch("http://localhost:5010/api/recursos-humanos");
        const data = await respuesta.json();
        setRecursosDisponibles(data);
      } catch (error) {
        console.error("Error al obtener recursos humanos:", error);
      }
    };

    obtenerRecursos();
  }, []);

  useEffect(() => {
    if (recursoHumano && puntosEntrega.length > 0 && frecuencia?.entregasMensuales) {
      const kmsPorViaje = puntosEntrega.reduce((acc, punto) => acc + (punto.kms || 0), 0);
      const cantidadViajesMensuales = frecuencia.entregasMensuales || 0;

      const costo = calcularCostoRecursoHumano(
        recursoHumano,
        kmsPorViaje,
        cantidadViajesMensuales
      );

      setCostoRecursoHumano(costo);
    }
  }, [recursoHumano, puntosEntrega, frecuencia]);

  const handleSeleccionar = (id) => {
    const recursoSeleccionado = recursosDisponibles.find((r) => r._id === id);
    setRecursoHumano(recursoSeleccionado);
  };

  const avanzar = () => {
    if (!recursoHumano) {
      alert("Seleccioná un recurso humano antes de continuar.");
      return;
    }
    onSiguiente();
  };

  return (
    <div className="container mt-4">
      <h4 className="text-warning mb-3">Paso 4: Selección del Recurso Humano</h4>

      <div className="mb-3 d-flex gap-2 align-items-center">
        <select
          className="form-select w-50"
          value={recursoHumano?._id || ""}
          onChange={(e) => handleSeleccionar(e.target.value)}
        >
          <option value="">Seleccionar Recurso Humano</option>
          {recursosDisponibles.map((r) => (
            <option key={r._id} value={r._id}>
              {r.nombre} ({r.tipo})
            </option>
          ))}
        </select>

        <button className="btn btn-sm btn-success" onClick={() => setMostrarModalCrear(true)}>
          Crear Nuevo
        </button>

        {recursoHumano?.tipo === "empleado" && (
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setMostrarModalConfiguracion(true)}>
            Configurar Avanzado
          </button>
        )}
      </div>

      {recursoHumano && (
        <div className="card border-secondary mt-3 shadow-sm">
          <div className="card-body">
            <h5 className="card-title text-primary mb-3">Recurso Seleccionado</h5>
            <p className="mb-1"><strong>Nombre:</strong> {recursoHumano.nombre}</p>
            <p className="mb-1"><strong>Tipo:</strong> {recursoHumano.tipo}</p>
            <p className="mb-1"><strong>DNI:</strong> {recursoHumano.dni}</p>
          </div>
        </div>
      )}

      {costoRecursoHumano && (
        <div className="card bg-light border mt-4 shadow-sm">
          <div className="card-body">
            <h5 className="text-success">Costos del Recurso Humano:</h5>
            <ul className="mb-0">
              {Object.entries(costoRecursoHumano.detalle || {}).map(([clave, valor]) => (
                <li key={clave}>
                  <strong>{clave}:</strong> ${valor.toFixed(2)}
                </li>
              ))}
              <li className="mt-2">
                <strong>Total mensual:</strong>{" "}
                <span className="text-primary">${costoRecursoHumano.totalFinal.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="mt-4 text-end">
        <button className="btn btn-warning" onClick={avanzar}>
          Siguiente Paso
        </button>
      </div>

      <ModalCrearRecursoHumano
        mostrar={mostrarModalCrear}
        onHide={() => setMostrarModalCrear(false)}
        onCrear={(nuevo) => {
          setRecursosDisponibles((prev) => [...prev, nuevo]);
          setRecursoHumano(nuevo);
        }}
      />

      <ModalConfiguracionEmpleado
        mostrar={mostrarModalConfiguracion}
        onHide={() => setMostrarModalConfiguracion(false)}
        empleado={recursoHumano}
        onActualizar={(actualizado) => setRecursoHumano(actualizado)}
      />
    </div>
  );
};

export default RecursoHumanoPaso;
