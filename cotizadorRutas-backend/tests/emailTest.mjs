/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TEST DE EMAIL — Quotargo (equipo@quotargo.ar)
 * Verifica que el servicio de email funcione correctamente con el nuevo SMTP.
 * Ejecutar: node tests/emailTest.mjs
 * ═══════════════════════════════════════════════════════════════════════════
 */
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const R = '\x1b[0m', B = '\x1b[1m', G = '\x1b[32m', X = '\x1b[31m', Y = '\x1b[33m', C = '\x1b[36m';

let passed = 0, failed = 0;

function check(label, condition) {
  if (condition) { console.log(`  ${G}✅${R} ${label}`); passed++; }
  else { console.log(`  ${X}❌${R} ${label}`); failed++; }
}

console.log(`\n${B}${C}═══════════════════════════════════════════${R}`);
console.log(`${B}   📧 Test de Email — Quotargo${R}`);
console.log(`${B}${C}═══════════════════════════════════════════${R}\n`);

// ── SUITE 1: Variables de entorno ──
console.log(`${B}📋 Suite 1: Variables de entorno${R}`);
check('EMAIL_USER definido', !!process.env.EMAIL_USER);
check('EMAIL_USER es equipo@quotargo.ar', process.env.EMAIL_USER === 'equipo@quotargo.ar');
check('EMAIL_PASS definido', !!process.env.EMAIL_PASS);
check('EMAIL_HOST es smtp.hostinger.com', process.env.EMAIL_HOST === 'smtp.hostinger.com');
check('EMAIL_PORT es 465', process.env.EMAIL_PORT === '465');
check('EMAIL_SECURE es true', process.env.EMAIL_SECURE === 'true');

// ── SUITE 2: Conexión SMTP ──
console.log(`\n${B}🔌 Suite 2: Conexión SMTP${R}`);
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

try {
  await transporter.verify();
  check('Conexión SMTP verificada (auth + TLS OK)', true);
} catch (err) {
  check(`Conexión SMTP verificada — ERROR: ${err.message}`, false);
}

// ── SUITE 3: Envío real de email de prueba ──
console.log(`\n${B}📤 Suite 3: Envío de email de prueba${R}`);
try {
  const info = await transporter.sendMail({
    from: `"Quotargo" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Se envía a sí mismo como test
    subject: '✅ Test de Email — Quotargo Backend',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8f9fa; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1a365d; margin: 0;">Quotargo</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #2d3748; margin-top: 0;">🎉 Email de Prueba</h2>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
            Este es un email de prueba enviado desde el backend de Quotargo para verificar que la configuración SMTP funciona correctamente.
          </p>
          <div style="background: #edf2f7; padding: 16px; border-radius: 8px; margin-top: 16px;">
            <p style="color: #2d3748; font-size: 14px; margin: 0;"><strong>De:</strong> ${process.env.EMAIL_USER}</p>
            <p style="color: #2d3748; font-size: 14px; margin: 4px 0 0 0;"><strong>Host:</strong> ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}</p>
            <p style="color: #2d3748; font-size: 14px; margin: 4px 0 0 0;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          </div>
        </div>
      </div>
    `,
  });
  check(`Email enviado exitosamente (messageId: ${info.messageId})`, true);
  check('Email aceptado por el servidor', info.accepted.includes(process.env.EMAIL_USER));
} catch (err) {
  check(`Email enviado — ERROR: ${err.message}`, false);
}

// ── SUITE 4: Simulación de templates del sistema ──
console.log(`\n${B}📋 Suite 4: Templates del sistema${R}`);

// Verificación
try {
  const fakeToken = 'test_verification_token_12345';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
  const linkVerificacion = `${frontendUrl}/verificar/${fakeToken}`;
  
  const infoVerif = await transporter.sendMail({
    from: `"Quotargo" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: 'Verificá tu cuenta — Quotargo [TEST]',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8f9fa; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1a365d; margin: 0;">Quotargo</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #2d3748; margin-top: 0;">¡Hola, Usuario Test!</h2>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
            Gracias por registrarte en Quotargo. Para activar tu cuenta, hacé clic en el siguiente botón:
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${linkVerificacion}" 
               style="background: #3182ce; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
              Verificar mi cuenta
            </a>
          </div>
          <p style="color: #718096; font-size: 14px;">
            [ESTE ES UN EMAIL DE PRUEBA — NO HACER CLIC]
          </p>
        </div>
      </div>
    `,
  });
  check(`Template verificación enviado (${infoVerif.messageId})`, true);
} catch (err) {
  check(`Template verificación — ERROR: ${err.message}`, false);
}

// Recuperación de contraseña
try {
  const fakeToken = 'test_recovery_token_67890';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
  const linkRecuperacion = `${frontendUrl}/recuperar/${fakeToken}`;
  
  const infoRecup = await transporter.sendMail({
    from: `"Quotargo" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: 'Recuperá tu contraseña — Quotargo [TEST]',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8f9fa; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1a365d; margin: 0;">Quotargo</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #2d3748; margin-top: 0;">Hola, Usuario Test</h2>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${linkRecuperacion}" 
               style="background: #3182ce; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
              Restablecer contraseña
            </a>
          </div>
          <p style="color: #718096; font-size: 14px;">
            [ESTE ES UN EMAIL DE PRUEBA — NO HACER CLIC]
          </p>
        </div>
      </div>
    `,
  });
  check(`Template recuperación enviado (${infoRecup.messageId})`, true);
} catch (err) {
  check(`Template recuperación — ERROR: ${err.message}`, false);
}

// ── RESUMEN ──
console.log(`\n${B}${C}═══════════════════════════════════════════${R}`);
console.log(`${B}  📊 RESUMEN: ${G}${passed} pasados${R}${B} / ${failed > 0 ? X : G}${failed} fallados${R}`);
console.log(`${B}${C}═══════════════════════════════════════════${R}\n`);

process.exit(failed > 0 ? 1 : 0);
