import nodemailer from 'nodemailer';

// Se crea el transporter de forma lazy para asegurar que las variables de entorno
// ya estén cargadas cuando se use por primera vez.
let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

/**
 * Envía el email de verificación de cuenta al usuario registrado.
 * @param {string} email - Dirección de email del destinatario
 * @param {string} nombre - Nombre del usuario
 * @param {string} token - Token de verificación único
 */
export const enviarEmailVerificacion = async (email, nombre, token) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
  const linkVerificacion = `${frontendUrl}/verificar/${token}`;

  const mailOptions = {
    from: `"Cotizador Logístico" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verificá tu cuenta — Cotizador Logístico',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8f9fa; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1a365d; margin: 0;">Cotizador Logístico</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #2d3748; margin-top: 0;">¡Hola, ${nombre}!</h2>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
            Gracias por registrarte en el Cotizador Logístico. Para activar tu cuenta, hacé clic en el siguiente botón:
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${linkVerificacion}" 
               style="background: #3182ce; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
              Verificar mi cuenta
            </a>
          </div>
          <p style="color: #718096; font-size: 14px;">
            Este enlace expira en 24 horas. Si no creaste esta cuenta, podés ignorar este email.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
          <p style="color: #a0aec0; font-size: 12px; margin: 0;">
            Si el botón no funciona, copiá y pegá este enlace en tu navegador:<br>
            <a href="${linkVerificacion}" style="color: #3182ce;">${linkVerificacion}</a>
          </p>
        </div>
      </div>
    `,
  };

  await getTransporter().sendMail(mailOptions);
};
