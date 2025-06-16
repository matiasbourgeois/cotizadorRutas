// cotizadorRutas-backend/tests/testPresupuestoCompleto.js

import calcularCostoVehiculo from '../services/calculos/costoVehiculoService.js';
import calcularCostoTotalRecurso from '../services/calculos/costoRecursoHumanoService.js';

console.log("===== INICIO TEST: Escenario 3 (Servicio Regular Completo) =====");

// 1. DATOS DE ENTRADA (Simulando 6 viajes por semana)
const payload = {
    puntosEntrega: { distanciaKm: 100 },
    frecuencia: {
        tipo: 'mensual',
        diasSeleccionados: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'], // 6 días
        viajesPorDia: 1,
        vueltasTotales: null,
    },
    vehiculo: {
        costoSeguroMensual: 50000,
        costoPatenteMunicipal: 20000,
        costoMantenimientoPreventivoMensual: 30000,
        año: 2022,
        precioVehiculoNuevo: 0, kmsVidaUtilVehiculo: 1, precioCubierta: 0,
        cantidadCubiertas: 0, kmsVidaUtilCubiertas: 1, precioCambioAceite: 0,
        kmsCambioAceite: 1, usaGNC: false, precioLitroCombustible: 0, rendimientoKmLitro: 1,
    },
    recursoHumano: {
        tipoContratacion: 'empleado',
        sueldoBasico: 500000,
        adicionalNoRemunerativoFijo: 50000,
        adicionalActividadPorc: 0, adicionalKmRemunerativo: 0, viaticoPorKmNoRemunerativo: 0,
        adicionalCargaDescargaCadaXkm: 0, kmPorUnidadDeCarga: 1, porcentajeCargasSociales: 0
    },
    configuracion: {
        costoPeajes: 0, costoAdministrativo: 0, otrosCostos: 0, porcentajeGanancia: 0
    }
};

// 2. LÓGICA DE CÁLCULO
const { frecuencia, vehiculo, recursoHumano, puntosEntrega } = payload;
const kmsPorViaje = puntosEntrega?.distanciaKm || 0;
let cantidadViajesMensuales = 0;
if (frecuencia?.tipo === "mensual") {
    cantidadViajesMensuales = (frecuencia.diasSeleccionados?.length || 0) * (frecuencia.viajesPorDia || 1) * 4.33;
} else if (frecuencia?.tipo === "esporadico") {
    cantidadViajesMensuales = frecuencia.vueltasTotales || 0;
}
const esViajeRegular = frecuencia?.tipo === "mensual";

// 3. EJECUCIÓN DE LOS CÁLCULOS
const costoVehiculoResult = calcularCostoVehiculo(
    vehiculo, kmsPorViaje, cantidadViajesMensuales, esViajeRegular
);
const costoRecursoResult = calcularCostoTotalRecurso(
    recursoHumano, kmsPorViaje, cantidadViajesMensuales
);

// 4. PRESENTACIÓN DE RESULTADOS
console.log("\n--- Resultados del Prorrateo ---");
console.log(`Viajes mensuales calculados: ${cantidadViajesMensuales.toFixed(2)} (6 días * 4.33)`);
console.log(`Proporción de Uso Calculada: ${costoVehiculoResult.proporcionUso.toFixed(4)} (Uso completo => 1)`);

console.log("\n[ Vehículo ]");
console.log(`Costo Fijo Mensual Total: $100,000`);
console.log(`Costo Fijo Prorrateado Esperado: $100,000`);
console.log(`--> RESULTADO DEL CÁLCULO: $${costoVehiculoResult.detalle.costosFijosProrrateados}`);

console.log("\n[ Recurso Humano ]");
console.log(`Costo Fijo Mensual Total: $550,000`);
console.log(`Sueldo Proporcional Esperado: $500,000`);
console.log(`Adicional Fijo Prorrateado Esperado: $50,000`);
console.log(`--> Sueldo Proporcional Calculado: $${costoRecursoResult.detalle.sueldoProporcional}`);
console.log(`--> Adicional Fijo Calculado: $${costoRecursoResult.detalle.adicionalFijo}`);

console.log("\n===== FIN TEST =====");