// En: cotizadorRutas-backend/services/generadorPdf.js

import PDFDocument from 'pdfkit';
import { format } from 'date-fns';

function formatKey(key) {
    const result = key.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
}

function formatCurrency(num) {
    return `$ ${Math.round(num).toLocaleString('es-AR')}`;
}

function generarTabla(doc, startY, titulo, data) {
    let y = startY;
    const rowHeight = 25;
    const keyX = 60;
    const valueX = 400;

    if (y > doc.page.height - 150) {
        doc.addPage();
        y = doc.page.margins.top;
    }

    doc.fontSize(14).font('Helvetica-Bold').text(titulo, 50, y);
    y += 30;

    doc.font('Helvetica-Bold').fontSize(11);
    doc.text('Concepto', keyX, y);
    doc.text('Monto', valueX, y, { align: 'right' });
    doc.moveTo(50, y + 15).lineTo(550, y + 15).lineWidth(0.5).strokeColor('#444444').stroke();
    y += 25;

    doc.font('Helvetica').fontSize(10);

    for (const [key, value] of Object.entries(data)) {
        if (y > doc.page.height - 50) {
            doc.addPage();
            y = doc.page.margins.top;
            doc.font('Helvetica-Bold').fontSize(11);
            doc.text('Concepto', keyX, y);
            doc.text('Monto', valueX, y, { align: 'right' });
            doc.moveTo(50, y + 15).lineTo(550, y + 15).lineWidth(0.5).strokeColor('#444444').stroke();
            y += 25;
            doc.font('Helvetica').fontSize(10);
        }
        doc.text(formatKey(key), keyX, y, { width: 300 });
        const valorFormateado = typeof value === 'number' ? formatCurrency(value) : value;
        doc.text(valorFormateado, valueX, y, { align: 'right' });
        y += rowHeight;
    }
    return y + 20;
}

function generarTotal(doc, y, total) {
    if (y > doc.page.height - 100) {
        doc.addPage();
        y = doc.page.margins.top;
    }
    
    doc.rect(50, y, 500, 40).fillOpacity(0.1).fillAndStroke('blue', '#0000FF');
    doc.fillOpacity(1).fillColor('black');
    doc.fontSize(14).font('Helvetica-Bold');
    doc.text('Total Final del Presupuesto:', 70, y + 13);
    doc.text(formatCurrency(total), 350, y + 13, { align: 'right' });
    
    return y + 60;
}

export function generarPresupuestoPDF(presupuesto, stream) {
    const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true });
    doc.pipe(stream);

    // --- DIBUJAR TODO EL CONTENIDO ---
    doc.fontSize(20).font('Helvetica-Bold').text('Presupuesto de Ruta', { align: 'center' });
    doc.moveDown();
    const fechaFormateada = format(new Date(presupuesto.fechaCreacion), 'dd/MM/yyyy');
    doc.fontSize(12).font('Helvetica').text(`Fecha de Emisión: ${fechaFormateada}`, { align: 'right' });
    doc.moveDown(2);
    
    doc.fontSize(14).font('Helvetica-Bold').text('Resumen del Servicio');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica-Bold').text('Puntos de Entrega:');
    doc.font('Helvetica').list(presupuesto.puntosEntrega.map(p => p.nombre), { bulletRadius: 1.5, textIndent: 10, indent: 10 });
    doc.moveDown();
    const distancia = presupuesto.totalKilometros || 0;
    doc.font('Helvetica-Bold').text(`Distancia Total por Viaje: `, { continued: true })
       .font('Helvetica').text(`${distancia.toFixed(2)} km`);
    doc.moveDown(3);

    let y = doc.y;

    y = generarTabla(doc, y, 'Resumen General de Costos', presupuesto.resumenCostos);
    if (presupuesto.vehiculo?.calculo?.detalle) {
        y = generarTabla(doc, y, 'Desglose de Costos del Vehículo', presupuesto.vehiculo.calculo.detalle);
    }
    if (presupuesto.recursoHumano?.calculo?.detalle) {
        y = generarTabla(doc, y, 'Desglose de Costos del Recurso Humano', presupuesto.recursoHumano.calculo.detalle);
    }

    y = generarTotal(doc, y, presupuesto.resumenCostos.totalFinal);

    // --- LÓGICA CORREGIDA PARA PIE DE PÁGINA ---
    // Solo al final, cuando todas las páginas están creadas, las recorremos para agregar el pie.
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.fontSize(8).font('Helvetica').text(`Página ${i + 1} de ${range.count}`, 50, doc.page.height - 35, { align: 'right' });
    }

    doc.end();
}