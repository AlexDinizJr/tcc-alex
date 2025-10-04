const { sendReportEmail, sendRequestEmail } = require('../services/emailService');

const reportController = {
  // --- Reportar Problema ---
  async reportIssue(req, res) {
    try {
      const { mediaId, issueType, description, userEmail } = req.body;

      if (!mediaId || !issueType || !description) {
        return res.status(400).json({
          success: false,
          error: 'Campos obrigatórios: mediaId, issueType, description'
        });
      }

      await sendReportEmail({
        userEmail,                  // já vem do frontend
        mediaId,                    // já vem do frontend
        mediaTitle: req.body.mediaTitle || "Sem título", // precisa ser enviado do frontend
        issue: issueType || "Outro",       // converte para o nome esperado
        details: description || "",        // converte para o nome esperado
      });
      
      res.json({
        success: true,
        message: 'Problema reportado com sucesso'
      });
    } catch (error) {
      console.error('❌ Erro ao reportar problema:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao enviar relatório'
      });
    }
  },

  // --- Enviar Pedido ---
  async sendRequest(req, res) {
    try {
      const { requestType, details, userEmail } = req.body;

      if (!requestType || !details) {
        return res.status(400).json({
          success: false,
          error: 'Campos obrigatórios: requestType, details'
        });
      }

      await sendRequestEmail({
        to: process.env.SUPPORT_EMAIL,
        requestType,
        details,
        userEmail
      });

      res.json({
        success: true,
        message: 'Pedido enviado com sucesso'
      });
    } catch (error) {
      console.error('❌ Erro ao enviar pedido:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao enviar pedido'
      });
    }
  }
};

module.exports = reportController;
