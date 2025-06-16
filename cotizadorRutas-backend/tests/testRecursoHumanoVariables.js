// cotizadorRutas-backend/tests/testRecursoHumanoVariables.js

import calcularCostoTotalRecurso from '../services/calculos/costoRecursoHumanoService.js';

console.log("===== INICIO TEST: Costos Variables de Recurso Humano =====");

// 1. DATOS DE ENTRADA
const kmsPorViaje = 400;
const cantidadViajesMensuales = 10; // Da 4000 km totales

const recursoHumano = {
    tipoContratacion: 'empleado',
    sueldoBasico: 100000,
    adicionalActividadPorc: 10,
    adicionalKmRemunerativo: 10,
    viaticoPorKmNoRemunerativo: 5,
    adicionalCargaDescargaCadaXkm: 1000,
    kmPorUnidadDeCarga: 1000,
    porcentajeCargasSociales: 20,
    // --- Datos para costos fijos (no afectan este test) ---
    adicionalNoRemunerativoFijo: 0
};

// 2. EJECUCIÓN DEL CÁLCULO
const resultado = calcularCostoTotalRecurso(
    recursoHumano,
    kmsPorViaje,
    cantidadViajesMensuales
);

const { detalle, totalFinal } = resultado;

// 3. PRESENTACIÓN DE RESULTADOS
console.log(`\nCálculo para un total de ${resultado.kmTotales} km mensuales.`);

console.log("\n[ Desglose de Costos Variables ]");
console.log(`- Adicional Actividad: Esperado $10,000 | Calculado: $${detalle.adicionalActividad}`);
console.log(`- Adicional por KM: Esperado $40,000 | Calculado: $${detalle.adicionalKm}`);
console.log(`- Viático por KM: Esperado $20,000 | Calculado: $${detalle.viaticoKm}`);
console.log(`- Adicional Lote KM: Esperado $4,000 | Calculado: $${detalle.adicionalPorKmLote}`);
console.log(`- Cargas Sociales: Esperado $34,800 | Calculado: $${detalle.cargasSociales}`);


console.log("\n-------------------------------------");
console.log("TOTAL FINAL ESPERADO: $208,800");
console.log(`TOTAL FINAL CALCULADO: $${totalFinal}`);
console.log("=====================================");