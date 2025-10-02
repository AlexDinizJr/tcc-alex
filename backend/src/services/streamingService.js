const prisma = require('../utils/database');

class StreamingService {
  constructor() {
    this.availableServices = [
      'NETFLIX',
      'PRIMEVIDEO',
      'DISNEY',
      'MAX',
      'PARAMOUNT',
      'CRUNCHYROLL',
      'APPLE_TV',
      'STEAM',
      'PLAYSTATION',
      'XBOX',
      'NINTENDO',
      'EPIC_GAMES',
      'GOG',
      'ROCKSTAR',
      'UBISOFT',
      'EA',
      'SPOTIFY',
      'APPLE_MUSIC',
      'DEEZER',
      'YOUTUBE_MUSIC',
      'AMAZON',
      'AMAZON_KINDLE',
      'AMAZON_MUSIC',
      'GOOGLE_PLAY',
      'MICROSOFT',
      'BATTLENET',
      'HULU',
      'PEACOCK',
      'HIDIVE',
      'APPLE_STORE',
    ];
  }

  async getMediaStreamingLinks(mediaId) {
    try {
      const streamingLinks = await prisma.streamingLink.findMany({
        where: { mediaId },
        orderBy: { service: 'asc' }
      });

      return streamingLinks.map(link => ({
        service: link.service, // usado no front p/ buscar ícone/cor/baseUrl
        url: link.url,
      }));
    } catch (error) {
      console.error('Error getting streaming links:', error);
      return [];
    }
  }

  async updateMediaStreamingLinks(mediaId, links) {
    try {
      // Remove links antigos
      await prisma.streamingLink.deleteMany({ where: { mediaId } });

      // Insere links novos
      await prisma.streamingLink.createMany({
        data: links.map(link => ({
          service: link.service,
          url: link.url,
          mediaId
        }))
      });

      return true;
    } catch (error) {
      console.error('Error updating streaming links:', error);
      throw new Error('Erro ao atualizar links de streaming');
    }
  }

  getAvailableServices() {
    return this.availableServices.map(service => ({
      id: service,
      name: service // o front já sabe o nome "bonito" através do mock
    }));
  }

  validateStreamingUrl(url, service) {
    const urlPatterns = {
      NETFLIX: /netflix\.com/,
      PRIMEVIDEO: /primevideo\.com/,
      DISNEY: /disneyplus\.com/,
      MAX: /(hbomax|play\.max)\.com/,
      APPLE_TV: /tv\.apple\.com/,
      SPOTIFY: /spotify\.com/,
      STEAM: /store\.steampowered\.com/,
      EPIC_GAMES: /store\.epicgames\.com/,
    };

    if (urlPatterns[service]) {
      return urlPatterns[service].test(url);
    }

    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = new StreamingService();
