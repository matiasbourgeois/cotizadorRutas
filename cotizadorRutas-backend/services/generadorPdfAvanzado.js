import puppeteer from 'puppeteer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// --- FUNCIONES AUXILIARES ---
const formatCurrency = (num) => `$ ${Math.round(num || 0).toLocaleString('es-AR')}`;
const formatKey = (key) => {
    if (!key) return '';
    const result = key.replace(/([A-Z])/g, ' $1').replace(/Porc$/, ' (%)');
    return result.charAt(0).toUpperCase() + result.slice(1);
};
const getStaticMapUrl = (puntos, apiKey) => {
    if (!puntos || puntos.length === 0) return '';
    const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap?';
    const size = 'size=640x400';
    const maptype = 'maptype=roadmap';
    const markers = puntos.map((p, index) => 
        `markers=color:0xffc107|label:${String.fromCharCode(65 + index)}|${p.lat},${p.lng}`
    ).join('&');
    const path = `path=color:0x0D47A1|weight:5|${puntos.map(p => `${p.lat},${p.lng}`).join('|')}`;
    return `${baseUrl}${size}&${maptype}&${markers}&${path}&key=${apiKey}`;
};

// --- PLANTILLA HTML DEL PDF ---
function getHtmlContent(presupuesto) {
    const { puntosEntrega, totalKilometros, resumenCostos, vehiculo, recursoHumano, configuracion } = presupuesto;
    const apiKey = process.env.VITE_Maps_API_KEY;
    const mapUrl = getStaticMapUrl(puntosEntrega, apiKey);
    const costData = {
        labels: ['Vehículo', 'Recurso Humano', 'Peajes', 'Administrativo', 'Otros'],
        data: [
            resumenCostos.totalVehiculo,
            resumenCostos.totalRecurso,
            resumenCostos.totalPeajes,
            resumenCostos.totalAdministrativo,
            resumenCostos.otrosCostos
        ].map(v => v || 0)
    };
    // Reemplaza esta URL con la URL de tu logo. Sube tu logo a un sitio como https://imgur.com/ y pega el link directo.
    const logoUrl = 'https://i.imgur.com/Sg38eA9.png'; // Placeholder de un logo de camión

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Propuesta de Servicio Logístico</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
            body { font-family: var(--font-family); color: var(--color-text); margin: 0; background-color: #fff; }
            
            .page { padding: 1in; }
            .header-spacer { height: 60px; }
            .footer-spacer { height: 60px; }
            
            .card {
                background: white;
                border-top: 5px solid var(--color-accent);
                border-radius: 8px;
                padding: 30px;
                margin-bottom: 35px;
                page-break-inside: avoid; /* Intenta evitar que la tarjeta se corte */
                box-shadow: 0 10px 25px -5px rgba(0,0,0,0.07);
                border: 1px solid var(--color-border);
            }
            
            .cover-page { text-align: center; }
            .cover-page h1 { font-size: 32px; color: var(--color-primary); margin-bottom: 5px; }
            .cover-page p { font-size: 16px; color: var(--color-text-light); margin-top: 0; }
            
            .section-title { font-size: 22px; font-weight: 700; color: var(--color-primary); margin-bottom: 25px; }
            .explanation { font-size: 14px; color: var(--color-text-light); margin-bottom: 25px; max-width: 90%; }
            
            .map-container { margin: 25px 0; }
            .map-container img { width: 100%; border-radius: 8px; }
            
            .info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 25px; }
            .info-box { background-color: var(--color-bg-light); border-radius: 8px; padding: 20px; text-align: center; }
            .info-box h3 { margin: 0 0 8px 0; color: var(--color-secondary); font-size: 14px; font-weight: 500; text-transform: uppercase; }
            .info-box p { margin: 0; font-size: 24px; font-weight: 700; color: var(--color-primary); }
            
            .address-list ol { list-style-type: none; padding: 0; }
            .address-list li { background-color: var(--color-bg-light); padding: 15px; border-radius: 6px; margin-bottom: 10px; font-size: 14px; display: flex; align-items: center; }
            .address-list .label { flex-shrink: 0; background-color: var(--color-accent); color: var(--color-primary); border-radius: 50%; width: 30px; height: 30px; text-align: center; line-height: 30px; font-weight: 700; margin-right: 15px; }
            
            .financial-summary-grid { display: grid; grid-template-columns: 320px 1fr; gap: 40px; align-items: center; }
            .chart-container { width: 320px; height: 320px; }

            table { width: 100%; border-collapse: collapse; font-size: 14px; }
            th, td { text-align: left; padding: 14px; }
            tbody tr:nth-child(odd) { background-color: var(--color-bg-light); }
            th { font-weight: 600; color: var(--color-text); border-bottom: 2px solid var(--color-border); }
            td:last-child { text-align: right; font-weight: 600; white-space: nowrap; }
            tfoot tr { background-color: #e3f2fd; color: var(--color-primary); font-weight: 700; }
            tfoot th, tfoot td { font-size: 16px; padding: 16px; }
            
            .breakdown-card { margin-top: 30px; }
            .breakdown-card h3 { font-size: 18px; color: var(--color-secondary); margin-bottom: 10px; }

            .final-quote-card { background: linear-gradient(135deg, var(--color-secondary), var(--color-primary)); color: white; padding: 35px; border-radius: 12px; text-align: center; }
            .final-quote-card h3 { margin: 0 0 10px 0; font-size: 22px; font-weight: 500; opacity: 0.9; }
            .final-quote-card p { margin: 0; font-size: 38px; font-weight: 700; }
        </style>
    </head>
    <body>
        <div class="header-spacer"></div>

        <div class="page">
            <div class="cover-page">
                <img src="${logoUrl}" alt="Logo" style="height: 60px; margin-bottom: 20px;">
                <h1>Propuesta de Servicio Logístico</h1>
                <p>Presupuesto N° ${presupuesto._id} &bull; Válido hasta ${format(new Date(new Date().setDate(new Date().getDate() + 15)), 'dd/MM/yyyy')}</p>
            </div>
            
            <div class="card">
                <h2 class="section-title">1. Resumen de la Ruta</h2>
                <div class="map-container"><img src="${mapUrl}" alt="Mapa de la ruta"></div>
                <div class="info-grid">
                    <div class="info-box"><h3>Distancia / Viaje</h3><p>${parseFloat(totalKilometros).toFixed(2)} km</p></div>
                    <div class="info-box"><h3>Puntos de Entrega</h3><p>${puntosEntrega.length}</p></div>
                    <div class="info-box"><h3>Frecuencia</h3><p>${formatKey(presupuesto.frecuencia.tipo)}</p></div>
                </div>
            </div>

            <div class="card address-list">
                <h2 class="section-title">Itinerario de Entrega</h2>
                <ol>${puntosEntrega.map((p, index) => `<li><span class="label">${String.fromCharCode(65 + index)}</span>${p.nombre}</li>`).join('')}</ol>
            </div>

            <div class="card">
                <h2 class="section-title">2. Resumen Financiero</h2>
                <p class="explanation">A continuación, se presenta la composición de los costos operativos, permitiendo visualizar el impacto de cada área en el presupuesto total.</p>
                <div class="financial-summary-grid">
                    <div class="chart-container"><canvas id="costChart"></canvas></div>
                    <div>
                        <table>
                            <thead><tr><th>Concepto</th><th>Monto Mensual</th></tr></thead>
                            <tbody>
                                <tr><td>Costo Vehicular</td><td>${formatCurrency(resumenCostos.totalVehiculo)}</td></tr>
                                <tr><td>Recurso Humano</td><td>${formatCurrency(resumenCostos.totalRecurso)}</td></tr>
                                <tr><td>Peajes y Adicionales</td><td>${formatCurrency(resumenCostos.totalPeajes)}</td></tr>
                                <tr><td>Costos Administrativos</td><td>${formatCurrency(resumenCostos.totalAdministrativo)}</td></tr>
                                <tr><td>Otros Costos</td><td>${formatCurrency(resumenCostos.otrosCostos)}</td></tr>
                            </tbody>
                            <tfoot><tr><th>Subtotal Operativo</th><td>${formatCurrency(resumenCostos.totalOperativo)}</td></tr></tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <div class="card">
                <h2 class="section-title">3. Desglose Detallado de Costos</h2>
                <p class="explanation">Para una total transparencia, detallamos a continuación los cálculos principales que componen cada categoría de costo.</p>
                <div class="breakdown-card">
                    <h3>Costos del Vehículo</h3>
                    <table>
                        <thead><tr><th>Componente</th><th>Costo Estimado</th></tr></thead>
                        <tbody>${Object.entries(vehiculo.calculo.detalle).map(([key, value]) => `<tr><td>${formatKey(key)}</td><td>${formatCurrency(value)}</td></tr>`).join('')}</tbody>
                        <tfoot><tr><th>Total Vehículo</th><td>${formatCurrency(vehiculo.calculo.totalFinal)}</td></tr></tfoot>
                    </table>
                </div>
                <div class="breakdown-card">
                    <h3>Costos de Recurso Humano</h3>
                     <table>
                        <thead><tr><th>Componente</th><th>Costo Estimado</th></tr></thead>
                        <tbody>${Object.entries(recursoHumano.calculo.detalle).map(([key, value]) => `<tr><td>${formatKey(key)}</td><td>${typeof value === 'number' ? formatCurrency(value) : value}</td></tr>`).join('')}</tbody>
                        <tfoot><tr><th>Total Recurso Humano</th><td>${formatCurrency(recursoHumano.calculo.totalFinal)}</td></tr></tfoot>
                    </table>
                </div>
            </div>
            
            <div class="card">
                <h2 class="section-title">4. Propuesta Económica Final</h2>
                <p class="explanation">El valor final se compone del costo operativo más nuestro margen de ganancia, que nos permite mantener la calidad del servicio, reinvertir en nuestra flota y garantizar la sostenibilidad de nuestras operaciones.</p>
                <table>
                    <tbody>
                        <tr><td>Subtotal Operativo Total</td><td>${formatCurrency(resumenCostos.totalOperativo)}</td></tr>
                        <tr><td>Ganancia (${configuracion.porcentajeGanancia}%)</td><td>${formatCurrency(resumenCostos.ganancia)}</td></tr>
                    </tbody>
                 </table>
                 <br/><br/>
                 <div class="final-quote-card">
                     <h3>Total Final del Servicio Mensual</h3>
                     <p>${formatCurrency(resumenCostos.totalFinal)}</p>
                 </div>
            </div>

        </div>
        <div class="footer-spacer"></div>
        <script>
            new Chart(document.getElementById('costChart'), {
                type: 'doughnut',
                data: {
                    labels: ${JSON.stringify(costData.labels)},
                    datasets: [{
                        data: ${JSON.stringify(costData.data)},
                        backgroundColor: ['#1976D2', '#0D47A1', '#FFC107', '#6c757d', '#adb5bd'],
                        borderColor: '#fff',
                        borderWidth: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 0 },
                    plugins: { 
                        legend: { display: true, position: 'right', labels: { font: { size: 14, family: "'Montserrat', sans-serif" }, boxWidth: 20, padding: 20 } } 
                    }
                }
            });
        </script>
    </body>
    </html>
    `;
}

// --- FUNCIÓN PRINCIPAL DE GENERACIÓN ---
export async function generarPresupuestoPDF_Avanzado(presupuesto, stream) {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // URL del logo para el encabezado
    const logoUrl = 'https://i.imgur.com/Sg38eA9.png'; // Placeholder - Reemplazar con tu logo

    const htmlContent = getHtmlContent(presupuesto);
    const headerTemplate = `
        <div style="font-family: 'Montserrat', sans-serif; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0 1in; height: 60px; border-bottom: 1px solid #dee2e6;">
            <img src="${logoUrl}" style="height: 35px;" />
            <div style="font-size: 12px; color: #6c757d;">Propuesta de Servicio Logístico</div>
        </div>`;
    const footerTemplate = `
        <div style="font-family: 'Montserrat', sans-serif; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0 1in; height: 60px; border-top: 1px solid #dee2e6; font-size: 10px; color: #6c757d;">
            <div>www.tuempresa.com</div>
            <div>Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>
        </div>`;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: headerTemplate,
        footerTemplate: footerTemplate,
        margin: { top: '1in', bottom: '1in' } // Márgenes para dejar espacio al header y footer
    });

    await browser.close();

    stream.write(pdfBuffer);
    stream.end();
}