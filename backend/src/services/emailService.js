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

async function sendWelcomeEmail(to, name) {
  const mailOptions = {
    from: `"No Reply" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Bem-vindo(a) ao MediaHub!',
    html: `
      <h2>Olá, ${name}!</h2>
      <p>Obrigado por se cadastrar em nossa plataforma 🎉</p>
      <p>Aproveite para explorar conteúdos e fazer novas descobertas!</p>
      <p>Equipe ${process.env.APP_NAME ?? 'MediaHub'}</p>
    `
  };
  await transporter.sendMail(mailOptions);
}

async function sendPasswordRecovery(to, token) {
  const resetUrl = `${process.env.FRONTEND_URL}/recovery-password?token=${token}`;
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

async function sendReportEmail({ userEmail, mediaTitle, mediaId, issue, details }) {
  const mailOptions = {
    from: `"MediaHub Reports" <${process.env.SMTP_USER}>`, // remetente válido
    replyTo: userEmail, // se você clicar em "responder", vai para o usuário
    to: process.env.SMTP_USER, // seu email de suporte
    subject: `🚨 Report de problema - ${mediaTitle}`,
    html: `
      <h3>Problema reportado no MediaHub</h3>
      <p><strong>Mídia:</strong> ${mediaTitle} (ID: ${mediaId})</p>
      <p><strong>Problema:</strong> ${issue}</p>
      <p><strong>Detalhes adicionais:</strong> ${details || "Nenhum detalhe informado"}</p>
      <p><em>Enviado por: ${userEmail}</em></p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de relatório enviado para ${process.env.SMTP_USER}`);
  } catch (err) {
    console.error("Erro ao enviar email de relatório:", err);
    throw err;
  }
}

async function sendRequestEmail({ userEmail, requestType, details }) {
  const mailOptions = {
    from: `"MediaHub Requests" <${process.env.SMTP_USER}>`, // remetente válido
    replyTo: userEmail, // replyTo para responder ao usuário
    to: process.env.SMTP_USER,
    subject: `📬 Pedido de ${requestType} - MediaHub`,
    html: `
      <h3>Novo pedido recebido</h3>
      <p><strong>Tipo de pedido:</strong> ${requestType}</p>
      <p><strong>Detalhes:</strong> ${details}</p>
      <p><em>Enviado por: ${userEmail || 'Usuário anônimo'}</em></p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de pedido enviado para ${process.env.SMTP_USER}`);
  } catch (err) {
    console.error("Erro ao enviar email de pedido:", err);
    throw err;
  }
}

module.exports = {
  sendPasswordRecovery,
  sendWelcomeEmail,
  sendReportEmail,
  sendRequestEmail
};