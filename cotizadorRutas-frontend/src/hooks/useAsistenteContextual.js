
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useCotizacion } from '../context/Cotizacion';

const getConsejosContextuales = (pathname, cotizacion) => {
    switch (true) {
        // =============================================
        // PASO 1 — Definir Ruta
        // =============================================
        case pathname === '/cotizador': {
            const puntos = cotizacion.puntosEntrega?.puntos;
            const tipoCarga = cotizacion.detallesCarga?.tipo;
            const esIdaVuelta = cotizacion.puntosEntrega?.idaYVuelta;

            if (!puntos || puntos.length < 2) {
                return [
                    { tipo: 'guia', texto: 'Para comenzar, usá el buscador para añadir tu punto de origen y al menos un destino.' },
                    { tipo: 'info', texto: 'Las direcciones pueden ser puntos de entrega, de retiro o de paso intermedio. Puedes añadir tantos como necesites.' }
                ];
            }

            const tips = [
                { tipo: 'guia', texto: '¡Ruta definida! Podés arrastrar los puntos en la tabla para reordenar las paradas. El último siempre será el destino final.' },
            ];

            if (esIdaVuelta) {
                tips.push({ tipo: 'info', texto: 'Tenés activado "Ida y Vuelta": los kilómetros totales y los costos variables se duplican automáticamente.' });
            }

            if (tipoCarga === 'refrigerada') {
                tips.push({ tipo: 'info', texto: 'Carga Refrigerada seleccionada: se aplica un recargo del 25% sobre el costo de combustible para compensar el equipo de frío.' });
            } else if (tipoCarga === 'peligrosa') {
                tips.push({ tipo: 'info', texto: 'Carga Peligrosa seleccionada: se suma un costo adicional de $250 por kilómetro por seguro y protocolo especial.' });
            } else {
                tips.push({ tipo: 'info', texto: 'Recordá seleccionar el Tipo de Carga. La carga refrigerada (+25% combustible) y peligrosa (+$250/km) impactan directamente en el costo.' });
            }

            return tips;
        }

        // =============================================
        // PASO 2 — Frecuencia
        // =============================================
        case pathname.includes('/frecuencia'): {
            const freq = cotizacion.frecuencia;

            if (!freq?.tipo) {
                return [
                    { tipo: 'guia', texto: 'Definí si se trata de un viaje único (Esporádico) o de una operativa regular (Mensual).' },
                    { tipo: 'info', texto: 'Esta elección impacta en cómo se distribuyen los costos fijos del vehículo entre los viajes.' }
                ];
            }

            if (freq.tipo === 'mensual') {
                return [
                    { tipo: 'guia', texto: 'Servicio Mensual configurado: los viajes se multiplican por 4.33 semanas para estimar el total del mes.' },
                    { tipo: 'info', texto: 'A mayor frecuencia mensual, los costos fijos del vehículo se prorratean entre más viajes, reduciendo el costo unitario.' }
                ];
            }

            return [
                { tipo: 'guia', texto: 'Servicio Esporádico seleccionado: definí la cantidad exacta de viajes que se van a realizar.' },
                { tipo: 'info', texto: 'En un servicio esporádico, los costos fijos del vehículo se asignan completamente a los viajes cotizados.' }
            ];
        }

        // =============================================
        // PASO 3 — Vehículo
        // =============================================
        case pathname.includes('/vehiculo'): {
            const vehiculo = cotizacion.vehiculo;

            if (!vehiculo) {
                return [
                    { tipo: 'guia', texto: 'Elegí el vehículo que realizará la misión. Usá "Seleccionar" para activarlo y ver sus costos en el Informe de Misión.' },
                    { tipo: 'info', texto: 'Podés ajustar los costos de cada vehículo desde el menú (⋮) → "Configurar" para personalizar combustible, cubiertas y costos fijos.' }
                ];
            }

            return [
                { tipo: 'guia', texto: `Vehículo asignado: ${vehiculo.marca || ''} ${vehiculo.modelo || ''}. Verificá que los costos del Informe de Misión sean correctos antes de continuar.` },
                { tipo: 'info', texto: 'Si los costos no se ajustan a la realidad, usá el menú (⋮) → "Configurar" para actualizar rendimiento, cubiertas y costos fijos.' }
            ];
        }

        // =============================================
        // PASO 4 — Recurso Humano
        // =============================================
        case pathname.includes('/recurso-humano'): {
            const recurso = cotizacion.recursoHumano;

            if (!recurso) {
                return [
                    { tipo: 'guia', texto: 'Asigná un colaborador a esta misión. La modalidad de contratación (Empleado o Contratado) define el cálculo de costos.' },
                    { tipo: 'info', texto: '"Empleado" incluye cargas sociales y aportes patronales; "Contratado" aplica un porcentaje de overhead operativo.' }
                ];
            }

            return [
                { tipo: 'guia', texto: `Colaborador asignado: ${recurso.nombre || 'Sin nombre'}. El sistema ya calculó los costos según su modalidad de contratación.` },
                { tipo: 'info', texto: 'Podés personalizar el salario, viáticos y costos indirectos desde el menú (⋮) → "Configurar" del colaborador seleccionado.' }
            ];
        }

        // =============================================
        // PASO 5 — Configuración Final
        // =============================================
        case pathname.includes('/configuracion-final'):
            return [
                { tipo: 'guia', texto: 'Último paso: definí tu margen de ganancia y los ajustes finales. El Informe de Misión muestra el desglose completo del precio de venta.' },
                { tipo: 'info', texto: 'Al finalizar, podés guardar el presupuesto para consultarlo en el Historial, y generar los documentos de Propuesta y Desglose.' }
            ];

        // =============================================
        // SECCIONES FUERA DEL COTIZADOR
        // =============================================
        case pathname === '/':
            return [
                { tipo: 'guia', texto: 'Bienvenido al panel principal. Desde acá podés iniciar una nueva cotización o acceder al historial y gestión de recursos.' },
            ];

        case pathname === '/historial':
            return [
                { tipo: 'guia', texto: 'Acá se listan todos los presupuestos guardados. Podés regenerar los documentos de Propuesta y Desglose en cualquier momento.' },
            ];

        case pathname === '/bi':
            return [
                { tipo: 'guia', texto: 'Las tarjetas superiores muestran tus KPIs clave: "Margen Promedio" es tu ganancia porcentual sobre el precio de venta, y "Costo/Km" refleja el costo operativo promedio por kilómetro cotizado.' },
                { tipo: 'info', texto: 'El gráfico "Revenue Mensual" compara facturación vs ganancia neta. La "Distribución de Costos" (dona) muestra el peso relativo de Vehículo, RRHH y Otros. El gráfico de barras revela qué tipo de vehículo cotizás más.' }
            ];

        case pathname === '/gestion/vehiculos':
            return [
                { tipo: 'guia', texto: 'Administrá tu flota: creá, editá o eliminá vehículos y personalizá sus parámetros de costos para cotizaciones más precisas.' },
            ];

        case pathname === '/gestion/rrhh':
            return [
                { tipo: 'guia', texto: 'Gestioná tu equipo de colaboradores: registrá personal, definí modalidades de contratación y ajustá sus costos operativos.' },
            ];

        case pathname === '/configuracion':
            return [
                { tipo: 'guia', texto: 'Acá definís los valores predeterminados que se aplican al crear vehículos y personal nuevos. Tiene 3 pestañas: Vehículos (4 tipos), RRHH (Empleado/Contratado) y Constantes de Cálculo.' },
                { tipo: 'info', texto: 'Los cambios solo afectan a los registros futuros. Los vehículos y colaboradores ya existentes conservan sus valores actuales sin modificarse.' }
            ];

        default:
            return [];
    }
}

export const useAsistenteContextual = () => {
  const [consejos, setConsejos] = useState([]);
  const cotizacion = useCotizacion();
  const location = useLocation();

  const prevKeyRef = useRef("");

  useEffect(() => {
    const tips = getConsejosContextuales(location.pathname, cotizacion);
    const key = (tips || []).map(t => t?.texto ?? "").join("||");
    if (key !== prevKeyRef.current) {
      prevKeyRef.current = key;
      setConsejos(tips);
    }
  }, [location.pathname, cotizacion]);

  return { consejos };
};