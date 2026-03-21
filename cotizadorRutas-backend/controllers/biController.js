import Presupuesto from '../models/Presupuesto.js';
import Vehiculo from '../models/Vehiculo.js';
import RecursoHumano from '../models/RecursoHumano.js';

/**
 * GET /api/bi/stats
 * Devuelve todas las métricas agregadas para el Dashboard BI.
 */
export const obtenerStatsDashboard = async (req, res) => {
  try {
    const userId = req.usuario._id;

    // Fetch all data in parallel
    const [presupuestos, vehiculos, rrhh] = await Promise.all([
      Presupuesto.find({ usuario: userId }).sort({ fechaCreacion: -1 }).lean(),
      Vehiculo.find({ usuario: userId }).lean(),
      RecursoHumano.find({ usuario: userId }).lean(),
    ]);

    // ══════════════════════════════════════
    // KPIs
    // ══════════════════════════════════════
    const totalCotizaciones = presupuestos.length;
    const revenueTotal = presupuestos.reduce((s, p) => s + (p.resumenCostos?.totalFinal || 0), 0);
    const costoOperativoTotal = presupuestos.reduce((s, p) => s + (p.resumenCostos?.totalOperativo || 0), 0);
    const gananciaTotal = presupuestos.reduce((s, p) => s + (p.resumenCostos?.ganancia || 0), 0);
    const distanciaTotal = presupuestos.reduce((s, p) => s + (p.totalKilometros || 0), 0);

    const margenPromedio = revenueTotal > 0
      ? Math.round((gananciaTotal / revenueTotal) * 1000) / 10
      : 0;

    const costoPromedioPorKm = distanciaTotal > 0
      ? Math.round(costoOperativoTotal / distanciaTotal)
      : 0;

    // Frecuencia split
    const mensuales = presupuestos.filter(p => p.frecuencia?.tipo === 'mensual').length;
    const esporadicos = presupuestos.filter(p => p.frecuencia?.tipo === 'esporadico').length;
    const pctMensual = totalCotizaciones > 0 ? Math.round((mensuales / totalCotizaciones) * 100) : 0;

    // ══════════════════════════════════════
    // Tendencia mensual (últimos 6 meses)
    // ══════════════════════════════════════
    const hoy = new Date();
    const hace6Meses = new Date(hoy.getFullYear(), hoy.getMonth() - 5, 1);

    const tendenciaMensual = [];
    for (let i = 0; i < 6; i++) {
      const mes = new Date(hoy.getFullYear(), hoy.getMonth() - 5 + i, 1);
      const mesStr = mes.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '');
      const siguienteMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 1);

      const delMes = presupuestos.filter(p => {
        const f = new Date(p.fechaCreacion);
        return f >= mes && f < siguienteMes;
      });

      tendenciaMensual.push({
        mes: mesStr.charAt(0).toUpperCase() + mesStr.slice(1),
        revenue: delMes.reduce((s, p) => s + (p.resumenCostos?.totalFinal || 0), 0),
        cantidad: delMes.length,
        ganancia: delMes.reduce((s, p) => s + (p.resumenCostos?.ganancia || 0), 0),
      });
    }

    // ══════════════════════════════════════
    // Distribución de costos (promedios)
    // ══════════════════════════════════════
    const distribucionCostos = totalCotizaciones > 0 ? [
      { name: 'Vehículo', value: Math.round(presupuestos.reduce((s, p) => s + (p.resumenCostos?.totalVehiculo || 0), 0) / totalCotizaciones), color: '#22d3ee' },
      { name: 'RRHH', value: Math.round(presupuestos.reduce((s, p) => s + (p.resumenCostos?.totalRecurso || 0), 0) / totalCotizaciones), color: '#f59e0b' },
      { name: 'Administrativo', value: Math.round(presupuestos.reduce((s, p) => s + (p.resumenCostos?.totalAdministrativo || 0), 0) / totalCotizaciones), color: '#8b5cf6' },
      { name: 'Peajes', value: Math.round(presupuestos.reduce((s, p) => s + (p.resumenCostos?.totalPeajes || 0), 0) / totalCotizaciones), color: '#10b981' },
      { name: 'Otros', value: Math.round(presupuestos.reduce((s, p) => s + (p.resumenCostos?.otrosCostos || 0), 0) / totalCotizaciones), color: '#6b7280' },
    ].filter(d => d.value > 0) : [];

    // ══════════════════════════════════════
    // Distribución por tipo de vehículo
    // ══════════════════════════════════════
    const vehiculoPorTipo = {};
    presupuestos.forEach(p => {
      const tipo = p.vehiculo?.datos?.tipoVehiculo || 'desconocido';
      if (!vehiculoPorTipo[tipo]) vehiculoPorTipo[tipo] = { cantidad: 0, revenue: 0 };
      vehiculoPorTipo[tipo].cantidad++;
      vehiculoPorTipo[tipo].revenue += p.resumenCostos?.totalFinal || 0;
    });

    const distribucionVehiculos = Object.entries(vehiculoPorTipo).map(([tipo, data]) => ({
      tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
      cantidad: data.cantidad,
      revenue: data.revenue,
    })).sort((a, b) => b.cantidad - a.cantidad);

    // ══════════════════════════════════════
    // Top clientes
    // ══════════════════════════════════════
    const clienteMap = {};
    presupuestos.forEach(p => {
      const cliente = p.cliente || 'Sin cliente';
      if (!clienteMap[cliente]) clienteMap[cliente] = { cantidad: 0, revenue: 0 };
      clienteMap[cliente].cantidad++;
      clienteMap[cliente].revenue += p.resumenCostos?.totalFinal || 0;
    });

    const topClientes = Object.entries(clienteMap)
      .map(([nombre, data]) => ({ nombre, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // ══════════════════════════════════════
    // Últimas cotizaciones
    // ══════════════════════════════════════
    const ultimasCotizaciones = presupuestos.slice(0, 5).map(p => ({
      _id: p._id,
      cliente: p.cliente || 'Sin cliente',
      vehiculo: p.vehiculo?.datos ? `${p.vehiculo.datos.marca} ${p.vehiculo.datos.modelo}` : '?',
      tipoVehiculo: p.vehiculo?.datos?.tipoVehiculo || '?',
      km: p.totalKilometros || 0,
      totalFinal: p.resumenCostos?.totalFinal || 0,
      ganancia: p.resumenCostos?.ganancia || 0,
      fecha: p.fechaCreacion,
    }));

    // ══════════════════════════════════════
    // Response
    // ══════════════════════════════════════
    res.json({
      kpis: {
        totalCotizaciones,
        revenueTotal,
        margenPromedio,
        costoPromedioPorKm,
        distanciaTotal,
        totalVehiculos: vehiculos.length,
        totalRRHH: rrhh.length,
        pctMensual,
      },
      tendenciaMensual,
      distribucionCostos,
      distribucionVehiculos,
      topClientes,
      ultimasCotizaciones,
    });
  } catch (error) {
    console.error('Error BI stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas', detalle: error.message });
  }
};
