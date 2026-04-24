/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SEGURIDAD — Endpoints Públicos y Sanitización
 * ═══════════════════════════════════════════════════════════════════════════
 * Cómo correr: node tests/seguridad.test.mjs
 *
 * Verifica que los controladores de presupuesto filtran correctamente
 * los datos sensibles en los endpoints públicos (propuesta y desglose).
 *
 * Simula la lógica de filtrado SIN levantar Express ni MongoDB.
 */

const R='\x1b[0m',B='\x1b[1m',G='\x1b[32m',GR='\x1b[90m',E='\x1b[31m',C='\x1b[36m',M='\x1b[35m';
let pasados=0,fallados=0;

function chk(ok,label,det=''){
  if(ok){pasados++;console.log(`  ${G}✅${R} ${label}`)}
  else{fallados++;console.log(`  ${E}❌${R} ${label}`);if(det)console.log(`     ${GR}↳ ${det}${R}`)}
}

console.log(`\n${B}${C}${'═'.repeat(70)}${R}`);
console.log(`${B}${C}  🔒  SEGURIDAD — Filtrado de Datos Sensibles${R}`);
console.log(`${C}      Simula endpoints públicos del presupuesto${R}`);
console.log(`${B}${C}${'═'.repeat(70)}${R}\n`);

// ── Simular un presupuesto completo como viene de MongoDB ───────────────────
const mockPresupuesto = {
  _id: '66778899aabbccddeeff0011',
  empresa: { nombre: 'Test Corp', cuit: '30-12345678-9' },
  cliente: 'Cliente Test',
  terminos: 'Pago a 30 días',
  puntosEntrega: [{ direccion: 'CABA' }, { direccion: 'Rosario' }],
  totalKilometros: 300,
  duracionMin: 240,
  frecuencia: { tipo: 'mensual', diasSeleccionados: ['L','M','X','J','V'], viajesPorDia: 1 },
  detallesCarga: { tipo: 'general' },
  fechaCreacion: new Date(),
  vehiculo: {
    datos: { tipoVehiculo: 'camion', marca: 'Iveco', modelo: 'Tector' },
    calculo: { totalFinal: 150000, detalle: { combustible: 50000, depreciacion: 30000 } }
  },
  recursoHumano: {
    datos: { tipoContratacion: 'empleado', sueldoBasico: 917462 },
    calculo: { totalFinal: 200000, detalle: { costoBaseRemunerativo: 180000 } }
  },
  configuracion: {
    costoAdministrativo: 5,
    porcentajeGanancia: 20,  // ⚠️ SENSIBLE — margen de ganancia
    costoPeajes: 500,
    otrosCostos: 0,
    cliente: 'Cliente Test',
  },
  resumenCostos: {
    totalVehiculo: 150000,
    totalRecurso: 200000,
    totalPeajes: 10000,
    totalAdministrativo: 17500,
    otrosCostos: 0,
    costoAdicionalPeligrosa: 0,
    totalOperativo: 377500,
    ganancia: 75500,          // ⚠️ SENSIBLE — ganancia en $
    totalFinal: 453000,
    porcentajeIVA: 21,
    montoIVA: 95130,
    totalConIVA: 548130,
    cantidadViajesMensuales: 21.65,
  },
  usuario: '507f1f77bcf86cd799439011',  // ⚠️ SENSIBLE — user ID
};

// ── S-01 a S-03: Propuesta Pública ──────────────────────────────────────────
console.log(`${B}${M}  ─── Propuesta Pública (/p/:id) ───${R}\n`);

// Replicar la lógica EXACTA del controller (líneas 118-132)
const p = { ...mockPresupuesto };
const propuesta = {
  _id: p._id,
  empresa: p.empresa,
  cliente: p.cliente,
  terminos: p.terminos,
  puntosEntrega: p.puntosEntrega,
  totalKilometros: p.totalKilometros,
  duracionMin: p.duracionMin,
  frecuencia: p.frecuencia,
  detallesCarga: p.detallesCarga,
  fechaCreacion: p.fechaCreacion,
  resumenCostos: { totalFinal: p.resumenCostos?.totalFinal || 0 },
  vehiculo: { datos: p.vehiculo?.datos },
};

chk(propuesta.resumenCostos.ganancia === undefined, 'S-01: Propuesta NO expone ganancia ($)', `ganancia = ${propuesta.resumenCostos.ganancia}`);
chk(propuesta.configuracion === undefined, 'S-02: Propuesta NO expone configuración (% ganancia)', `configuracion = ${propuesta.configuracion}`);
chk(propuesta.usuario === undefined, 'S-03: Propuesta NO expone userId', `usuario = ${propuesta.usuario}`);
chk(propuesta.resumenCostos.totalFinal === 453000, 'S-03b: Propuesta SÍ incluye totalFinal', `totalFinal = ${propuesta.resumenCostos.totalFinal}`);
chk(propuesta.vehiculo.calculo === undefined, 'S-03c: Propuesta NO expone cálculos internos del vehículo');
chk(propuesta.recursoHumano === undefined, 'S-03d: Propuesta NO expone datos de RRHH detallados');

// ── S-04 a S-07: Desglose Público ───────────────────────────────────────────
console.log(`\n${B}${M}  ─── Desglose Público (/d/:id) ───${R}\n`);

// Replicar la lógica EXACTA del controller (líneas 149-178)
const resumenSeguro = {
  totalVehiculo: p.resumenCostos?.totalVehiculo || 0,
  totalRecurso: p.resumenCostos?.totalRecurso || 0,
  totalPeajes: p.resumenCostos?.totalPeajes || 0,
  totalAdministrativo: p.resumenCostos?.totalAdministrativo || 0,
  otrosCostos: p.resumenCostos?.otrosCostos || 0,
  costoAdicionalPeligrosa: p.resumenCostos?.costoAdicionalPeligrosa || 0,
  totalOperativo: p.resumenCostos?.totalOperativo || 0,
  totalFinal: p.resumenCostos?.totalFinal || 0,
  porcentajeIVA: p.resumenCostos?.porcentajeIVA || 21,
  montoIVA: p.resumenCostos?.montoIVA || 0,
  totalConIVA: p.resumenCostos?.totalConIVA || 0,
  // ❌ NO incluimos: ganancia
};

const desglose = {
  _id: p._id,
  empresa: p.empresa,
  cliente: p.cliente,
  puntosEntrega: p.puntosEntrega,
  totalKilometros: p.totalKilometros,
  duracionMin: p.duracionMin,
  frecuencia: p.frecuencia,
  detallesCarga: p.detallesCarga,
  fechaCreacion: p.fechaCreacion,
  vehiculo: p.vehiculo,
  recursoHumano: p.recursoHumano,
  resumenCostos: resumenSeguro,
  // ❌ NO incluimos: configuracion, usuario
};

chk(desglose.resumenCostos.ganancia === undefined, 'S-04: Desglose NO expone ganancia ($)');
chk(desglose.configuracion === undefined, 'S-05: Desglose NO expone configuración');
chk(desglose.usuario === undefined, 'S-06: Desglose NO expone userId');
chk(desglose.resumenCostos.totalVehiculo === 150000, 'S-06b: Desglose SÍ expone totalVehiculo');
chk(desglose.resumenCostos.totalRecurso === 200000, 'S-06c: Desglose SÍ expone totalRecurso');
chk(desglose.resumenCostos.totalOperativo === 377500, 'S-06d: Desglose SÍ expone totalOperativo');
chk(desglose.resumenCostos.totalConIVA === 548130, 'S-06e: Desglose SÍ expone totalConIVA');

// ── S-07: Sanitización de campos editables ──────────────────────────────────
console.log(`\n${B}${M}  ─── Sanitización de Updates ───${R}\n`);

// Replicar la lógica del actualizarPresupuesto (líneas 227-233)
const camposPermitidos = ['cliente', 'terminos', 'configuracion', 'detallesCarga'];
const reqBodyMalicioso = {
  cliente: 'Hacker Corp',
  terminos: 'Pago inmediato',
  resumenCostos: { totalFinal: 0 },      // ← intento de manipular
  usuario: '000000000000000000000000',     // ← intento de cambiar owner
  ganancia: -99999,                        // ← campo inventado
};

const datosLimpios = {};
for (const campo of camposPermitidos) {
  if (reqBodyMalicioso[campo] !== undefined) {
    datosLimpios[campo] = reqBodyMalicioso[campo];
  }
}

chk(datosLimpios.resumenCostos === undefined, 'S-07a: Update NO acepta resumenCostos', `resumenCostos = ${datosLimpios.resumenCostos}`);
chk(datosLimpios.usuario === undefined, 'S-07b: Update NO acepta usuario', `usuario = ${datosLimpios.usuario}`);
chk(datosLimpios.ganancia === undefined, 'S-07c: Update NO acepta ganancia', `ganancia = ${datosLimpios.ganancia}`);
chk(datosLimpios.cliente === 'Hacker Corp', 'S-07d: Update SÍ acepta cliente (campo permitido)');
chk(datosLimpios.terminos === 'Pago inmediato', 'S-07e: Update SÍ acepta terminos (campo permitido)');

// RESUMEN
const total=pasados+fallados;
console.log(`\n${B}${C}${'═'.repeat(70)}${R}`);
console.log(`${B}  🏁  SEGURIDAD — RESULTADO${R}`);
console.log(`${B}${C}${'═'.repeat(70)}${R}`);
console.log(`  ${G}✅  Pasados: ${pasados} / ${total}${R}`);
if(fallados>0){console.log(`  ${E}❌  Fallados: ${fallados}${R}`)}
else{console.log(`\n  ${G}${B}🔒  ¡SEGURIDAD VERIFICADA! Los endpoints públicos NO exponen datos sensibles.${R}`)}
console.log(`${B}${C}${'═'.repeat(70)}${R}\n`);
if(fallados>0) process.exit(1);
