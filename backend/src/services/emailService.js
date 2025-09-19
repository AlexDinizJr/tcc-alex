const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,           // smtp.gmail.com
  port: parseInt(process.env.SMTP_PORT), // 465 (SSL) ou 587 (TLS)
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,         // seu email Gmail
    pass: process.env.SMTP_PASS,         // App Password
  },
  tls: {
    rejectUnauthorized: false,           // geralmente opcional
  },
});

async function sendPasswordRecovery(to, token) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const mailOptions = {
    from: `"No Reply" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Recuperação de senha',
    html: `
      <p>Você solicitou a recuperação de senha.</p>
      <p>Clique no link abaixo para redefinir sua senha:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Se não solicitou, ignore este e-mail.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email enviado para ${to}`);
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    throw err;
  }
}

module.exports = { sendPasswordRecovery };