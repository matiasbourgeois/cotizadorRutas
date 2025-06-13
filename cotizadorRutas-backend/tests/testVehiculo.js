import calcularCostoVehiculo from "../utils/calcularCostoVehiculo.js";

const vehiculos = [
  {
    nombre: "Camión nuevo regular",
    datos: {
      año: 2022,
      precioVehiculoNuevo: 10000000,
      kmsVidaUtilVehiculo: 500000,
      precioCubierta: 200000,
      cantidadCubiertas: 6,
      kmsVidaUtilCubiertas: 60000,
      precioCambioAceite: 120000,
      kmsCambioAceite: 10000,
      usaGNC: false,
      precioLitroCombustible: 800,
      rendimientoKmLitro: 4,
      costoMantenimientoPreventivoMensual: 50000,
      costoSeguroMensual: 60000,
      costoPatenteMunicipal: 20000,
      costoPatenteProvincial: 25000
    },
    kmsPorViaje: 300,
    cantidadViajesMensuales: 20,
    esViajeRegular: true
  },
  {
    nombre: "Vehículo viejo esporádico",
    datos: {
      año: 2008,
      precioVehiculoNuevo: 4000000,
      kmsVidaUtilVehiculo: 300000,
      precioCubierta: 100000,
      cantidadCubiertas: 4,
      kmsVidaUtilCubiertas: 50000,
      precioCambioAceite: 60000,
      kmsCambioAceite: 10000,
      usaGNC: true,
      precioGNC: 130,
      rendimientoKmLitro: 10,
      costoMantenimientoPreventivoMensual: 25000,
      costoSeguroMensual: 20000,
      costoPatenteMunicipal: 6000,
      costoPatenteProvincial: 4000
    },
    kmsPorViaje: 100,
    cantidadViajesMensuales: 2,
    esViajeRegular: false
  }
];

vehiculos.forEach((v) => {
  const resultado = calcularCostoVehiculo(
    v.datos,
    v.kmsPorViaje,
    v.cantidadViajesMensuales,
    v.esViajeRegular
  );

  console.log(`\n🚗 Resultado para: ${v.nombre}`);
  console.log(JSON.stringify(resultado, null, 2));
});
