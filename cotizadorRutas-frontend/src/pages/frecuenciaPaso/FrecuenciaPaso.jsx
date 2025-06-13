import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useCotizacion } from "../../context/Cotizacion";
import "../../styles/formularioSistema.css";
import "../../styles/botonesSistema.css";

const FrecuenciaPaso = ({ onFrecuenciaConfirmada }) => {
  const [tipo, setTipo] = useState("esporadico");
  const [vueltasTotales, setVueltasTotales] = useState(1);
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [viajesPorDia, setViajesPorDia] = useState(1);
  const [observaciones, setObservaciones] = useState("");
  const { idRuta } = useParams();
  const navigate = useNavigate();
  const { setFrecuencia } = useCotizacion();


  const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

  const toggleDia = (dia) => {
    setDiasSeleccionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const handleSubmit = async () => {
    const data = {
      tipo,
      viajesPorDia,
      observaciones
    };

    if (tipo === "esporadico") {
      data.vueltasTotales = vueltasTotales;
    } else {
      data.diasSeleccionados = diasSeleccionados;
    }

    try {
      const res = await axios.post("http://localhost:5010/api/frecuencias-ruta", data);
      setFrecuencia(res.data);
      if (onFrecuenciaConfirmada) onFrecuenciaConfirmada(res.data);
      navigate(`/cotizador/vehiculo/${idRuta}`);
    } catch (error) {
      console.error("❌ Error al guardar frecuencia:", error);
      alert("Error al guardar frecuencia. Revisá la consola.");
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="titulo-seccion-sda">Frecuencia del Servicio</h4>

      <div className="mb-4">
        <label className="form-label fw-bold">Tipo de frecuencia</label>
        <select className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="esporadico">Esporádico (viaje único o aislado)</option>
          <option value="mensual">Mensual (frecuencia fija semanal)</option>
        </select>
      </div>

      {tipo === "esporadico" && (
        <div className="mb-4">
          <label className="form-label fw-bold">¿Cuántas vueltas se realizarán?</label>
          <input
            type="number"
            className="form-control"
            min={1}
            value={vueltasTotales}
            onChange={(e) => setVueltasTotales(Number(e.target.value))}
          />
        </div>
      )}

      {tipo === "mensual" && (
        <>
          <div className="mb-3">
            <label className="form-label fw-bold">Seleccioná los días en que se realiza la vuelta</label>
            <div className="d-flex flex-wrap gap-2">
              {diasSemana.map((dia) => (
                <label key={dia} className={`btn btn-outline-primary ${diasSeleccionados.includes(dia) ? "active" : ""}`}>
                  <input
                    type="checkbox"
                    className="d-none"
                    checked={diasSeleccionados.includes(dia)}
                    onChange={() => toggleDia(dia)}
                  />
                  {dia.charAt(0).toUpperCase() + dia.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mb-4">
        <label className="form-label fw-bold">Vueltas por día</label>
        <input
          type="number"
          className="form-control"
          min={1}
          value={viajesPorDia}
          onChange={(e) => setViajesPorDia(Number(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <label className="form-label fw-bold">Observaciones</label>
        <textarea
          className="form-control"
          rows={3}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Comentarios adicionales sobre la frecuencia..."
        />
      </div>

      <div className="d-flex justify-content-end">
        <button className="btn-sistema btn-sda-principal" onClick={handleSubmit}>
          Siguiente ➡
        </button>
      </div>
    </div>
  );
};

export default FrecuenciaPaso;
