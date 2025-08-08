// Archivo: cotizadorRutas-frontend/src/hooks/useAsistenteContextual.js (Con Consejos Extra)

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCotizacion } from '../context/Cotizacion';

const getConsejosContextuales = (pathname, cotizacion) => {
    switch (true) {
        case pathname === '/':
            if (!cotizacion.puntosEntrega || cotizacion.puntosEntrega.puntos.length < 2) {
                return [
                    { tipo: 'guia', texto: 'Para comenzar, utiliza el buscador para añadir tu punto de origen y al menos un destino.' },
                    { tipo: 'info', texto: 'Las direcciones pueden ser puntos de entrega, de retiro o de paso intermedio.' }
                ];
            }
            return [
                { tipo: 'guia', texto: '¡Ruta definida! Puedes arrastrar los puntos en la tabla para reordenar las paradas.' },
                { tipo: 'info', texto: 'El último punto de la lista siempre será considerado el destino final del recorrido.' },
                { tipo: 'info', texto: 'No olvides seleccionar el "Tipo de Carga", ya que una carga refrigerada tiene costos de combustible más altos.' }
            ];
        
        case pathname.includes('/frecuencia'):
            return [
                { tipo: 'guia', texto: 'Define si se trata de un viaje único (Esporádico) o de una operativa regular (Mensual).' },
                { tipo: 'info', texto: 'La frecuencia "Mensual" multiplica los viajes por día por 4.12 semanas para estimar el total del mes.' },
                { tipo: 'info', texto: 'Esta decisión es clave para calcular cómo se distribuyen los costos fijos.' }
            ];

        case pathname.includes('/vehiculo'):
            return [
                { tipo: 'guia', texto: 'Elige el vehículo que realizará el viaje. El vehículo activo se resalta en color cian.' },
                { tipo: 'info', texto: 'El "Informe de Misión" a la derecha se actualizará con los costos del vehículo que selecciones.' },
                { tipo: 'info', texto: 'Usa el menú (...) en cada fila para ajustar los costos específicos de ese vehículo (combustible, cubiertas, etc.).' }
            ];

        case pathname.includes('/recurso-humano'):
             return [
                { tipo: 'guia', texto: 'Asigna un colaborador a esta misión. Su modalidad de contratación es clave para los costos.' },
                { tipo: 'info', texto: 'La modalidad "Empleado" calculará cargas sociales, mientras que "Contratado" aplicará un porcentaje de overhead.' },
                { tipo: 'info', texto: 'Si no encuentras al colaborador, puedes añadir nuevo personal con el botón "+ Añadir Personal".' }
             ];

        case pathname.includes('/configuracion-final'):
            return [
                { tipo: 'guia', texto: 'Estás en el último paso. Aquí defines tu rentabilidad y los detalles finales de la propuesta.' },
                { tipo: 'info', texto: 'El "Informe de Misión" a la derecha te muestra un resumen detallado de los costos que componen el precio final.' },
                { tipo: 'info', texto: 'El botón de menú junto a "Finalizar" te permite descargar un desglose de costos detallado para uso interno.' }
            ];

        default:
            return [];
    }
}

export const useAsistenteContextual = () => {
    const [consejos, setConsejos] = useState([]);
    const cotizacion = useCotizacion();
    const location = useLocation();

    useEffect(() => {
        const tips = getConsejosContextuales(location.pathname, cotizacion);
        setConsejos(tips);
    }, [location.pathname, cotizacion]);

    return { consejos };
};