import React, { useState, useEffect } from "react";
import axios from "axios";
import armarPresupuestoFinal from "../../utils/armarPresupuestoFinal";
import "../../styles/formularioSistema.css";
import "../../styles/tablasSistema.css";
import "../../styles/botonesSistema.css";

function ConfiguracionPresupuestoPaso() {
    const [config, setConfig] = useState({
        porcentajeAdministrativo: 10,
        porcentajeGanancia: 15,
        incluirPeajeEnCalculo: true,
        tipoPresupuesto: "completo",
        observaciones: "",
    });

    const [idRuta, setIdRuta] = useState(null);
    const [puntos, setPuntos] = useState([]);
    const [frecuencia, setFrecuencia] = useState({});
    const [vehiculo, setVehiculo] = useState({});
    const [recursoHumano, setRecursoHumano] = useState({});
    const [resumen, setResumen] = useState(null);

    useEffect(() => {
        const guardado = JSON.parse(localStorage.getItem("configCotizacion"));
        if (guardado) {
            setConfig((prev) => ({ ...prev, ...guardado.configuracion }));
            setIdRuta(guardado.idRuta);
            setPuntos(guardado.puntos || []);
            setFrecuencia(guardado.frecuencia || {});
            setVehiculo(guardado.vehiculo || {});
            setRecursoHumano(guardado.recursoHumano || {});
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleGuardarConfiguracion = async () => {
        try {
            if (!idRuta) return alert("❌ ID de ruta no disponible");
            const response = await axios.put(
                `http://localhost:5000/api/configuracion-presupuesto/${idRuta}`,

                { ...config, idRuta }
            );
            alert("✅ Configuración guardada correctamente");
        } catch (error) {
            console.error(error);
            alert("❌ Error al guardar la configuración");
        }
    };

    const handleGenerarResumen = () => {
        const presupuesto = armarPresupuestoFinal(
            puntos,
            frecuencia,
            vehiculo,
            recursoHumano,
            { ...config, modo: config.tipoPresupuesto }
        );
        setResumen(presupuesto.resumenCostos);
    };

    const handleCrearPresupuesto = async () => {
        try {
            const presupuesto = armarPresupuestoFinal(
                puntos,
                frecuencia,
                vehiculo,
                recursoHumano,
                { ...config, modo: config.tipoPresupuesto }
            );

            const response = await axios.post(
                "http://localhost:5010/api/presupuestos",

                presupuesto
            );

            if (response.status === 201) {
                window.alert("✅ Presupuesto creado exitosamente.");
            } else {
                window.alert("❌ Hubo un error al crear el presupuesto.");
            }
        } catch (error) {
            console.error(error);
            window.alert("❌ Error al conectar con el servidor.");
        }
    };

    return (
        <div className="contenedor-paso">
            <h2 className="titulo-seccion">Paso 5: Configuración Final</h2>

            <div className="formulario-sistema">
                <div className="form-group">
                    <label>% Administrativo:</label>
                    <input
                        type="number"
                        name="porcentajeAdministrativo"
                        value={config.porcentajeAdministrativo}
                        onChange={handleChange}
                        className="input-sistema"
                    />
                </div>

                <div className="form-group">
                    <label>% Ganancia:</label>
                    <input
                        type="number"
                        name="porcentajeGanancia"
                        value={config.porcentajeGanancia}
                        onChange={handleChange}
                        className="input-sistema"
                    />
                </div>

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="incluirPeajeEnCalculo"
                            checked={config.incluirPeajeEnCalculo}
                            onChange={handleChange}
                        />
                        Incluir peajes en el cálculo
                    </label>
                </div>

                <div className="form-group">
                    <label>Modo de presupuesto:</label>
                    <select
                        name="tipoPresupuesto"
                        value={config.tipoPresupuesto}
                        onChange={handleChange}
                        className="select-sistema"
                    >
                        <option value="completo">Presupuesto Completo</option>
                        <option value="resumen">Solo Resumen</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Observaciones:</label>
                    <textarea
                        name="observaciones"
                        value={config.observaciones}
                        onChange={handleChange}
                        className="input-sistema"
                    />
                </div>

                <div className="boton-derecha">
                    <button className="btn btn-secondary" onClick={handleGuardarConfiguracion}>
                        Guardar Configuración
                    </button>
                    <button className="btn btn-info" onClick={handleGenerarResumen}>
                        Ver Resumen
                    </button>
                    <button className="btn btn-warning" onClick={handleCrearPresupuesto}>
                        Crear Presupuesto
                    </button>
                </div>

                {resumen && (
                    <div className="tabla-resumen mt-4">
                        <h4>Resumen de Costos</h4>
                        <table className="tabla-sistema">
                            <tbody>
                                {Object.entries(resumen).map(([key, value]) => (
                                    <tr key={key}>
                                        <td>{key.replace(/([A-Z])/g, " $1").toUpperCase()}</td>
                                        <td>${value.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ConfiguracionPresupuestoPaso;
