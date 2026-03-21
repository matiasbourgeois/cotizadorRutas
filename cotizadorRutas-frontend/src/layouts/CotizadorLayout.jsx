
import { Outlet, useLocation } from 'react-router-dom';
import { Container } from '@mantine/core';
import { useEffect } from 'react';
import { useCotizacion } from '../context/Cotizacion';
import clienteAxios from '../api/clienteAxios';

/**
 * CotizadorLayout — Lightweight layout for the cotizador stepper.
 * Only handles the real-time calculation effect.
 * The sidebar (stepper + Asistente) is now in MainLayout.
 */
const CotizadorLayout = () => {
    const location = useLocation();

    const {
        puntosEntrega, frecuencia, vehiculo, recursoHumano, detallesCarga,
        setDetalleVehiculo, setDetalleRecurso, setResumenCostos
    } = useCotizacion();

    // Real-time calculation effect
    useEffect(() => {
        if (location.pathname.includes('/configuracion-final')) {
            return;
        }
        if (!puntosEntrega || !frecuencia) {
            return;
        }
        const debounceCalc = setTimeout(() => {
            const payload = {
                puntosEntrega, frecuencia, vehiculo, recursoHumano,
                detallesCarga, configuracion: {},
            };
            clienteAxios.post('/presupuestos/calcular', payload)
                .then(response => {
                    setDetalleVehiculo(response.data.detalleVehiculo);
                    setDetalleRecurso(response.data.detalleRecurso);
                    setResumenCostos(response.data.resumenCostos);
                })
                .catch(error => {
                    console.error("Error en el cálculo en tiempo real:", error);
                    setDetalleVehiculo(null);
                    setDetalleRecurso(null);
                });
        }, 300);
        return () => clearTimeout(debounceCalc);
    }, [puntosEntrega, frecuencia, vehiculo, recursoHumano, detallesCarga, setDetalleVehiculo, setDetalleRecurso, setResumenCostos, location]);

    return <Outlet />;
};

export default CotizadorLayout;