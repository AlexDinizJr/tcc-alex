const prisma = require('../../utils/database');
const streamingService = require('../../services/streamingService');

const streamingController = {
  async updateMediaStreamingLinks(req, res) {
    try {
      const { mediaId } = req.params;
      const { links } = req.body;

      // Validação de cada link
      for (const link of links) {
        if (!streamingService.validateStreamingUrl(link.url, link.service)) {
          return res.status(400).json({ 
            error: `URL inválida para o serviço ${link.service}` 
          });
        }
      }

      await streamingService.updateMediaStreamingLinks(parseInt(mediaId), links);

      res.json({ 
        message: 'Links de streaming atualizados com sucesso',
        links
      });
    } catch (error) {
      console.error('Erro ao atualizar links:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async addStreamingLink(req, res) {
    try {
      const { mediaId } = req.params;
      const { service, url } = req.body;

      if (!streamingService.validateStreamingUrl(url, service)) {
        return res.status(400).json({ 
          error: `URL inválida para o serviço ${service}` 
        });
      }

      const link = await prisma.streamingLink.create({
        data: {
          service,
          url,
          mediaId: parseInt(mediaId)
        }
      });

      res.status(201).json({
        message: 'Link de streaming adicionado com sucesso',
        link
      });
    } catch (error) {
      console.error('Erro ao adicionar link:', error);
      if (error.code === 'P2002') {
        return res.status(400).json({ 
          error: 'Este serviço já está cadastrado para esta mídia' 
        });
      }
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async removeStreamingLink(req, res) {
    try {
      const { mediaId, service } = req.params;

      await prisma.streamingLink.delete({
        where: {
          mediaId_service: {
            mediaId: parseInt(mediaId),
            service
          }
        }
      });

      res.json({ message: 'Link de streaming removido com sucesso' });
    } catch (error) {
      console.error('Erro ao remover link:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getMediaStreamingLinks(req, res) {
    try {
      const { mediaId } = req.params;
      const links = await streamingService.getMediaStreamingLinks(parseInt(mediaId));
      res.json(links);
    } catch (error) {
      console.error('Erro ao buscar links:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getAvailableServices(req, res) {
    try {
      const services = streamingService.getAvailableServices();
      res.json(services);
    } catch (error) {
      console.error('Erro ao listar serviços:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

module.exports = streamingController;
