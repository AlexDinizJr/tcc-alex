const { defaultImages } = require('../utils/urlValidator.js');

class ImageService {
  constructor() {
    this.providers = {
      tmdb: 'https://image.tmdb.org/t/p',
      igdb: 'https://images.igdb.com/igdb/image/upload',
      custom: 'https://your-cdn.com/images'
    };
  }

  generateImageUrl(provider, path, size = 'original') {
    const baseUrl = this.providers[provider];
    if (!baseUrl) {
      throw new Error('Provedor de imagem não suportado');
    }

    return `${baseUrl}/${size}/${path}`;
  }

  // Método para garantir que sempre temos uma URL válida
  ensureImageUrl(url, type = 'media') {
    if (!url) {
      return defaultImages[type] || defaultImages.media;
    }

    try {
      new URL(url);
      return url;
    } catch (error) {
      return defaultImages[type] || defaultImages.media;
    }
  }

  // Otimização de URLs para diferentes dispositivos
  optimizeImageUrl(url, options = {}) {
    const { width = 500, height, quality = 80 } = options;
    
    if (url.includes('image.tmdb.org')) {
      return `${url}?w=${width}&q=${quality}`;
    }

    if (url.includes('your-cdn.com')) {
      return `${url}?width=${width}&height=${height}&quality=${quality}`;
    }

    return url; // Retorna original se não for um provedor conhecido
  }
}

module.exports = new ImageService();