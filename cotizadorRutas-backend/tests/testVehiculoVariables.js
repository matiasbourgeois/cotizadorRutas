// cotizadorRutas-backend/tests/testVehiculoVariables.js

import calcularCostoVehiculo from '../services/calculos/costoVehiculoService.js';

console.log("===== INICIO TEST: Costos Variables del Vehículo =====");

// 1. DATOS DE ENTRADA
const kmsPorViaje = 200;
const cantidadViajesMensuales = 10;
const esViajeRegular = true; // No afecta los costos variables, pero es un parámetro requerido

const vehiculo = {
    // --- Datos para costos variables ---
    precioVehiculoNuevo: 1000000,
    kmsVidaUtilVehiculo: 100000,
    precioCubierta: 10000,
    cantidadCubiertas: 4,
    kmsVidaUtilCubiertas: 20000,
    precioCambioAceite: 5000,
    kmsCambioAceite: 5000,
    precioLitroCombustible: 100,
    rendimientoKmLitro: 10,
    usaGNC: false,
    año: 2022,

    // --- Datos para costos fijos (los ponemos en 0 para no interferir) ---
    costoMantenimientoPreventivoMensual: 0,
    costoSeguroMensual: 0,
    costoPatenteMunicipal: 0,
    costoPatenteProvincial: 0
};

// 2. EJECUCIÓN DEL CÁLCULO
const resultado = calcularCostoVehiculo(
    vehiculo,
    kmsPorViaje,
    cantidadViajesMensuales,
    esViajeRegular
);

// 3. PRESENTACIÓN DE RESULTADOS
console.log(`\nCálculo para un total de ${resultado.kmsMensuales} km mensuales.`);

console.log("\n[ Depreciación ]");
console.log(`- Esperado: $20,000`);
console.log(`- Calculado: $${resultado.detalle.depreciacion}`);

console.log("\n[ Cubiertas ]");
console.log(`- Esperado: $4,000`);
console.log(`- Calculado: $${resultado.detalle.cubiertas}`);

console.log("\n[ Aceite ]");
console.log(`- Esperado: $2,000`);
console.log(`- Calculado: $${resultado.detalle.aceite}`);

console.log("\n[ Combustible ]");
console.log(`- Esperado: $20,000`);
console.log(`- Calculado: $${resultado.detalle.combustible}`);

const totalVariablesCalculado = 
    resultado.detalle.depreciacion +
    resultado.detalle.cubiertas +
    resultado.detalle.aceite +
    resultado.detalle.combustible;

console.log("\n-------------------------------------");
console.log("TOTAL COSTOS VARIABLES ESPERADO: $46,000");
console.log(`TOTAL COSTOS VARIABLES CALCULADO: $${totalVariablesCalculado}`);
console.log("=====================================");