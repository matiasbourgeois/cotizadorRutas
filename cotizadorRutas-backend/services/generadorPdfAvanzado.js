// ruta: cotizadorRutas-backend/services/generadorPdfAvanzado.js

import puppeteer from 'puppeteer';
import { format } from 'date-fns';
import QRCode from 'qrcode';

const formatCurrency = (num) => `$ ${Math.round(num || 0).toLocaleString('es-AR')}`;
const formatKey = (key) => key ? (key.charAt(0).toUpperCase() + key.slice(1)) : '';

const getStaticMapUrl = (puntos, apiKey) => {
    if (!puntos || puntos.length === 0 || !apiKey) return '';
    const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap?';
    const size = 'size=640x400';
    const maptype = 'roadmap';
    const markers = puntos.map((p, index) =>
        `markers=color:0xffc107|label:${String.fromCharCode(65 + index)}|${p.lat},${p.lng}`
    ).join('&');
    const path = `path=color:0x0D47A1|weight:5|${puntos.map(p => `${p.lat},${p.lng}`).join('|')}`;
    return `${baseUrl}${size}&${maptype}&${markers}&${path}&key=${apiKey}`;
};

const generarUrlGoogleMaps = (puntos) => {
    if (!puntos || puntos.length < 2) return '';
    const baseUrl = 'https://www.google.com/maps/dir/?api=1';
    const origin = `${puntos[0].lat},${puntos[0].lng}`;
    const destination = `${puntos[puntos.length - 1].lat},${puntos[puntos.length - 1].lng}`;
    const waypoints = puntos.slice(1, -1).map(p => `${p.lat},${p.lng}`).join('|');
    const params = new URLSearchParams({
        api: '1',
        origin: origin,
        destination: destination,
        travelmode: 'driving'
    });
    if (waypoints) {
        params.append('waypoints', waypoints);
    }
    return `${baseUrl}&${params.toString()}`;
};

const generarQrCodeDataUrl = async (url) => {
    if (!url) return '';
    try {
        return await QRCode.toDataURL(url, { errorCorrectionLevel: 'H', margin: 2, width: 150 });
    } catch (err) {
        console.error('Error generando el código QR:', err);
        return '';
    }
};

// ===== NUEVA FUNCIÓN PARA EL CAPÍTULO 2 =====
function generarCapituloFrecuencia(presupuesto) {
    // ✅ Se añade "vehiculo" para poder tomar el kilometraje total calculado
    const { frecuencia, vehiculo } = presupuesto;
    if (!frecuencia) return '';

    let contenidoPrincipal = '';

    // Lógica para el servicio MENSUAL
    if (frecuencia.tipo === 'mensual') {
        const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const diasSeleccionados = frecuencia.diasSeleccionados.map(d => d.toLowerCase());
        
        const viajesMensualesEstimado = Math.round((frecuencia.diasSeleccionados?.length || 0) * (frecuencia.viajesPorDia || 1) * 4.33);

        const calendarioHtml = `
            <table class="week-calendar">
                <thead>
                    <tr>
                        ${diasSemana.map(dia => `<th>${dia.substring(0, 3)}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        ${diasSemana.map(dia => {
                            const esSeleccionado = diasSeleccionados.includes(dia.toLowerCase());
                            return `<td class="${esSeleccionado ? 'selected' : ''}">${esSeleccionado ? '✔' : ''}</td>`;
                        }).join('')}
                    </tr>
                </tbody>
            </table>
        `;

        contenidoPrincipal = `
            <table class="info-table">
                <tbody>
                    <tr>
                        <td class="left-column">
                            <div class="card">
                                <h3>Calendario Semanal</h3>
                                ${calendarioHtml}
                            </div>
                        </td>
                        <td class="right-column">
                            <div class="summary-card">
                                <h4>Detalles de Frecuencia</h4>
                                <p><strong>Tipo de Servicio:</strong> Mensual / Recurrente</p>
                                <p><strong>Días de Operación por Semana:</strong> ${frecuencia.diasSeleccionados.length} días</p>
                                <p><strong>Viajes por Día:</strong> ${frecuencia.viajesPorDia || 1}</p>
                                <p><strong>Total Estimado Mensual:</strong> ~${viajesMensualesEstimado} viajes</p>
                                <p><strong>Kilometraje Total Estimado:</strong> ${Math.round(vehiculo.calculo.kmsMensuales)} km / mes</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;

    // Lógica para el servicio ESPORÁDICO
    } else {
        contenidoPrincipal = `
            <div class="card summary-card">
                <h4>Detalles de Frecuencia</h4>
                <p><strong>Tipo de Servicio:</strong> Esporádico / Viajes Puntuales</p>
                <p><strong>Cantidad Total de Vueltas:</strong> ${frecuencia.vueltasTotales || 1}</p>
                 <p><strong>Kilometraje Total del Servicio:</strong> ${Math.round(vehiculo.calculo.kmsMensuales)} km</p>
            </div>
        `;
    }

    // Lógica para las observaciones (se añade en ambos casos si existe)
    let observacionesHtml = '';
    if (frecuencia.observaciones) {
        observacionesHtml = `
            <div class="card observations-card">
                <h4>Observaciones Adicionales</h4>
                <p>${frecuencia.observaciones}</p>
            </div>
        `;
    }

    // Unimos todo en la sección del capítulo
    return `
        <div class="section">
            <h2 class="section-title">Capítulo 2: Frecuencia y Modalidad del Servicio</h2>
            <p class="explanation">
                Esta sección describe la regularidad y el cronograma de los viajes propuestos, definiendo la cadencia del servicio a lo largo del tiempo.
            </p>
            ${contenidoPrincipal}
            ${observacionesHtml}
        </div>
    `;
}

// ===== NUEVA FUNCIÓN PARA EL CAPÍTULO 3 =====

// ===== REEMPLAZAR ESTA FUNCIÓN COMPLETA (VERSIÓN FINAL CAP. 3) =====
function generarCapituloVehiculo(presupuesto) {
    const { vehiculo } = presupuesto;
    if (!vehiculo || !vehiculo.datos || !vehiculo.calculo) return '';

    const { datos, calculo } = vehiculo;

    const fichaTecnica = {
        'Identificación General': {
            'Vehículo': `${datos.marca || ''} ${datos.modelo || ''}`,
            'Patente': datos.patente || 'N/A',
            'Año': datos.año || 'N/A',
            'Tipo': formatKey(datos.tipoVehiculo) || 'N/A'
        },
        'Capacidades de Carga': {
            'Carga Máxima': `${datos.capacidadKg || 0} kg`,
            'Volumen Útil': `${datos.volumenM3 || 0} m³`
        },
        'Motor y Combustible': {
            'Tipo de Combustible': formatKey(datos.tipoCombustible),
            'Posee GNC': datos.tieneGNC ? 'Sí' : 'No',
            'Rendimiento Promedio': `${datos.rendimientoKmLitro || 0} km/l`,
            'Precio Combustible Principal': formatCurrency(datos.precioLitroCombustible),
            'Precio GNC (por m³)': datos.tieneGNC ? formatCurrency(datos.precioGNC) : 'N/A',
        },
        'Parámetros para Cálculo de Desgaste': {
            'Valor del Vehículo (Nuevo)': formatCurrency(datos.precioVehiculoNuevo),
            'Vida Útil del Vehículo': `${(datos.kmsVidaUtilVehiculo || 0).toLocaleString('es-AR')} km`,
            'Precio por Cubierta': formatCurrency(datos.precioCubierta),
            'Vida Útil por Cubierta': `${(datos.kmsVidaUtilCubiertas || 0).toLocaleString('es-AR')} km`,
            'Precio Cambio de Aceite': formatCurrency(datos.precioCambioAceite),
            'Km entre Cambios': `${(datos.kmsCambioAceite || 0).toLocaleString('es-AR')} km`,
        },
    };

    const tablaCostos = {
        'Combustible / GNC': calculo.detalle.combustible,
        'Desgaste de Cubiertas': calculo.detalle.cubiertas,
        'Cambio de Aceite y Filtros': calculo.detalle.aceite,
        'Depreciación del Vehículo': calculo.detalle.depreciacion,
        [`Costos Fijos Prorrateados (${(calculo.proporcionUso * 100).toFixed(0)}%)`]: calculo.detalle.costosFijosProrrateados,
    };

    const generarFichaHtml = () => {
        let html = '';
        for (const seccion in fichaTecnica) {
            html += `<div class="card">`;
            html += `<h3>${seccion}</h3>`;
            html += '<table class="ficha-tecnica-table">';

            const items = Object.entries(fichaTecnica[seccion]);
            for (let i = 0; i < items.length; i += 2) {
                html += '<tr>';
                html += `<td class="ficha-key">${items[i][0]}:</td><td class="ficha-value">${items[i][1]}</td>`;
                if (items[i + 1]) {
                    html += `<td class="ficha-key">${items[i + 1][0]}:</td><td class="ficha-value">${items[i + 1][1]}</td>`;
                } else {
                    html += '<td></td><td></td>';
                }
                html += '</tr>';
            }
            html += '</table>';
            html += `</div>`;
        }
        return html;
    };

    const generarTablaHtml = () => {
        let html = '<table class="cost-table">';
        for (const [key, value] of Object.entries(tablaCostos)) {
            html += `<tr><td>${key}</td><td class="cost-value">${formatCurrency(value)}</td></tr>`;
        }
        html += `<tr class="total-row"><td>Total Costo Vehículo</td><td class="cost-value">${formatCurrency(calculo.totalFinal)}</td></tr>`;
        html += '</table>';
        return html;
    };

    return `
        <div class="section">
            <h2 class="section-title">Capítulo 3: Análisis de Costos del Vehículo</h2>
            <p class="explanation">
                A continuación se presenta la ficha técnica del vehículo considerado y el desglose de sus costos operativos mensuales para este servicio.
            </p>

            ${generarFichaHtml()}

            <div class="card">
                <h3>Desglose de Costos Mensuales del Vehículo</h3>
                ${generarTablaHtml()}
            </div>

            <h2 class="section-title" style="margin-top: 30px; font-size: 20px; border-color: #ccc;">Metodología de Cálculo</h2>
            
            <div class="card">
                <h3>Combustible / GNC</h3>
                <p class="explicacion-detalle">Se calcula multiplicando los kilómetros totales a recorrer en el mes por el costo del combustible por kilómetro, el cual se obtiene del rendimiento del vehículo.</p>
            </div>
            <div class="card">
                <h3>Desgaste de Cubiertas y Aceite</h3>
                <p class="explicacion-detalle">Se calcula el costo por kilómetro de cada componente (costo de reposición / vida útil en km) y se multiplica por los kilómetros totales del servicio.</p>
            </div>
            <div class="card">
                <h3>Depreciación del Vehículo</h3>
                <p class="explicacion-detalle">Se estima la pérdida de valor del vehículo por su uso. Se calcula el costo por kilómetro (valor a nuevo / vida útil en km) y se multiplica por los kilómetros del servicio.</p>
            </div>
            <div class="card">
                <h3>Costos Fijos Prorrateados</h3>
                <p class="explicacion-detalle">Suma los gastos fijos mensuales (seguro, patentes, etc.) y los multiplica por la proporción de uso del vehículo para este servicio. La proporción (${(calculo.proporcionUso * 100).toFixed(0)}%) se obtiene de la cantidad de viajes en relación a una base de 22 días hábiles.</p>
            </div>
        </div>
    `;
}

// ===== NUEVA FUNCIÓN PARA EL CAPÍTULO 4 =====
function generarCapituloRecursoHumano(presupuesto) {
    const { recursoHumano } = presupuesto;
    if (!recursoHumano || !recursoHumano.datos || !recursoHumano.calculo) return '';

    const { datos, calculo } = recursoHumano;
    const esEmpleado = datos.tipoContratacion === 'empleado';

    const modalidad = esEmpleado ? 'Empleado en Relación de Dependencia' : 'Personal Contratado';

    // Objeto con todos los parámetros para la ficha técnica
    const fichaTecnica = {
        'Parámetros Salariales Base': {
            'Sueldo Básico (para cálculo)': formatCurrency(datos.sueldoBasico),
            'Adicional por Actividad': `${datos.adicionalActividadPorc || 0}%`,
            'Adicional Fijo (No Remunerativo)': formatCurrency(datos.adicionalNoRemunerativoFijo)
        },
        'Parámetros de Costos Variables': {
            'Adicional por Km (Remun.)': `${formatCurrency(datos.adicionalKmRemunerativo)} / km`,
            'Viático por Km (No Remun.)': `${formatCurrency(datos.viaticoPorKmNoRemunerativo)} / km`,
            'Adicional Carga/Descarga': `${formatCurrency(datos.adicionalCargaDescargaCadaXkm)} / ${datos.kmPorUnidadDeCarga} km`
        },
        'Parámetros de Costos Indirectos': esEmpleado ? {
            'Porcentaje de Cargas Sociales': `${datos.porcentajeCargasSociales || 0}%`
        } : {
            'Porcentaje de Overhead': `${datos.porcentajeOverheadContratado || 0}%`
        }
    };

    const tablaCostos = {
        'Sueldo Básico (Prorrateado)': calculo.detalle.sueldoProporcional,
        'Adicional por Actividad (Prorrateado)': calculo.detalle.adicionalActividad,
        'Adicional Fijo (No Remunerativo)': calculo.detalle.adicionalFijo,
        'Adicional por Kilometraje': calculo.detalle.adicionalKm,
        'Viáticos por Kilometraje': calculo.detalle.viaticoKm,
        'Adicional por Carga/Descarga': calculo.detalle.adicionalPorKmLote
    };

    // Generador de las tarjetas de la ficha técnica
    const generarFichaHtml = () => {
        let html = '';
        for (const seccion in fichaTecnica) {
            html += `<div class="card"><h3>${seccion}</h3><table class="ficha-tecnica-table">`;
            const items = Object.entries(fichaTecnica[seccion]);
            for (let i = 0; i < items.length; i += 2) {
                html += '<tr>';
                html += `<td class="ficha-key">${items[i][0]}:</td><td class="ficha-value">${items[i][1]}</td>`;
                if (items[i + 1]) {
                    html += `<td class="ficha-key">${items[i + 1][0]}:</td><td class="ficha-value">${items[i + 1][1]}</td>`;
                } else {
                    html += '<td></td><td></td>';
                }
                html += '</tr>';
            }
            html += '</table></div>';
        }
        return html;
    };

    // Generador de la tabla de desglose de costos
    const generarTablaHtml = () => {
        let html = '<table class="cost-table">';
        for (const [key, value] of Object.entries(tablaCostos)) {
            html += `<tr><td>${key}</td><td class="cost-value">${formatCurrency(value)}</td></tr>`;
        }
        html += `<tr class="subtotal-row"><td>Subtotal</td><td class="cost-value">${formatCurrency(calculo.detalle.subtotalBruto)}</td></tr>`;

        const costoIndirectoLabel = esEmpleado ? 'Cargas Sociales y Aportes' : 'Costos de Contratación / Overhead';
        const costoIndirectoPorc = esEmpleado ? datos.porcentajeCargasSociales : datos.porcentajeOverheadContratado;
        const costoIndirectoValor = calculo.detalle.cargasSociales || (calculo.detalle.subtotalBruto * (costoIndirectoPorc / 100));
        html += `<tr><td>${costoIndirectoLabel} (${costoIndirectoPorc}%)</td><td class="cost-value">${formatCurrency(costoIndirectoValor)}</td></tr>`;

        html += `<tr class="total-row"><td>Total Costo Recurso Humano</td><td class="cost-value">${formatCurrency(calculo.totalFinal)}</td></tr>`;
        html += '</table>';
        return html;
    };

    return `
        <div class="section">
            <h2 class="section-title">Capítulo 4: Análisis de Costos del Recurso Humano</h2>
            <p class="explanation">
                Detalle de los costos asociados al personal asignado, diferenciando conceptos fijos (prorrateados según el uso) y variables (basados en la performance del servicio).
            </p>

            <div class="card">
                <h3>Identificación del Colaborador</h3>
                <table class="ficha-tecnica-table">
                    <tr>
                        <td class="ficha-key">Nombre:</td><td class="ficha-value">${datos.nombre || 'N/A'}</td>
                        <td class="ficha-key">DNI:</td><td class="ficha-value">${datos.dni || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td class="ficha-key">Modalidad:</td><td class="ficha-value" colspan="3">${modalidad}</td>
                    </tr>
                </table>
            </div>

            ${generarFichaHtml()}

            <div class="card">
                <h3>Desglose de Costos Mensuales del Colaborador</h3>
                ${generarTablaHtml()}
            </div>

            <h2 class="section-title" style="margin-top: 30px; font-size: 20px; border-color: #ccc;">Metodología de Cálculo</h2>
            
            <div class="card">
                <h3>Sueldo y Adicionales Fijos (Prorrateo)</h3>
                <p class="explicacion-detalle">Se asignan en base a la proporción de uso del <strong>${(calculo.proporcionUso * 100).toFixed(0)}%</strong>, calculada sobre una jornada estándar de 22 días hábiles.</p>
            </div>
            <div class="card">
                <h3>Adicionales por Performance</h3>
                <p class="explicacion-detalle">Conceptos variables que se calculan multiplicando el valor definido (por km, por lote, etc.) por la cantidad total de kilómetros recorridos para este servicio.</p>
            </div>
            <div class="card">
                <h3>${esEmpleado ? 'Cargas Sociales y Aportes' : 'Costos de Contratación'}</h3>
                <p class="explicacion-detalle">${esEmpleado
            ? 'Corresponde a los aportes y contribuciones patronales obligatorios por ley, calculados como un porcentaje sobre los conceptos remunerativos del salario.'
            : 'Representa una estimación de costos asociados a la modalidad de contratación (monotributo, seguros, etc.), calculado como un porcentaje sobre el total de los conceptos facturables.'}
                </p>
            </div>
        </div>
    `;
}

// ===== NUEVA FUNCIÓN PARA EL CAPÍTULO 5 =====
function generarCapituloFinal(presupuesto) {
    const { resumenCostos, configuracion, vehiculo, recursoHumano } = presupuesto;
    const esViajeRegular = presupuesto.frecuencia?.tipo === 'mensual';
    const totalLabel = esViajeRegular ? 'Total Final Mensual (sin IVA)' : 'Total del Servicio (sin IVA)';
    if (!resumenCostos || !configuracion) return '';

    // --- 1. Preparamos los datos para la tabla de resumen ---
    const tablaResumen = {
        'Costo Total del Vehículo (Cap. 3)': resumenCostos.totalVehiculo,
        'Costo Total del Recurso Humano (Cap. 4)': resumenCostos.totalRecurso,
        'Costos Adicionales de Ruta (Peajes)': resumenCostos.totalPeajes,
        'Costos Fijos de Operación (Admin. y Otros)': (resumenCostos.totalAdministrativo || 0) + (resumenCostos.otrosCostos || 0),
    };
    if (resumenCostos.costoAdicionalPeligrosa > 0) {
        tablaResumen['Costo Adicional por Carga Peligrosa'] = resumenCostos.costoAdicionalPeligrosa;
    }

    // --- 2. Preparamos los datos para el gráfico detallado ---
    const totalOperativo = resumenCostos.totalOperativo;
    const itemsGrafico = [
        // Subrubros del Vehículo
        { label: 'Combustible', value: vehiculo.calculo.detalle.combustible, color: '#0D47A1' },
        { label: 'Desgaste (Cubiertas, Aceite)', value: vehiculo.calculo.detalle.cubiertas + vehiculo.calculo.detalle.aceite, color: '#0D47A1' },
        { label: 'Depreciación Vehículo', value: vehiculo.calculo.detalle.depreciacion, color: '#0D47A1' },
        { label: 'Costos Fijos Vehículo (Prorr.)', value: vehiculo.calculo.detalle.costosFijosProrrateados, color: '#0D47A1' },
        // Subrubros de Recurso Humano
        { label: 'Sueldo y Adicionales Fijos (Prorr.)', value: recursoHumano.calculo.detalle.sueldoProporcional + recursoHumano.calculo.detalle.adicionalActividad + recursoHumano.calculo.detalle.adicionalFijo, color: '#1976D2' },
        { label: 'Adicionales Variables (Km, Carga)', value: recursoHumano.calculo.detalle.adicionalKm + recursoHumano.calculo.detalle.viaticoKm + recursoHumano.calculo.detalle.adicionalPorKmLote, color: '#1976D2' },
        { label: 'Cargas Sociales / Overhead', value: recursoHumano.calculo.detalle.cargasSociales, color: '#1976D2' },
        // Otros Costos
        { label: 'Peajes y Otros', value: resumenCostos.totalPeajes + resumenCostos.otrosCostos, color: '#64B5F6' },
        { label: 'Costo Administrativo', value: resumenCostos.totalAdministrativo, color: '#64B5F6' },
        // Margen
        { label: 'Margen de Beneficio', value: resumenCostos.ganancia, color: '#FFC107' }
    ].filter(item => item.value > 0);


    // --- 3. Generamos el HTML ---
    return `
        <div class="section">
            <h2 class="section-title">Capítulo 5: Propuesta Económica Final</h2>
            <p class="explanation">
                A continuación, se presenta el resumen consolidado de todos los costos operativos, junto con la propuesta económica final para la prestación del servicio.
            </p>

            <div class="card">
                <h3>Resumen Económico</h3>
                <table class="cost-table">
                    ${Object.entries(tablaResumen).map(([key, value]) => `<tr><td>${key}</td><td class="cost-value">${formatCurrency(value)}</td></tr>`).join('')}
                    <tr class="subtotal-row">
                        <td>Costo Operativo Total</td>
                        <td class="cost-value">${formatCurrency(resumenCostos.totalOperativo)}</td>
                    </tr>
                    <tr>
                        <td>Margen de Beneficio (${configuracion.porcentajeGanancia}%)</td>
                        <td class="cost-value">${formatCurrency(resumenCostos.ganancia)}</td>
                    </tr>
<tr class="total-row final-total">
    <td>${totalLabel}</td>
    <td class="cost-value">${formatCurrency(resumenCostos.totalFinal)}</td>
</tr>
                </table>
            </div>

            <div class="card">
                <h3>Composición del Costo y Margen</h3>
                <div class="composition-graph">
                    ${itemsGrafico.map(item => {
        const porcentaje = totalOperativo > 0 ? (item.value / (totalOperativo + resumenCostos.ganancia)) * 100 : 0;
        return `
                        <div class="graph-row">
                            <div class="graph-label">${item.label}</div>
                            <div class="graph-bar-container">
                                <div class="bar" style="width: ${porcentaje.toFixed(2)}%; background-color: ${item.color};"></div>
                            </div>
                            <div class="graph-value">${formatCurrency(item.value)} (${porcentaje.toFixed(1)}%)</div>
                        </div>
                        `
    }).join('')}
                </div>
            </div>

            ${configuracion.observaciones ? `
            <div class="card observations-card">
                <h4>Observaciones Finales</h4>
                <p>${configuracion.observaciones}</p>
            </div>` : ''}

            <div class="closing-section">
                <p><strong>Validez de la propuesta:</strong> 15 días a partir de la fecha de emisión. Los valores expresados no incluyen IVA.</p>
                <div class="signature-lines">
                    <div class="signature-box">
                        <p>_________________________</p>
                        <p>Por la Empresa</p>
                    </div>
                    <div class="signature-box">
                        <p>_________________________</p>
                        <p>Por el Cliente</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function getHtmlContent(presupuesto) {
    const { puntosEntrega, totalKilometros, duracionMin, detallesCarga } = presupuesto;
    const apiKey = process.env.Maps_API_KEY;
    const fechaValidez = format(new Date(new Date().setDate(new Date().getDate() + 15)), 'dd/MM/yyyy');

    const mapUrl = getStaticMapUrl(puntosEntrega, apiKey);
    const googleMapsUrl = generarUrlGoogleMaps(puntosEntrega);
    const qrCodeDataUrl = await generarQrCodeDataUrl(googleMapsUrl);
    const tipoDeCarga = detallesCarga && detallesCarga.tipo ? formatKey(detallesCarga.tipo) : 'No especificado';
    const capituloFrecuenciaHtml = generarCapituloFrecuencia(presupuesto);
    const capituloVehiculoHtml = generarCapituloVehiculo(presupuesto);
    const capituloRecursoHumanoHtml = generarCapituloRecursoHumano(presupuesto);
    const capituloFinalHtml = generarCapituloFinal(presupuesto);

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Propuesta de Servicio Logístico</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
            :root {
                --font-family: 'Montserrat', sans-serif;
                --color-primary: #0D47A1;
                --color-secondary: #1976D2;
                --color-accent: #FFC107;
                --color-text: #212529;
                --color-text-light: #6c757d;
                --color-bg-light: #f8f9fa;
                --color-border: #dee2e6;
            }
            html { -webkit-print-color-adjust: exact; }
            body {
                font-family: var(--font-family);
                color: var(--color-text);
                margin: 0;
                background-color: #fff;
            }

            .cover-page {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 95vh;
                text-align: center;
            }
            .cover-page h1 {
                font-size: 32px;
                color: var(--color-primary);
                margin-bottom: 5px;
            }
            .cover-page p {
                font-size: 16px;
                color: var(--color-text-light);
                margin-top: 0;
            }

            .main-content {
                page-break-before: always;
                padding-top: 40px; /* 🔧 Previene superposición con header */
            }

            .card {
                background: white;
                border-radius: 8px;
                padding: 20px;
                border: 1px solid var(--color-border);
            }

            .section-title, .card, .info-table {
                page-break-inside: avoid;
                margin-top: 25px;
            }
            .main-content > .section-title:first-child {
                margin-top: 0;
            }

            .section-title {
                font-size: 22px;
                font-weight: 700;
                color: var(--color-primary);
                border-bottom: 2px solid var(--color-accent);
                padding-bottom: 10px;
            }

            .explanation {
                font-size: 14px;
                color: var(--color-text-light);
                margin-bottom: 0;
            }

            .info-table {
                width: 100%;
                border-spacing: 0;
                border-collapse: collapse;
            }
            .info-table > tbody > tr {
                display: flex;
                gap: 20px; /* 🔧 Espacio horizontal entre columnas */
            }
            .info-table td {
                vertical-align: top;
                padding: 0;
            }
            .info-table .left-column, .info-table .right-column {
                display: flex;
                flex-direction: column;
            }
            .info-table .summary-card {
                flex-grow: 1;
            }
            .left-column {
                width: 65%;
            }
            .right-column {
                width: 35%;
            }

            .summary-card {
                background-color: var(--color-bg-light);
                border-radius: 8px;
                padding: 15px;
            }
            .summary-card h4 {
                margin: 0 0 8px 0;
                color: var(--color-secondary);
                font-size: 15px;
                border-bottom: 1px solid var(--color-border);
                padding-bottom: 8px;
            }
            .summary-card p {
                margin: 0 0 8px 0;
                font-size: 14px;
            }

            .qr-card {
                text-align: center;
            }
            .qr-card img {
                max-width: 150px;
                margin: 10px auto;
                display: block;
            }
            .qr-caption {
                font-size: 12px !important;
                color: var(--color-text-light);
                margin-top: 10px !important;
            }
            .map-image {
                width: 100%;
                border-radius: 4px;
                border: 1px solid var(--color-border);
            }

            .address-list {
                list-style-type: none;
                margin: 0;
                padding: 0;
            }
            .address-list li {
                background-color: var(--color-bg-light);
                padding: 10px 15px;
                border-radius: 6px;
                margin-bottom: 8px;
                font-size: 13px;
                display: flex;
                align-items: center;
            }
            .address-list li:last-child {
                margin-bottom: 0;
            }
            .address-list .label {
                flex-shrink: 0;
                background-color: var(--color-accent);
                color: var(--color-text);
                border-radius: 50%;
                width: 28px;
                height: 28px;
                text-align: center;
                line-height: 28px;
                font-weight: 700;
                margin-right: 15px;
            }

            /* === ESTILOS PARA CAPÍTULO 2 === */
.week-calendar {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
    margin-top: 10px;
}
.week-calendar th, .week-calendar td {
    padding: 10px 5px;
    border: 1px solid var(--color-border);
    font-size: 13px;
}
.week-calendar th {
    background-color: var(--color-bg-light);
    font-weight: 600;
    color: var(--color-text-light);
}
.week-calendar td.selected {
    background-color: var(--color-accent);
    color: var(--color-text);
    font-weight: 700;
    font-size: 16px;
}

.observations-card {
    background-color: #fffbeb; /* Un amarillo muy claro */
    border-left: 4px solid #fbbd23;
}
.observations-card h4 {
    color: #b45309; /* Un marrón/naranja oscuro */
}
.observations-card p {
    font-style: italic;
    color: var(--color-text-light);
}
    /* === ESTILOS PARA CAPÍTULO 3 === */
.ficha-tecnica-table {
    width: 100%;
    margin-top: 10px;
}
.ficha-tecnica-table td {
    padding: 5px;
    font-size: 13px;
    width: 25%;
}
.ficha-seccion-titulo {
    font-size: 14px;
    color: var(--color-secondary);
    margin-top: 10px;
    margin-bottom: 5px;
    padding-bottom: 3px;
    border-bottom: 1px solid var(--color-border);
}
.ficha-key {
    font-weight: 600;
    color: var(--color-text-light);
}

.cost-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}
.cost-table td {
    padding: 10px 8px;
    border-bottom: 1px solid var(--color-border);
    font-size: 14px;
}
.cost-table .cost-value {
    text-align: right;
    font-weight: 500;
}
.cost-table .total-row td {
    font-weight: 700;
    font-size: 15px;
    color: var(--color-primary);
    background-color: var(--color-bg-light);
}

.explicacion-lista {
    list-style-type: none;
    padding-left: 0;
    font-size: 13px;
    color: var(--color-text-light);
}
.explicacion-lista li {
    margin-bottom: 10px;
}
.explicacion-lista li:last-child {
    margin-bottom: 0;
}
.card > h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: var(--color-secondary);
    font-size: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--color-border);
}

.explicacion-detalle {
    font-size: 13px;
    color: var(--color-text-light);
    line-height: 1.6;
}
    .cost-table .subtotal-row td {
    font-weight: 600;
    border-top: 1px solid var(--color-text-light);
}
    /* === ESTILOS PARA CAPÍTULO 5 === */
.cost-table .final-total td {
    font-size: 18px;
    padding: 12px 8px;
    background-color: var(--color-primary);
    color: white;
}
.composition-graph {
    margin-top: 15px;
}
.graph-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 12px;
}
.graph-label {
    width: 35%;
    color: var(--color-text-light);
}
.graph-bar-container {
    width: 40%;
    background-color: var(--color-bg-light);
    border-radius: 4px;
    height: 16px;
}
.bar {
    height: 100%;
    border-radius: 4px;
}
.graph-value {
    width: 25%;
    text-align: right;
    font-weight: 600;
    padding-left: 10px;
}
.closing-section {
    margin-top: 40px;
    text-align: center;
    font-size: 12px;
    color: var(--color-text-light);
    page-break-before: avoid; /* Evita que esta sección se corte */
}
.signature-lines {
    display: flex;
    justify-content: space-around;
    margin-top: 80px;
}
.signature-box p {
    margin: 0;
}
        </style>
    </head>
    <body>
        <div class="cover-page">
            <h1>Propuesta de Servicio Logístico</h1>
            <p>Presupuesto N° ${presupuesto._id} • Válido hasta ${fechaValidez}</p>
        </div>

        <div class="main-content">
            <h2 class="section-title">Capítulo 1: Análisis de Ruta y Operativa Inicial</h2>
            <p class="explanation">
                Esta sección detalla el recorrido geográfico, los puntos de entrega y las características principales de la ruta propuesta.
            </p>
            <div class="card map-card">
                <h3>Mapa de la Ruta</h3>
                ${mapUrl ? `<img src="${mapUrl}" alt="Mapa de la ruta" class="map-image">` : '<p>No se pudo generar el mapa.</p>'}
            </div>
            <table class="info-table">
                <tbody>
                    <tr>
                        <td class="left-column">
                            <div class="summary-card">
                                <h4>Resumen de la Operación</h4>
                                <p><strong>Distancia Total:</strong> ${parseFloat(totalKilometros || 0).toFixed(2)} km</p>
                                <p><strong>Tiempo Estimado:</strong> ${duracionMin || 0} min</p>
                                <p><strong>Total de Paradas:</strong> ${puntosEntrega?.length || 0}</p>
                                <br>
                                <h4>Detalles de la Carga</h4>
                                <p><strong>Tipo:</strong> ${tipoDeCarga}</p>
                            </div>
                        </td>
                        <td class="right-column">
                            <div class="summary-card qr-card">
                                <h4>Ruta en tu Celular</h4>
                                ${qrCodeDataUrl ? `<img src="${qrCodeDataUrl}" alt="Código QR"><p class="qr-caption">Escanee para abrir en Google Maps</p>` : '<p>No se pudo generar el código QR.</p>'}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="card itinerary-card">
                <h3>Itinerario de Entrega</h3>
                <ol class="address-list">
                    ${puntosEntrega && puntosEntrega.length > 0
            ? puntosEntrega.map((p, index) => `<li><span class="label">${String.fromCharCode(65 + index)}</span>${p.nombre}</li>`).join('')
            : '<li>No hay puntos de entrega definidos.</li>'}
                </ol>
            </div>

        </div>
        ${capituloFrecuenciaHtml} 
        ${capituloVehiculoHtml}
        ${capituloRecursoHumanoHtml}
        ${capituloFinalHtml}

    </body>
    </html>`;
}

export async function generarPresupuestoPDF_Avanzado(presupuesto, stream) {
  let browser; // Declaramos la variable fuera del try para que sea accesible en el finally
  try {
    // Lógica inteligente: ¿estamos en producción o en desarrollo?
    if (process.env.BROWSERLESS_URL) {
      // MODO PRODUCCIÓN: Conectar a Browserless si la variable existe
      console.log('🔌 Modo Producción: Conectando a Browserless.io...');
      browser = await puppeteer.connect({
        browserWSEndpoint: process.env.BROWSERLESS_URL,
        ignoreHTTPSErrors: true
      });
      console.log('✅ Conexión a Browserless exitosa.');
    } else {
      // MODO DESARROLLO: Lanzar Puppeteer localmente si la variable NO existe
      console.log('🖥️ Modo Desarrollo: Lanzando Puppeteer local...');
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      console.log('✅ Puppeteer local lanzado.');
    }

    const page = await browser.newPage();

    // La función getHtmlContent debe estar definida más arriba en tu archivo, como ya la tienes.
    const htmlContent = await getHtmlContent(presupuesto); 

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      margin: { top: '0.5in', bottom: '0.5in', left: '0.3in', right: '0.3in' }
    });

    console.log('📄 PDF generado.');
    stream.write(pdfBuffer);

  } catch (error) {
    console.error("❌ Error durante la generación del PDF:", error);
    stream.emit('error', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Navegador cerrado.');
    }
    stream.end();
  }
}