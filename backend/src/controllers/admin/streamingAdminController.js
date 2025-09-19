const prisma = require('../../utils/database');
const streamingService = require('../../services/streamingService');

const streamingController = {
  async getAllStreamingLinks(req, res) {
    try {
      const streamingLinks = await prisma.streamingLink.findMany({
        include: {
          media: true
        }
      });
      res.json(streamingLinks);
    } catch (error) {
      console.error('Erro ao buscar links de streaming:', error);
      res.status(500).json({ error: 'Erro ao buscar links de streaming' });
    }
  },

  async updateMediaStreamingLinks(req, res) {
    try {
      const { linkId } = req.params;
      const { service, url } = req.body;
      const id = parseInt(linkId);

      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'ID do link inválido' });
      }

      // Busca o link
      const link = await prisma.streamingLink.findUnique({ where: { id } });
      if (!link) {
        return res.status(404).json({ error: 'Link não encontrado' });
      }

      // Se vier URL, valida
      if (url && !streamingService.validateStreamingUrl(url, service || link.service)) {
        return res.status(400).json({ error: `URL inválida para o serviço ${service || link.service}` });
      }

      // Se trocar de service, verifica conflito (mesmo mediaId + service)
      if (service && service !== link.service) {
        const conflict = await prisma.streamingLink.findFirst({
          where: { mediaId: link.mediaId, service }
        });
        if (conflict) {
          return res.status(400).json({ error: 'Este serviço já está cadastrado para esta mídia' });
        }
      }

      const dataToUpdate = {};
      if (service) dataToUpdate.service = service;
      if (url) dataToUpdate.url = url;

      const updated = await prisma.streamingLink.update({
        where: { id },
        data: dataToUpdate
      });

      res.json({ message: 'Link de streaming atualizado com sucesso', link: updated });
    } catch (error) {
      console.error('Erro ao atualizar link:', error);
      if (error.code === 'P2002') { // unique constraint
        return res.status(400).json({ error: 'Este serviço já está cadastrado para esta mídia' });
      }
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async addStreamingLink(req, res) {
    try {
      const { mediaId } = req.params;
      const { service, url } = req.body;
      const id = parseInt(mediaId);

      // Confere se a mídia existe
      const media = await prisma.media.findUnique({ where: { id } });
      if (!media) {
        return res.status(404).json({ error: 'Mídia não encontrada' });
      }

      // Valida URL
      if (!streamingService.validateStreamingUrl(url, service)) {
        return res.status(400).json({
          error: `URL inválida para o serviço ${service}`
        });
      }

      const link = await prisma.streamingLink.create({
        data: {
          service,
          url,
          mediaId: id
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
      const { linkId } = req.params;
      const id = parseInt(linkId);

      // Confere se o link existe
      const link = await prisma.streamingLink.findUnique({ where: { id } });
      if (!link) {
        return res.status(404).json({ error: 'Link não encontrado' });
      }

      await prisma.streamingLink.delete({ where: { id } });

      res.json({ message: 'Link de streaming removido com sucesso' });
    } catch (error) {
      console.error('Erro ao remover link:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getMediaStreamingLinks(req, res) {
    try {
      const { mediaId } = req.params;
      const id = parseInt(mediaId);

      // Confere se a mídia existe
      const media = await prisma.media.findUnique({ where: { id } });
      if (!media) {
        return res.status(404).json({ error: 'Mídia não encontrada' });
      }

      const links = await streamingService.getMediaStreamingLinks(id);
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