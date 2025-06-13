import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCotizacion } from "../../context/Cotizacion";
import calcularCostoRecursoHumano from "../../utils/calcularCostoRecursoHumano";
import ModalCrearRecursoHumano from "./ModalCrearRecursoHumano";
import ModalConfiguracionEmpleado from "./ModalConfiguracionEmpleado";
import axios from "axios";

// Estilos
import '../../styles/formularioSistema.css';
import '../../styles/botonesSistema.css';
import '../../styles/titulosSistema.css';
import '../../styles/tablasSistema.css';

const RecursoHumanoPaso = () => {
  const {
    recursoHumano,
    setRecursoHumano,
    puntosEntrega,
    frecuencia,
    costoRecursoHumano,
    setCostoRecursoHumano,
  } = useCotizacion();

  const navigate = useNavigate();
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalConfiguracion, setMostrarModalConfiguracion] = useState(false);
  const [recursosDisponibles, setRecursosDisponibles] = useState([]);

  // --- EFECTOS ---

  useEffect(() => {
    const obtenerRecursos = async () => {
      try {
        const respuesta = await axios.get("http://localhost:5010/api/recursos-humanos");
        setRecursosDisponibles(respuesta.data);
      } catch (error) {
        console.error("Error al obtener recursos humanos:", error);
        alert("No se pudieron cargar los recursos humanos.");
      }
    };
    obtenerRecursos();
  }, []);

  useEffect(() => {
    setCostoRecursoHumano(null);

    if (recursoHumano && puntosEntrega && frecuencia) {
      const kmsPorViaje = puntosEntrega.distanciaKm || 0;
      let cantidadViajesMensuales = 0;
      if (frecuencia.tipo === "mensual") {
        const diasPorSemana = frecuencia.diasSeleccionados?.length || 0;
        const viajesPorDia = frecuencia.viajesPorDia || 1;
        cantidadViajesMensuales = diasPorSemana * viajesPorDia * 4.33;
      } else if (frecuencia.tipo === "esporadico") {
        cantidadViajesMensuales = frecuencia.vueltasTotales || 0;
      }

      if (kmsPorViaje > 0 && cantidadViajesMensuales > 0) {
        const costo = calcularCostoRecursoHumano(
          recursoHumano,
          kmsPorViaje,
          cantidadViajesMensuales
        );
        setCostoRecursoHumano(costo);
      }
    }
  }, [recursoHumano, puntosEntrega, frecuencia, setCostoRecursoHumano]);

  // --- MANEJADORES DE EVENTOS ---

  const handleSeleccionar = (id) => {
    const recursoSeleccionado = recursosDisponibles.find((r) => r._id === id);
    setRecursoHumano(recursoSeleccionado);
  };

  const handleRecursoCreado = (nuevoRecurso) => {
    setRecursosDisponibles(prev => [...prev, nuevoRecurso]);
    setRecursoHumano(nuevoRecurso);
    setMostrarModalCrear(false);
  };

  const handleGuardarConfiguracion = (recursoActualizado) => {
    setRecursoHumano(recursoActualizado);
    setRecursosDisponibles(prev => 
      prev.map(r => r._id === recursoActualizado._id ? recursoActualizado : r)
    );
    setMostrarModalConfiguracion(false);
  };

  const avanzar = () => {
    if (!recursoHumano) {
      alert("Por favor, seleccione o cree un recurso humano antes de continuar.");
      return;
    }
    navigate("/cotizador/configuracion-final");
  };
  
  const volver = () => {
    navigate(-1);
  };

  // --- RENDERIZADO ---
  return (
    <div className="container mt-4">
      <h4 className="titulo-seccion">Paso 4: Selección del Recurso Humano</h4>

      {/* SECCIÓN DE SELECCIÓN */}
      <div className="card p-3 mb-4 shadow-sm">
        <label className="form-label fw-bold">Recurso Humano Registrado</label>
        <div className="d-flex gap-2 align-items-end">
          <div className="flex-grow-1">
            <select
              className="form-select"
              value={recursoHumano?._id || ""}
              onChange={(e) => handleSeleccionar(e.target.value)}
            >
              <option value="" disabled>Seleccionar un recurso humano</option>
              {recursosDisponibles.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.nombre} ({r.tipoContratacion})
                </option>
              ))}
            </select>
          </div>
          <button className="btn-sda-principal" onClick={() => setMostrarModalCrear(true)}>
            Nuevo
          </button>
        </div>
      </div>

      {/* SECCIÓN DE RESUMEN (DATOS + COSTOS) */}
      {recursoHumano && (
        <div className="card mt-4 shadow-sm">
          <div className="card-header bg-light fw-bold">
            Resumen del Recurso
          </div>
          <div className="card-body">
            {/* Datos básicos */}
            <div className="mb-3">
              <p className="mb-1"><strong>Nombre:</strong> {recursoHumano.nombre}</p>
              <p className="mb-1"><strong>Tipo:</strong> <span className="text-capitalize">{recursoHumano.tipoContratacion}</span></p>
              <p className="mb-0"><strong>DNI:</strong> {recursoHumano.dni}</p>
              <button className="btn btn-link p-0 mt-2" onClick={() => setMostrarModalConfiguracion(true)}>
                ⚙️ Ver Configuración Avanzada
              </button>
            </div>
            <hr/>
            
            {/* Costos calculados */}
            {costoRecursoHumano ? (
              <div>
                <h5 className="card-title text-warning fw-bold mb-3">🧮 Detalle de Costos</h5>
                <div className="row">
                  <div className="col-md-4 mb-2"><strong>Uso:</strong> {costoRecursoHumano.usoCompleto ? "Completo" : "Parcial"} ({`${(costoRecursoHumano.proporcionUso * 100).toFixed(1)}%`})</div>
                  <div className="col-md-4 mb-2"><strong>Kms Mensuales:</strong> {costoRecursoHumano.kmTotales.toFixed(2)} km</div>
                </div>
                <table className="table table-sm tabla-montserrat mt-2">
                  <tbody>
                    {Object.entries(costoRecursoHumano.detalle || {}).map(([clave, valor]) => (
                      <tr key={clave}>
                        <td className="text-capitalize">{clave.replace(/([A-Z])/g, ' $1')}:</td>
                        <td className="text-end fw-bold">${Math.round(valor).toLocaleString('es-AR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <hr/>
                <h5 className="text-end text-success mt-3">
                  Total Estimado Mensual: ${costoRecursoHumano.totalFinal.toLocaleString('es-AR')}
                </h5>
              </div>
            ) : (
              <div className="text-center p-3 text-muted">
                <p>Calculando costos...</p>
                <small>Asegúrate de haber completado los pasos de Ruta, Frecuencia y Vehículo.</small>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECCIÓN DE NAVEGACIÓN */}
      <div className="d-flex justify-content-between mt-5">
        <button className="btn-sda-secundario" onClick={volver}>
          ⬅ Volver
        </button>
        <button className="btn-sda-principal" onClick={avanzar} disabled={!recursoHumano}>
          Siguiente ➡
        </button>
      </div>

      {/* MODALES */}
      <ModalCrearRecursoHumano
        show={mostrarModalCrear}
        onHide={() => setMostrarModalCrear(false)}
        onCrear={handleRecursoCreado}
      />
      {recursoHumano && (
        <ModalConfiguracionEmpleado
          show={mostrarModalConfiguracion}
          onClose={() => setMostrarModalConfiguracion(false)}
          recursoHumano={recursoHumano}
          onGuardarCambios={handleGuardarConfiguracion}
          tipoContratacion={recursoHumano.tipoContratacion}
        />
      )}
    </div>
  );
};

export default RecursoHumanoPaso;