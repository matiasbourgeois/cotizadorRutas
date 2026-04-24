import mongoose from 'mongoose';
import Presupuesto from '../models/Presupuesto.js';
import Vehiculo from '../models/Vehiculo.js';
import RecursoHumano from '../models/RecursoHumano.js';

// ═══════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════

/**
 * Calcula la fecha de inicio según el período solicitado.
 * @param {'1m'|'3m'|'6m'|'1y'|'all'} periodo
 * @returns {{ fechaInicio: Date|null, mesesTendencia: number }}
 */
function parsearPeriodo(periodo) {
  const hoy = new Date();
  switch (periodo) {
    case '1m':
      return {
        fechaInicio: new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1),
        mesesTendencia: 2, // mes actual + anterior (para comparar)
      };
    case '3m':
      return {
        fechaInicio: new Date(hoy.getFullYear(), hoy.getMonth() - 2, 1),
        mesesTendencia: 3,
      };
    case '6m':
      return {
        fechaInicio: new Date(hoy.getFullYear(), hoy.getMonth() - 5, 1),
        mesesTendencia: 6,
      };
    case '1y':
      return {
        fechaInicio: new Date(hoy.getFullYear() - 1, hoy.getMonth(), 1),
        mesesTendencia: 12,
      };
    case 'all':
    default:
      return {
        fechaInicio: null, // sin filtro de fecha
        mesesTendencia: 12, // últimos 12 meses para la tendencia
      };
  }
}

/**
 * Formatea un mes desde 'YYYY-MM' a nombre corto en español.
 * Ejemplo: '2026-04' → 'Abr'
 */
function formatearMes(yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  const nombre = date.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '');
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

// ═══════════════════════════════════════════════════════════════════
// Main Controller — MongoDB Aggregation Pipeline
// ═══════════════════════════════════════════════════════════════════

/**
 * GET /api/bi/stats?periodo=6m
 * Devuelve todas las métricas agregadas para el Dashboard BI.
 * 
 * Períodos soportados: 1m, 3m, 6m, 1y, all (default: 6m)
 * 
 * Usa MongoDB Aggregation Pipeline en vez de cargar todos los documentos
 * en memoria, lo que permite escalar a decenas de miles de presupuestos
 * sin impacto en performance ni RAM.
 */
export const obtenerStatsDashboard = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.usuario._id);
    const periodo = req.query.periodo || '6m';
    const { fechaInicio, mesesTendencia } = parsearPeriodo(periodo);

    // ─── Filtro base: siempre por usuario, opcionalmente por fecha ───
    const matchBase = { usuario: userId };
    if (fechaInicio) {
      matchBase.fechaCreacion = { $gte: fechaInicio };
    }

    // ══════════════════════════════════════
    // Pipeline 1: KPIs agregados (1 solo documento de resultado)
    // Reemplaza ~7 .reduce() sobre array en JS
    // ══════════════════════════════════════
    const kpiPipeline = Presupuesto.aggregate([
      { $match: matchBase },
      {
        $group: {
          _id: null,
          totalCotizaciones: { $sum: 1 },
          revenueTotal: { $sum: { $ifNull: ['$resumenCostos.totalFinal', 0] } },
          costoOperativoTotal: { $sum: { $ifNull: ['$resumenCostos.totalOperativo', 0] } },
          gananciaTotal: { $sum: { $ifNull: ['$resumenCostos.ganancia', 0] } },
          distanciaTotal: { $sum: { $ifNull: ['$totalKilometros', 0] } },
          mensuales: {
            $sum: { $cond: [{ $eq: ['$frecuencia.tipo', 'mensual'] }, 1, 0] },
          },
        },
      },
    ]);

    // ══════════════════════════════════════
    // Pipeline 2: Tendencia mensual (agrupado por YYYY-MM)
    // Reemplaza el loop de 6 .filter() + .reduce() en JS
    // ══════════════════════════════════════
    const hoy = new Date();
    const inicioTendencia = new Date(hoy.getFullYear(), hoy.getMonth() - (mesesTendencia - 1), 1);

    const tendenciaPipeline = Presupuesto.aggregate([
      {
        $match: {
          usuario: userId,
          fechaCreacion: { $gte: inicioTendencia },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$fechaCreacion' } },
          revenue: { $sum: { $ifNull: ['$resumenCostos.totalFinal', 0] } },
          cantidad: { $sum: 1 },
          ganancia: { $sum: { $ifNull: ['$resumenCostos.ganancia', 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ══════════════════════════════════════
    // Pipeline 3: Distribución de costos promedio
    // ══════════════════════════════════════
    const distribucionPipeline = Presupuesto.aggregate([
      { $match: matchBase },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          vehiculo: { $sum: { $ifNull: ['$resumenCostos.totalVehiculo', 0] } },
          rrhh: { $sum: { $ifNull: ['$resumenCostos.totalRecurso', 0] } },
          admin: { $sum: { $ifNull: ['$resumenCostos.totalAdministrativo', 0] } },
          peajes: { $sum: { $ifNull: ['$resumenCostos.totalPeajes', 0] } },
          otros: { $sum: { $ifNull: ['$resumenCostos.otrosCostos', 0] } },
        },
      },
    ]);

    // ══════════════════════════════════════
    // Pipeline 4: Distribución por tipo de vehículo
    // ══════════════════════════════════════
    const vehiculoPipeline = Presupuesto.aggregate([
      { $match: matchBase },
      {
        $group: {
          _id: { $ifNull: ['$vehiculo.datos.tipoVehiculo', 'desconocido'] },
          cantidad: { $sum: 1 },
          revenue: { $sum: { $ifNull: ['$resumenCostos.totalFinal', 0] } },
        },
      },
      { $sort: { cantidad: -1 } },
    ]);

    // ══════════════════════════════════════
    // Pipeline 5: Top 5 clientes
    // ══════════════════════════════════════
    const clientesPipeline = Presupuesto.aggregate([
      { $match: matchBase },
      {
        $group: {
          _id: { $ifNull: ['$cliente', 'Sin cliente'] },
          cantidad: { $sum: 1 },
          revenue: { $sum: { $ifNull: ['$resumenCostos.totalFinal', 0] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    // ══════════════════════════════════════
    // Queries simples (no necesitan aggregation)
    // ══════════════════════════════════════
    const ultimasQuery = Presupuesto.find(matchBase)
      .sort({ fechaCreacion: -1 })
      .limit(5)
      .select('cliente vehiculo.datos.marca vehiculo.datos.modelo vehiculo.datos.tipoVehiculo totalKilometros resumenCostos.totalFinal resumenCostos.ganancia fechaCreacion')
      .lean();

    const vehiculosCountQuery = Vehiculo.countDocuments({ usuario: userId });
    const rrhhCountQuery = RecursoHumano.countDocuments({ usuario: userId });

    // ══════════════════════════════════════
    // Ejecutar TODO en paralelo
    // ══════════════════════════════════════
    const [
      kpiResult,
      tendenciaResult,
      distribucionResult,
      vehiculoResult,
      clientesResult,
      ultimas,
      totalVehiculos,
      totalRRHH,
    ] = await Promise.all([
      kpiPipeline,
      tendenciaPipeline,
      distribucionPipeline,
      vehiculoPipeline,
      clientesPipeline,
      ultimasQuery,
      vehiculosCountQuery,
      rrhhCountQuery,
    ]);

    // ══════════════════════════════════════
    // Formatear resultados
    // ══════════════════════════════════════

    // KPIs
    const kpiRaw = kpiResult[0] || {
      totalCotizaciones: 0, revenueTotal: 0, costoOperativoTotal: 0,
      gananciaTotal: 0, distanciaTotal: 0, mensuales: 0,
    };

    const margenPromedio = kpiRaw.revenueTotal > 0
      ? Math.round((kpiRaw.gananciaTotal / kpiRaw.revenueTotal) * 1000) / 10
      : 0;

    const costoPromedioPorKm = kpiRaw.distanciaTotal > 0
      ? Math.round(kpiRaw.costoOperativoTotal / kpiRaw.distanciaTotal)
      : 0;

    const pctMensual = kpiRaw.totalCotizaciones > 0
      ? Math.round((kpiRaw.mensuales / kpiRaw.totalCotizaciones) * 100)
      : 0;

    // Tendencia mensual — rellenar meses vacíos para que el gráfico no tenga huecos
    const tendenciaMensual = [];
    for (let i = 0; i < mesesTendencia; i++) {
      const mes = new Date(hoy.getFullYear(), hoy.getMonth() - (mesesTendencia - 1) + i, 1);
      const clave = `${mes.getFullYear()}-${String(mes.getMonth() + 1).padStart(2, '0')}`;
      const dato = tendenciaResult.find(d => d._id === clave);

      tendenciaMensual.push({
        mes: formatearMes(clave),
        revenue: dato?.revenue || 0,
        cantidad: dato?.cantidad || 0,
        ganancia: dato?.ganancia || 0,
      });
    }

    // Distribución de costos (promedios)
    const distRaw = distribucionResult[0];
    const distribucionCostos = distRaw && distRaw.count > 0
      ? [
          { name: 'Vehículo', value: Math.round(distRaw.vehiculo / distRaw.count), color: '#22d3ee' },
          { name: 'RRHH', value: Math.round(distRaw.rrhh / distRaw.count), color: '#f59e0b' },
          { name: 'Administrativo', value: Math.round(distRaw.admin / distRaw.count), color: '#8b5cf6' },
          { name: 'Peajes', value: Math.round(distRaw.peajes / distRaw.count), color: '#10b981' },
          { name: 'Otros', value: Math.round(distRaw.otros / distRaw.count), color: '#6b7280' },
        ].filter(d => d.value > 0)
      : [];

    // Distribución por tipo de vehículo
    const distribucionVehiculos = vehiculoResult.map(v => ({
      tipo: v._id.charAt(0).toUpperCase() + v._id.slice(1),
      cantidad: v.cantidad,
      revenue: v.revenue,
    }));

    // Top clientes
    const topClientes = clientesResult.map(c => ({
      nombre: c._id,
      cantidad: c.cantidad,
      revenue: c.revenue,
    }));

    // Últimas cotizaciones
    const ultimasCotizaciones = ultimas.map(p => ({
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
    // Response — misma estructura que antes (backward compatible)
    // ══════════════════════════════════════
    res.json({
      periodo, // nuevo: informar al frontend qué período se aplicó
      kpis: {
        totalCotizaciones: kpiRaw.totalCotizaciones,
        revenueTotal: kpiRaw.revenueTotal,
        margenPromedio,
        costoPromedioPorKm,
        distanciaTotal: kpiRaw.distanciaTotal,
        totalVehiculos,
        totalRRHH,
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
