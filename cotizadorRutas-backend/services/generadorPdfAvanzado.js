// ruta: cotizadorRutas-backend/services/generadorPdfAvanzado.js

import puppeteer from 'puppeteer';
import { format } from 'date-fns';
import QRCode from 'qrcode';

// --- FUNCIONES AUXILIARES ---
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
    // ✅ URL CORREGIDA: Apunta al servicio de direcciones de Google Maps.
    const baseUrl = 'https://www.google.com/maps/dir/';
    const origin = `${puntos[0].lat},${puntos[0].lng}`;
    const destination = `${puntos[puntos.length - 1].lat},${puntos[puntos.length - 1].lng}`;
    const waypoints = puntos.slice(1, -1).map(p => `${p.lat},${p.lng}`).join('|');
    
    // Construimos la URL con los parámetros adecuados
    const params = new URLSearchParams({
        api: '1',
        origin: origin,
        destination: destination,
        travelmode: 'driving'
    });

    if (waypoints) {
        params.append('waypoints', waypoints);
    }

    return `${baseUrl}?${params.toString()}`;
};
const generarQrCodeDataUrl = async (url) => {
    if (!url) return '';
    try {
        return await QRCode.toDataURL(url, { errorCorrectionLevel: 'H', margin: 2 });
    } catch (err) {
        console.error('Error generando el código QR:', err);
        return '';
    }
};

async function generarHtmlSeccionRuta(presupuesto) {
    const { puntosEntrega, totalKilometros, duracionMin, detallesCarga } = presupuesto;
    const apiKey = process.env.Maps_API_KEY; // <-- CORRECCIÓN APLICADA
    
    const mapUrl = getStaticMapUrl(puntosEntrega, apiKey);
    const googleMapsUrl = generarUrlGoogleMaps(puntosEntrega);
    const qrCodeDataUrl = await generarQrCodeDataUrl(googleMapsUrl);
    const tipoDeCarga = detallesCarga && detallesCarga.tipo ? formatKey(detallesCarga.tipo) : 'No especificado';

    return `
        <div class="page-break"></div>
        <h2 class="section-title">Capítulo 1: Análisis de Ruta y Operativa Inicial</h2>
        <p class="explanation">
            Esta sección detalla el recorrido geográfico, los puntos de entrega y las características
            principales de la ruta propuesta. Esta información es la base para todos los cálculos
            posteriores de costos y asignación de recursos.
        </p>
        <table class="layout-table">
            <tr>
                <td class="left-column">
                    <div class="card map-card">
                        <h3>Mapa de la Ruta</h3>
                        ${mapUrl ? `<img src="${mapUrl}" alt="Mapa de la ruta" class="map-image">` : '<p>No se pudo generar el mapa. Verifique la API Key.</p>'}
                    </div>
                    <div class="card">
                        <h3>Itinerario de Entrega</h3>
                        <ol class="address-list">
                            ${puntosEntrega && puntosEntrega.length > 0 ? puntosEntrega.map((p, index) => `<li><span class="label">${String.fromCharCode(65 + index)}</span>${p.nombre}</li>`).join('') : '<li>No hay puntos de entrega definidos.</li>'}
                        </ol>
                    </div>
                </td>
                <td class="right-column">
                    <div class="summary-card">
                        <h4>Resumen del Viaje</h4>
                        <p><strong>Distancia Total:</strong> ${parseFloat(totalKilometros || 0).toFixed(2)} km</p>
                        <p><strong>Tiempo Estimado:</strong> ${duracionMin || 0} min</p>
                        <p><strong>Total de Paradas:</strong> ${puntosEntrega?.length || 0}</p>
                    </div>
                    <div class="summary-card">
                        <h4>Detalles de la Carga</h4>
                        <p><strong>Tipo:</strong> ${tipoDeCarga}</p>
                    </div>
                    ${qrCodeDataUrl ? `
                    <div class="summary-card qr-card">
                        <h4>Ruta en tu Celular</h4>
                        <img src="${qrCodeDataUrl}" alt="Código QR para Google Maps">
                        <p class="qr-caption">Escanee para abrir en Google Maps</p>
                    </div>` : ''}
                </td>
            </tr>
        </table>
    `;
}

async function getHtmlContent(presupuesto, seccion = 'todo') {
    const logoUrl = 'https://i.imgur.com/sC5w45G.png'; // Logo funcional
    const fechaValidez = format(new Date(new Date().setDate(new Date().getDate() + 15)), 'dd/MM/yyyy');

    let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Propuesta de Servicio Logístico</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
            :root { --font-family: 'Montserrat', sans-serif; --color-primary: #0D47A1; --color-secondary: #1976D2; --color-accent: #FFC107; --color-text: #212529; --color-text-light: #6c757d; --color-bg-light: #f8f9fa; --color-border: #dee2e6; }
            html { -webkit-print-color-adjust: exact; }
            body { font-family: var(--font-family); color: var(--color-text); margin: 0; background-color: #fff; }
            .page-container { padding: 0.5in; }
            .page-break { page-break-before: always; }
            .cover-page { text-align: center; height: 90vh; display: flex; flex-direction: column; justify-content: center; align-items: center; }
            .cover-page img { height: 60px; margin-bottom: 20px; }
            .cover-page h1 { font-size: 32px; color: var(--color-primary); margin-bottom: 5px; }
            .cover-page p { font-size: 16px; color: var(--color-text-light); margin-top: 0; }
            .card { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; border: 1px solid var(--color-border); }
            .map-card { padding: 15px; }
            .section-title { font-size: 22px; font-weight: 700; color: var(--color-primary); margin-bottom: 10px; border-bottom: 2px solid var(--color-accent); padding-bottom: 10px; }
            .explanation { font-size: 14px; color: var(--color-text-light); margin-bottom: 25px; max-width: 100%; }
            .layout-table { width: 100%; border-spacing: 0; border-collapse: collapse; }
            .left-column { width: 65%; vertical-align: top; padding-right: 20px; }
            .right-column { width: 35%; vertical-align: top; }
            .summary-card { background-color: var(--color-bg-light); border-radius: 8px; padding: 15px; margin-bottom: 20px; }
            .summary-card:last-child { margin-bottom: 0; }
            .summary-card h4 { margin: 0 0 12px 0; color: var(--color-secondary); font-size: 15px; border-bottom: 1px solid var(--color-border); padding-bottom: 8px;}
            .summary-card p { margin: 0 0 8px 0; font-size: 14px; }
            .qr-card { text-align: center; }
            .qr-card img { max-width: 150px; margin: 10px auto; }
            .qr-caption { font-size: 12px !important; color: var(--color-text-light); margin-top: 10px !important; }
            .map-image { width: 100%; border-radius: 4px; border: 1px solid var(--color-border); }
            .address-list { list-style-type: none; margin: 0; padding: 0; }
            .address-list li { background-color: var(--color-bg-light); padding: 10px 15px; border-radius: 6px; margin-bottom: 8px; font-size: 13px; display: flex; align-items: center; }
            .address-list li:last-child { margin-bottom: 0; }
            .address-list .label { flex-shrink: 0; background-color: var(--color-accent); color: var(--color-text); border-radius: 50%; width: 28px; height: 28px; text-align: center; line-height: 28px; font-weight: 700; margin-right: 15px; }
        </style>
    </head>
    <body>
        <div class="page-container">
            <div class="cover-page">
                 <img src="${logoUrl}" alt="Logo">
                 <h1>Propuesta de Servicio Logístico</h1>
                 <p>Presupuesto N° ${presupuesto._id} • Válido hasta ${fechaValidez}</p>
            </div>
            ${await generarHtmlSeccionRuta(presupuesto)}
        </div>
    </body>
    </html>`;
    return html;
}

export async function generarPresupuestoPDF_Avanzado(presupuesto, stream, seccionParaRenderizar = 'todo') {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    const logoUrl = 'https://i.imgur.com/sC5w45G.png';
    const htmlContent = await getHtmlContent(presupuesto, seccionParaRenderizar);
    
    const headerTemplate = `
        <div style="font-family: 'Montserrat', sans-serif; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0 0.5in; height: 60px; border-bottom: 1px solid #dee2e6; font-size: 10px;">
            <img src="${logoUrl}" style="height: 30px;" />
            <div style="color: #6c757d;">Propuesta de Servicio Logístico • Presupuesto #${presupuesto._id}</div>
        </div>`;
    const footerTemplate = `
        <div style="font-family: 'Montserrat', sans-serif; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0 0.5in; height: 60px; border-top: 1px solid #dee2e6; font-size: 10px; color: #6c757d;">
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
        margin: { top: '0.8in', bottom: '0.8in', left: '0.5in', right: '0.5in' }
    });

    await browser.close();
    stream.write(pdfBuffer);
    stream.end();
}