// En: cotizadorRutas-frontend/src/pages/configuracionPaso/ConfiguracionPresupuestoPaso.jsx

import React, { useState, useEffect } from "react";
import { useCotizacion } from "../../context/Cotizacion";
import armarPresupuestoFinal from "../../utils/armarPresupuestoFinal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Estilos
import "../../styles/formularioSistema.css";
import "../../styles/tablasSistema.css";
import "../../styles/botonesSistema.css";
import "../../styles/titulosSistema.css";

function ConfiguracionPresupuestoPaso() {
    const navigate = useNavigate();

    const {
        puntosEntrega,
        frecuencia,
        vehiculo,
        costoVehiculo,
        recursoHumano,
        costoRecursoHumano,
    } = useCotizacion();

    const [config, setConfig] = useState({
        costoPeajes: 0,
        costoAdministrativo: 0,
        otrosCostos: 0,
        porcentajeGanancia: 20,
        observaciones: "",
    });

    const [presupuestoFinal, setPresupuestoFinal] = useState(null);
    const [estadoBoton, setEstadoBoton] = useState('listo'); // 'listo', 'guardando', 'generando'

    useEffect(() => {
        if (costoVehiculo && costoRecursoHumano) {
            const vehiculoParaPresupuesto = { datos: vehiculo, calculo: costoVehiculo };
            const recursoHumanoParaPresupuesto = { datos: recursoHumano, calculo: costoRecursoHumano };
            const presupuestoCompleto = armarPresupuestoFinal(
                puntosEntrega.puntos,
                frecuencia,
                vehiculoParaPresupuesto,
                recursoHumanoParaPresupuesto,
                config
            );
            setPresupuestoFinal(presupuestoCompleto);
        }
    }, [puntosEntrega, frecuencia, vehiculo, costoVehiculo, recursoHumano, costoRecursoHumano, config]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const valorFinal = type === 'number' ? parseFloat(value) || 0 : value;
        setConfig((prev) => ({ ...prev, [name]: valorFinal }));
    };

    // --- LÓGICA ACTUALIZADA DEL BOTÓN FINAL ---
    const handleCrearPresupuestoYPdf = async () => {
        if (!presupuestoFinal) {
            alert("No se ha podido generar el resumen del presupuesto.");
            return;
        }

        try {
            // 1. Guardar el presupuesto en la base de datos
            setEstadoBoton('guardando');
            const response = await axios.post(
                "http://localhost:5010/api/presupuestos",
                presupuestoFinal
            );

            const presupuestoGuardado = response.data;
            if (response.status !== 201) {
                throw new Error("El servidor no pudo guardar el presupuesto.");
            }
            
            // 2. Solicitar y descargar el PDF del presupuesto recién guardado
            setEstadoBoton('generando');
            const pdfResponse = await axios.get(
                `http://localhost:5010/api/presupuestos/${presupuestoGuardado._id}/pdf`,
                { responseType: 'blob' } // ¡Muy importante para recibir un archivo!
            );

            // 3. Crear un link temporal y hacer clic para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([pdfResponse.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `presupuesto-${presupuestoGuardado._id}.pdf`);
            document.body.appendChild(link);
            link.click();

            // Limpieza
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            alert("✅ ¡Presupuesto guardado y PDF descargado exitosamente!");
            navigate("/");

        } catch (error) {
            console.error("Error en el proceso final:", error);
            alert("❌ Ocurrió un error. Revisa la consola para más detalles.");
        } finally {
            setEstadoBoton('listo');
        }
    };

    const getTextoBoton = () => {
        if (estadoBoton === 'guardando') return 'Guardando Presupuesto...';
        if (estadoBoton === 'generando') return 'Generando PDF...';
        return 'Finalizar y Crear Presupuesto';
    }

    return (
        <div className="container mt-4">
            <h4 className="titulo-seccion">Paso 5: Configuración y Presupuesto Final</h4>
            <div className="row">
                {/* Columna de configuración */}
                <div className="col-lg-4 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header fw-bold">Parámetros Finales</div>
                        <div className="card-body">
                            <div className="mb-3"><label className="form-label">Costo Peajes (por viaje)</label><input type="number" name="costoPeajes" value={config.costoPeajes} onChange={handleChange} className="form-control" /></div>
                            <div className="mb-3"><label className="form-label">Costo Administrativo (mensual)</label><input type="number" name="costoAdministrativo" value={config.costoAdministrativo} onChange={handleChange} className="form-control" /></div>
                            <div className="mb-3"><label className="form-label">Otros Costos (mensual)</label><input type="number" name="otrosCostos" value={config.otrosCostos} onChange={handleChange} className="form-control" /></div>
                            <div className="mb-3"><label className="form-label">% Ganancia</label><input type="number" name="porcentajeGanancia" value={config.porcentajeGanancia} onChange={handleChange} className="form-control" /></div>
                            <div className="mb-3"><label className="form-label">Observaciones</label><textarea name="observaciones" value={config.observaciones} onChange={handleChange} className="form-control" rows={3}/></div>
                        </div>
                    </div>
                </div>

                {/* Columna de resumen */}
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header fw-bold text-warning">📊 Resumen del Presupuesto</div>
                        <div className="card-body">
                            {presupuestoFinal?.resumenCostos ? (
                                <table className="table tabla-montserrat">
                                    <tbody>
                                        {Object.entries(presupuestoFinal.resumenCostos).map(([key, value]) => (
                                            <tr key={key} className={key === 'totalFinal' ? 'table-success' : ''}>
                                                <td className="text-capitalize">{key.replace(/([A-Z])/g, ' $1')}:</td>
                                                <td className={`text-end fw-bold ${key === 'ganancia' ? 'text-info' : ''} ${key === 'totalFinal' ? 'text-success' : ''}`}>${value.toLocaleString('es-AR')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (<p className="text-center text-muted p-4">Complete los parámetros para ver el resumen final.</p>)}
                        </div>
                    </div>
                </div>
            </div>

             {/* Navegación Final */}
             <div className="d-flex justify-content-between mt-5">
                <button className="btn-sda-secundario" onClick={() => navigate(-1)} disabled={estadoBoton !== 'listo'}>
                    ⬅ Volver
                </button>
                <button className="btn-soft-confirmar px-4 py-2" onClick={handleCrearPresupuestoYPdf} disabled={!presupuestoFinal || estadoBoton !== 'listo'}>
                    {getTextoBoton()}
                </button>
            </div>
        </div>
    );
}

export default ConfiguracionPresupuestoPaso;