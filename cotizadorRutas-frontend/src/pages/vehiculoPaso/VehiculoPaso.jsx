import { useEffect, useState } from 'react';
import { useCotizacion } from '../../context/Cotizacion';


import axios from 'axios';
import ModalCrearVehiculo from './ModalCrearVehiculo';
import ModalConfiguracionVehiculo from './ModalConfiguracionVehiculo';
import calcularCostoVehiculo from "../../utils/calcularCostoVehiculo";


import '../../styles/formularioSistema.css';
import '../../styles/botonesSistema.css';
import '../../styles/titulosSistema.css';

import { useNavigate, useParams } from 'react-router-dom';

const VehiculoPaso = ({ onSeleccionarVehiculo }) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);

  const { idRuta } = useParams();
  const navigate = useNavigate();
  const { costoVehiculo: costos } = useCotizacion();
  const { puntosEntrega, frecuencia, setVehiculo, setCostoVehiculo } = useCotizacion();



  useEffect(() => {
    obtenerVehiculos();
  }, []);

  const obtenerVehiculos = async () => {
    try {
      const res = await axios.get('http://localhost:5010/api/vehiculos');
      setVehiculos(res.data);
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
    }
  };

  const handleSeleccion = async (e) => {
    const id = e.target.value;
    const vehiculo = vehiculos.find(v => v._id === id);
    setVehiculoSeleccionado(vehiculo);
    if (onSeleccionarVehiculo) onSeleccionarVehiculo(vehiculo);

    try {
      const kmsPorViaje = puntosEntrega?.distanciaKm || 0;
      let cantidadViajesMensuales = 0;
      if (frecuencia?.tipo === "mensual") {
        cantidadViajesMensuales = (frecuencia.diasSeleccionados?.length || 0) * (frecuencia.viajesPorDia || 1) * 4; // 4 semanas promedio
      } else if (frecuencia?.tipo === "esporadico") {
        cantidadViajesMensuales = frecuencia.vueltasTotales || 0;
      }

      const esViajeRegular = frecuencia?.tipo === "mensual";

      const costos = await calcularCostoVehiculo(
        vehiculo,
        kmsPorViaje,
        cantidadViajesMensuales,
        esViajeRegular
      );

      setVehiculo(vehiculo);
      setCostoVehiculo(costos);

    } catch (error) {
      console.error("Error al calcular el costo del vehículo:", error);
    }
  };



  const handleVehiculoCreado = async (nuevoVehiculo) => {
    setVehiculos(prev => [...prev, nuevoVehiculo]);
    setVehiculoSeleccionado(nuevoVehiculo);
    if (onSeleccionarVehiculo) onSeleccionarVehiculo(nuevoVehiculo);
    const kmsPorViaje = puntosEntrega?.distanciaKm || 0;
    let cantidadViajesMensuales = 0;
    if (frecuencia?.tipo === "mensual") {
      cantidadViajesMensuales = (frecuencia.diasSeleccionados?.length || 0) * (frecuencia.viajesPorDia || 1) * 4; // 4 semanas promedio
    } else if (frecuencia?.tipo === "esporadico") {
      cantidadViajesMensuales = frecuencia.vueltasTotales || 0;
    }

    const esViajeRegular = frecuencia?.tipo === "mensual";


    const costos = await calcularCostoVehiculo(
      nuevoVehiculo,
      kmsPorViaje,
      cantidadViajesMensuales,
      esViajeRegular
    );

    setVehiculo(nuevoVehiculo);
    setCostoVehiculo(costos);


    setMostrarModal(false);
  };

  const handleSiguiente = () => {
    if (vehiculoSeleccionado) {
      navigate(`/cotizador/recurso-humano/${idRuta}`);
    } else {
      alert('Por favor, seleccione o cree un vehículo antes de continuar.');
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="titulo-seccion-sda">Seleccionar Vehículo</h4>

      <div className="mb-3 d-flex gap-2 align-items-end">
        <div className="flex-grow-1">
          <label className="form-label fw-bold">Vehículo registrado</label>
          <select className="form-select" onChange={handleSeleccion} defaultValue="">
            <option value="" disabled>Seleccione un vehículo</option>
            {vehiculos.map(v => (
              <option key={v._id} value={v._id}>
                {`${v.marca} ${v.modelo} (${v.patente})`}
              </option>
            ))}
          </select>
        </div>
        <button className="btn-sistema btn-sda-principal" onClick={() => setMostrarModal(true)}>
          Nuevo
        </button>
      </div>

      {vehiculoSeleccionado && (
        <div className="card p-3 mt-3 shadow-sm">
          <h5 className="mb-2">{vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo}</h5>
          <p className="mb-1"><strong>Patente:</strong> {vehiculoSeleccionado.patente}</p>
          <p className="mb-1"><strong>Tipo:</strong> {vehiculoSeleccionado.tipoVehiculo}</p>
          <p className="mb-1"><strong>Año:</strong> {vehiculoSeleccionado.año}</p>
          <p className="mb-1"><strong>Combustible:</strong> {vehiculoSeleccionado.tipoCombustible} {vehiculoSeleccionado.tieneGNC ? '(con GNC)' : ''}</p>
          <p className="mb-1"><strong>Capacidad:</strong> {vehiculoSeleccionado.capacidadKg} kg</p>
          <p className="mb-1"><strong>Rendimiento:</strong> {vehiculoSeleccionado.rendimientoKmLitro} km/l</p>
          <p className="mb-1"><strong>Observaciones:</strong> {vehiculoSeleccionado.observaciones || 'Ninguna'}</p>

          <button className="btn-sistema btn-sda-secundario mt-3" onClick={() => setMostrarConfiguracion(true)}>
            ⚙️ Configuración Avanzada
          </button>

        </div>
      )}

      <div className="d-flex justify-content-between mt-4">
        <button className="btn-sistema btn-sda-secundario" onClick={() => navigate(-1)}>
          ⬅ Volver
        </button>
        <button className="btn-sistema btn-sda-principal" onClick={handleSiguiente}>
          Siguiente ➡
        </button>


      </div>

      {costos && (
        <div className="card mt-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title text-warning fw-bold mb-3">🧮 Detalle de Costos del Vehículo</h5>

            <div className="row">
              <div className="col-md-6 mb-2">
                <strong>Uso completo del mes:</strong>{" "}
                {costos.usoCompleto ? "Sí (mensual)" : "No (uso parcial/esporádico)"}
              </div>
              <div className="col-md-6 mb-2">
                <strong>Proporción de uso:</strong>{" "}
                {`${(costos.proporcionUso * 100).toFixed(1)}%`}
              </div>
              <div className="col-md-6 mb-2">
                <strong>Kilómetros mensuales estimados:</strong>{" "}
                {costos.kmsMensuales.toFixed(2)} km
              </div>
            </div>

            <hr />

            <h6 className="text-muted mb-3">📊 Costos estimados:</h6>
            <div className="row">
              {Object.entries(costos.detalle).map(([clave, valor]) => (
                <div key={clave} className="col-sm-6 col-md-4 mb-2">
                  <strong className="text-capitalize">{clave}:</strong> ${valor.toLocaleString()}
                </div>
              ))}
            </div>

            <hr />
            <h5 className="text-end text-success mt-3">
              Total estimado mensual: ${costos.totalFinal.toLocaleString()}
            </h5>
          </div>
        </div>
      )}


      <ModalCrearVehiculo
        show={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onVehiculoCreado={handleVehiculoCreado}
      />

      {vehiculoSeleccionado && (
        <ModalConfiguracionVehiculo
          show={mostrarConfiguracion}
          onClose={() => setMostrarConfiguracion(false)}
          vehiculo={vehiculoSeleccionado}
          onGuardarCambios={(datosActualizados) => {
            setVehiculos(prev =>
              prev.map(v => v._id === datosActualizados._id ? datosActualizados : v)
            );
            setVehiculoSeleccionado(datosActualizados);
            setVehiculo(datosActualizados); // ✅ CORRECTO
          }}

        />
      )}

    </div>
  );
};

export default VehiculoPaso;
