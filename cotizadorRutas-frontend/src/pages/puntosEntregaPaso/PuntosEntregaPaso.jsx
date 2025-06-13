import { useState } from "react";
import BuscadorDireccion from "../../components/BuscadorDireccion";
import TablaPuntos from "../../components/TablaPuntos";
import MapaRuta from "../../components/MapaRuta";
import ResumenRuta from "../../components/ResumenRuta";
import "../../styles/botonesSistema.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCotizacion } from "../../context/Cotizacion";

export default function PuntosEntregaPaso() {
    const [puntos, setPuntos] = useState([]);
    const [optimizar, setOptimizar] = useState(false);
    const [mostrarMapa, setMostrarMapa] = useState(false);
    const [fuerzaRecalculo, setFuerzaRecalculo] = useState(0);
    const [datosRuta, setDatosRuta] = useState(null); // <-- Este estado es clave para la validación
    const navigate = useNavigate();
    const { setPuntosEntrega } = useCotizacion();

    // Si se agrega un punto nuevo, reseteamos el cálculo de la ruta para forzar un nuevo cálculo
    const agregarPunto = (punto) => {
        if (!punto) return;
        setOptimizar(false);
        setPuntos((prev) => [...prev, punto]);
        setDatosRuta(null); // <-- FORZAMOS a que se deba recalcular
        setMostrarMapa(false);
    };

    const handleSiguiente = async () => {
        // Doble validación: no se debería poder hacer clic, pero por si acaso.
        if (!datosRuta) {
            alert("Por favor, calcula la ruta antes de continuar.");
            return;
        }

        try {
            const ordenados = puntos.map((p, index) => ({ ...p, orden: index }));
            
            // Guardamos la ruta en el backend para tener un registro
            const res = await axios.post("http://localhost:5010/api/rutas", {
                puntos: ordenados,
                distanciaKm: datosRuta?.distanciaKm || 0,
                duracionMin: datosRuta?.duracionMin || 0
            });
            const nuevaRutaId = res.data._id;
            
            // Guardamos la información en el contexto para los siguientes pasos
            setPuntosEntrega({
                puntos: ordenados,
                distanciaKm: datosRuta?.distanciaKm || 0,
                duracionMin: datosRuta?.duracionMin || 0,
                rutaId: nuevaRutaId
            });

            // Navegamos al siguiente paso
            navigate(`/cotizador/frecuencia/${nuevaRutaId}`);
        } catch (err) {
            console.error("❌ Error al guardar ruta:", err);
            alert("Error al guardar la ruta. Ver consola.");
        }
    };

    return (
        <div className="container py-4">
            <div className="card">
                <div className="card-body">
                    <h4 className="titulo-seccion mb-4">Paso 1: Definir los Puntos de Entrega</h4>
                    
                    <label className="form-label fw-bold">Añadir Dirección</label>
                    <BuscadorDireccion onAgregar={agregarPunto} />
                    
                    <TablaPuntos puntos={puntos} setPuntos={setPuntos} setOptimizar={setOptimizar} />

                    {puntos.length >= 2 && (
                        <div className="d-flex gap-2 mt-3">
                            <button
                                className="btn-sistema btn-sda-principal"
                                onClick={() => {
                                    setOptimizar(false);
                                    setMostrarMapa(true);
                                    setFuerzaRecalculo(prev => prev + 1);
                                }}
                            >
                                Calcular Ruta
                            </button>
                            <button
                                className="btn-sistema btn-sda-secundario"
                                onClick={() => {
                                    setOptimizar(true);
                                    setMostrarMapa(true);
                                    setFuerzaRecalculo(prev => prev + 1);
                                }}
                            >
                                Optimizar y Calcular
                            </button>
                        </div>
                    )}

                    {mostrarMapa && puntos.length >= 2 && (
                        <MapaRuta
                            puntos={puntos}
                            optimizar={optimizar}
                            onOptimizarOrden={(nuevoOrden) => setPuntos(nuevoOrden)}
                            onDatosRuta={setDatosRuta} // <-- Aquí se guarda el resultado del cálculo
                            recalculo={fuerzaRecalculo}
                        />
                    )}

                    {datosRuta && <ResumenRuta distanciaKm={datosRuta.distanciaKm} duracionMin={datosRuta.duracionMin} />}

                    {puntos.length >= 2 && (
                        <div className="mt-4 text-end">
                            <button
                                className="btn-sistema btn-sda-principal"
                                onClick={handleSiguiente}
                                // ✅ El botón se deshabilita si no hay datos de ruta calculados
                                disabled={!datosRuta}
                                title={!datosRuta ? "Debes calcular la ruta primero" : "Ir al siguiente paso"}
                            >
                                Siguiente ➡
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}