import { useState, useEffect } from "react";
import BuscadorDireccion from "../../components/BuscadorDireccion";
import TablaPuntos from "../../components/TablaPuntos";
import MapaRuta from "../../components/MapaRuta";
import ResumenRuta from "../../components/ResumenRuta";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCotizacion } from "../../context/Cotizacion";
import { Map, List, Navigation } from 'lucide-react';


export default function PuntosEntregaPaso() {
    const [puntos, setPuntos] = useState([]);
    const [optimizar, setOptimizar] = useState(false);
    const [recalculo, setRecalculo] = useState(0);
    const [datosRuta, setDatosRuta] = useState(null);
    const navigate = useNavigate();
    const { setPuntosEntrega } = useCotizacion();

    useEffect(() => {
        // Cada vez que los puntos cambien, se resetea la ruta calculada
        setDatosRuta(null);
    }, [puntos]);

    const agregarPunto = (punto) => {
        if (!punto) return;
        setPuntos((prev) => [...prev, punto]);
        setOptimizar(false);
    };

    const handleSiguiente = async () => {
        if (!datosRuta) {
            alert("Por favor, calcula la ruta antes de continuar.");
            return;
        }

        try {
            const ordenados = puntos.map((p, index) => ({ ...p, orden: index }));
            
            const payload = {
                puntos: ordenados,
                distanciaKm: datosRuta.distanciaKm,
                duracionMin: datosRuta.duracionMin,
                staticMapUrl: datosRuta.staticMapUrl
            };

            const res = await axios.post("http://localhost:5010/api/rutas", payload);
            const nuevaRuta = res.data;
            
            setPuntosEntrega({
                ...payload,
                rutaId: nuevaRuta._id
            });

            navigate(`/cotizador/frecuencia/${nuevaRuta._id}`, { state: { idRuta: nuevaRuta._id } });
        } catch (err) {
            console.error("❌ Error al guardar ruta:", err);
            alert("Error al guardar la ruta. Ver consola.");
        }
    };

    const handleCalcular = (optimizado = false) => {
        setOptimizar(optimizado);
        setRecalculo(prev => prev + 1);
    };

    return (
        <div className="row g-4">
            {/* --- Columna Izquierda: Controles --- */}
            <div className="col-lg-5">
                <div className="card shadow-sm h-100">
                    <div className="card-body d-flex flex-column">
                        <h5 className="titulo-seccion mb-4 d-flex align-items-center">
                            <List size={28} className="me-2 text-warning" />
                            Define los Puntos
                        </h5>
                        
                        <BuscadorDireccion onAgregar={agregarPunto} />
                        
                        <div className="flex-grow-1">
                          <TablaPuntos puntos={puntos} setPuntos={setPuntos} setOptimizar={setOptimizar} />
                        </div>

                        {puntos.length >= 2 && (
                            <div className="mt-auto pt-3 border-top">
                                <p className="form-label fw-bold">Acciones de Ruta</p>
                                <div className="d-flex flex-column flex-sm-row gap-2">
                                    <button
                                        className="btn btn-sda-principal flex-fill"
                                        onClick={() => handleCalcular(false)}
                                    >
                                        Calcular Ruta
                                    </button>
                                    <button
                                        className="btn btn-sda-secundario flex-fill"
                                        onClick={() => handleCalcular(true)}
                                    >
                                        Optimizar y Calcular
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Columna Derecha: Mapa y Resumen --- */}
            <div className="col-lg-7">
                <div className="card shadow-sm">
                     <div className="card-body">
                         <h5 className="titulo-seccion mb-4 d-flex align-items-center">
                            <Map size={28} className="me-2 text-warning" />
                            Visualización de Ruta
                        </h5>
                        {puntos.length > 0 ? (
                             <MapaRuta
                                puntos={puntos}
                                optimizar={optimizar}
                                onOptimizarOrden={(nuevoOrden) => setPuntos(nuevoOrden)}
                                onDatosRuta={setDatosRuta}
                                recalculo={recalculo}
                            />
                        ) : (
                            <div className="text-center py-5 text-muted">
                                <p>Agrega al menos un punto para visualizar el mapa.</p>
                            </div>
                        )}
                       
                        {datosRuta && <ResumenRuta distanciaKm={datosRuta.distanciaKm} duracionMin={datosRuta.duracionMin} />}
                    </div>
                </div>
                 {puntos.length >= 2 && (
                    <div className="mt-4 text-end">
                        <button
                            className="btn-soft-confirmar px-4 py-2"
                            onClick={handleSiguiente}
                            disabled={!datosRuta}
                            title={!datosRuta ? "Debes calcular la ruta primero" : "Ir al siguiente paso"}
                        >
                            <Navigation size={18} className="me-2"/>
                            Siguiente Paso
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}