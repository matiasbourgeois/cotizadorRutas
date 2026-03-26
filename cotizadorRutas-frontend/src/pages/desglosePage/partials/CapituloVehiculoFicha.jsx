import { Car, Gauge, Wallet, ShieldCheck, Weight, Calendar, Fuel, Cog } from 'lucide-react';

const $ = v => (v || 0).toLocaleString('es-AR');

const CapituloVehiculoFicha = ({ data, Head, Foot }) => {
  if (!data?.vehiculo?.datos) return null;
  const d = data.vehiculo.datos;

  const costoFijoMens = (d.costoSeguroMensual || 0) + (d.costoPatenteProvincial || 0) +
    (d.costoPatenteMunicipal || 0) + (d.costoMantenimientoPreventivoMensual || 0);
  const valDepreciar = (d.precioVehiculoNuevo || 0) * (1 - ((d.valorResidualPorcentaje || 0) / 100));

  return (
    <div className="dg-pg">
      <Head />
      <div className="dg-inner">
        <h1 className="dg-chapter">Cap. 2: Ficha Técnica del Vehículo</h1>
        <p className="dg-chapter-sub">Especificaciones del activo asignado a la operación. Estos parámetros son la base de todos los cálculos de costo vehicular.</p>

        {/* ID */}
        <div className="dg-id-row">
          <div className="dg-id-icon"><Car size={18} /></div>
          <div className="dg-id-name">{d.marca} {d.modelo}</div>
          <span className="dg-id-badge" style={{ color: 'var(--c1)', borderColor: 'var(--c1)' }}>{d.patente}</span>
          <span className="dg-id-badge" style={{ color: '#64748b', borderColor: '#e2e8f0' }}>
            <Calendar size={10} style={{ marginRight: 3, verticalAlign: -1 }} />{d.año}
          </span>
          {d.tipoCombustible && <span className="dg-id-badge" style={{ color: '#059669', borderColor: '#a7f3d0', background: '#f0fdf4' }}>
            <Fuel size={10} style={{ marginRight: 3, verticalAlign: -1 }} />{d.tipoCombustible}{d.tieneGNC ? ' + GNC' : ''}
          </span>}
        </div>

        {/* 4 KPIs */}
        <div className="dg-kpi-mini-row">
          <div className="dg-kpi-mini">
            <div className="dg-kpi-mini-icon" style={{ background: '#f59e0b' }}><Gauge size={16} /></div>
            <div><div className="dg-kpi-mini-val">{d.rendimientoKmLitro} km/l</div><div className="dg-kpi-mini-label">Rendimiento</div></div>
          </div>
          <div className="dg-kpi-mini">
            <div className="dg-kpi-mini-icon" style={{ background: '#8b5cf6' }}><Wallet size={16} /></div>
            <div><div className="dg-kpi-mini-val">${$(valDepreciar)}</div><div className="dg-kpi-mini-label">Valor a Depreciar</div></div>
          </div>
          <div className="dg-kpi-mini">
            <div className="dg-kpi-mini-icon" style={{ background: '#3b82f6' }}><ShieldCheck size={16} /></div>
            <div><div className="dg-kpi-mini-val">${$(costoFijoMens)}</div><div className="dg-kpi-mini-label">Costo Fijo / Mes</div></div>
          </div>
          <div className="dg-kpi-mini">
            <div className="dg-kpi-mini-icon" style={{ background: '#10b981' }}><Weight size={16} /></div>
            <div><div className="dg-kpi-mini-val">{$(d.capacidadKg)} kg</div><div className="dg-kpi-mini-label">Capacidad de Carga</div></div>
          </div>
        </div>

        {/* 2 tables */}
        <div className="dg-cols">
          <div className="dg-col">
            <h3 className="dg-st">Parámetros Económicos</h3>
            <table className="dg-tbl">
              <thead><tr><th>Concepto</th><th style={{ textAlign: 'right' }}>Valor</th></tr></thead>
              <tbody>
                <tr><td colSpan={2} style={{ height: 6 }}></td></tr>
                <tr><td>Precio de Adquisición (Nuevo)</td><td className="dg-tbl-val">${$(d.precioVehiculoNuevo)}</td></tr>
                <tr><td>Valor Residual al Final</td><td className="dg-tbl-val">{d.valorResidualPorcentaje || 0}%</td></tr>
                <tr><td>Vida Útil Total</td><td className="dg-tbl-val">{$(d.kmsVidaUtilVehiculo)} km</td></tr>
                <tr><td colSpan={2} style={{ height: 6 }}></td></tr>
                <tr><td>Juego de Cubiertas ({d.cantidadCubiertas || 0} u.)</td><td className="dg-tbl-val">${$(d.precioCubierta)} c/u</td></tr>
                <tr><td>Cambio de Aceite y Filtros</td><td className="dg-tbl-val">${$(d.precioCambioAceite)}</td></tr>
                <tr><td>Precio del Combustible</td><td className="dg-tbl-val">${$(d.precioLitroCombustible)}/l</td></tr>
                {d.tieneGNC && <tr><td>Precio del GNC</td><td className="dg-tbl-val">${$(d.precioGNC)}/m³</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="dg-col">
            <h3 className="dg-st">Parámetros Técnicos y Fijos</h3>
            <table className="dg-tbl">
              <thead><tr><th>Concepto</th><th style={{ textAlign: 'right' }}>Valor</th></tr></thead>
              <tbody>
                <tr><td colSpan={2} style={{ height: 6 }}></td></tr>
                <tr><td>Vida Útil por Cubierta</td><td className="dg-tbl-val">{$(d.kmsVidaUtilCubiertas)} km</td></tr>
                <tr><td>Frecuencia de Cambio de Aceite</td><td className="dg-tbl-val">{$(d.kmsCambioAceite)} km</td></tr>
                <tr><td colSpan={2} style={{ height: 6 }}></td></tr>
                <tr><td>Seguro del Vehículo</td><td className="dg-tbl-val">${$(d.costoSeguroMensual)}/mes</td></tr>
                <tr><td>Patente Provincial</td><td className="dg-tbl-val">${$(d.costoPatenteProvincial)}/mes</td></tr>
                <tr><td>Patente Municipal</td><td className="dg-tbl-val">${$(d.costoPatenteMunicipal)}/mes</td></tr>
                <tr><td>Mantenimiento Preventivo</td><td className="dg-tbl-val">${$(d.costoMantenimientoPreventivoMensual)}/mes</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cargo type + info card */}
        <div className="dg-info">
          <div className="dg-info-title">Tipo de Carga Asignada</div>
          <div className="dg-info-text">
            El vehículo operará con carga de tipo <strong style={{ textTransform: 'capitalize' }}>{data.detallesCarga?.tipo || 'general'}</strong>.
            {data.detallesCarga?.tipo === 'peligrosa' && ' Se aplicará un recargo adicional por manipulación de mercancía peligrosa.'}
            {data.detallesCarga?.tipo === 'refrigerada' && ' El costo contempla el consumo adicional del equipo de refrigeración.'}
            {data.detallesCarga?.tipo === 'general' && ' No se aplican recargos adicionales por tipo de carga.'}
            {` Capacidad máxima del vehículo: ${$(d.capacidadKg)} kg.`}
          </div>
        </div>

        {/* Summary totals table to fill space */}
        <h3 className="dg-st">Resumen de Costos Fijos Mensuales</h3>
        <table className="dg-tbl">
          <thead><tr><th>Concepto</th><th style={{ textAlign: 'right' }}>Monto / Mes</th></tr></thead>
          <tbody>
            <tr><td>Seguro del Vehículo</td><td className="dg-tbl-val">${$(d.costoSeguroMensual)}</td></tr>
            <tr><td>Patente Provincial</td><td className="dg-tbl-val">${$(d.costoPatenteProvincial)}</td></tr>
            <tr><td>Patente Municipal</td><td className="dg-tbl-val">${$(d.costoPatenteMunicipal)}</td></tr>
            <tr><td>Mantenimiento Preventivo</td><td className="dg-tbl-val">${$(d.costoMantenimientoPreventivoMensual)}</td></tr>
            <tr className="dg-tbl-total"><td>Total Costos Fijos</td><td className="dg-tbl-val">${$(costoFijoMens)}</td></tr>
          </tbody>
        </table>

        {/* Depreciation & lifecycle info */}
        <div className="dg-info" style={{ marginTop: 'auto' }}>
          <div className="dg-info-title">Modelo de Depreciación</div>
          <div className="dg-info-text">
            El vehículo se deprecia linealmente hasta alcanzar un valor residual del <strong>{d.valorResidualPorcentaje || 0}%</strong> sobre
            el precio de compra de <strong>${$(d.precioVehiculoNuevo)}</strong>.
            El monto sujeto a depreciación es de <strong>${$(valDepreciar)}</strong>, distribuido a lo largo
            de <strong>{$(d.kmsVidaUtilVehiculo)} km</strong> de vida útil.
            A su vez, el cambio de aceite se realiza cada {$(d.kmsCambioAceite)} km y las cubiertas se reemplazan
            cada {$(d.kmsVidaUtilCubiertas)} km.
          </div>
        </div>
      </div>
      <Foot p={3} />
    </div>
  );
};

export default CapituloVehiculoFicha;