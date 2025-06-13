// tests/testRecursoHumano.js
import calcularCostoTotalRecurso from "../utils/calcularCostoRecursoHumano.js";

console.log("🧪 Test de cálculo de recurso humano");
console.log("================================");

const ejemplos = [
  {
    titulo: "Empleado con 22 viajes (uso completo)",
    recurso: {
      tipoContratacion: "empleado",
      sueldoBasico: 800000,
      adicionalActividadPorc: 15,
      adicionalNoRemunerativoFijo: 50000,
      adicionalKmRemunerativo: 60,
      minKmRemunerativo: 350,
      viaticoPorKmNoRemunerativo: 30,
      minKmNoRemunerativo: 350,
      porcentajeCargasSociales: 35,
      adicionalCargaDescargaCadaXkm: 20000,
      kmPorUnidadDeCarga: 1000
    },
    kmsPorViaje: 500,
    cantidadViajesMensuales: 22,
  },
  {
    titulo: "Contratado con 2 viajes (uso parcial)",
    recurso: {
      tipoContratacion: "contratado",
      sueldoBasico: 600000,
      adicionalActividadPorc: 10,
      adicionalNoRemunerativoFijo: 30000,
      adicionalKmRemunerativo: 50,
      minKmRemunerativo: 350,
      viaticoPorKmNoRemunerativo: 20,
      minKmNoRemunerativo: 350,
      porcentajeOverheadContratado: 10,
      adicionalCargaDescargaCadaXkm: 18000,
      kmPorUnidadDeCarga: 1000
    },
    kmsPorViaje: 350,
    cantidadViajesMensuales: 2,
  },
  {
    titulo: "Empleado con 5 viajes (debe prorratear)",
    recurso: {
      tipoContratacion: "empleado",
      sueldoBasico: 700000,
      adicionalActividadPorc: 12,
      adicionalNoRemunerativoFijo: 40000,
      adicionalKmRemunerativo: 55,
      minKmRemunerativo: 350,
      viaticoPorKmNoRemunerativo: 25,
      minKmNoRemunerativo: 350,
      porcentajeCargasSociales: 30,
      adicionalCargaDescargaCadaXkm: 25000,
      kmPorUnidadDeCarga: 1000
    },
    kmsPorViaje: 400,
    cantidadViajesMensuales: 5,
  },
  {
    titulo: "Contratado con 18 viajes (uso casi completo)",
    recurso: {
      tipoContratacion: "contratado",
      sueldoBasico: 650000,
      adicionalActividadPorc: 12,
      adicionalNoRemunerativoFijo: 30000,
      adicionalKmRemunerativo: 55,
      minKmRemunerativo: 350,
      viaticoPorKmNoRemunerativo: 25,
      minKmNoRemunerativo: 350,
      porcentajeOverheadContratado: 10,
      adicionalCargaDescargaCadaXkm: 22000,
      kmPorUnidadDeCarga: 1000
    },
    kmsPorViaje: 450,
    cantidadViajesMensuales: 18,
  }
];

for (const test of ejemplos) {
  const resultado = calcularCostoTotalRecurso(
    test.recurso,
    test.kmsPorViaje,
    test.cantidadViajesMensuales
  );
  console.log(`\n🧾 Resultado para: ${test.titulo}`);
  console.log(JSON.stringify(resultado, null, 2));
}
