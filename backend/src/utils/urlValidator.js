const isValidUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch (error) {
    return false;
  }
};

const getImageExtension = (url) => {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return validExtensions.find(ext => url.toLowerCase().includes(ext)) || null;
};

const validateImageUrl = (url) => {
  if (!isValidUrl(url)) {
    return { valid: false, error: 'URL inválida' };
  }

  const extension = getImageExtension(url);
  if (!extension) {
    return { valid: false, error: 'Formato de imagem não suportado' };
  }

  return { valid: true, extension };
};

// URL padrões para fallback
const defaultImages = {
  avatar: 'https://example.com/default-avatar.png',
  cover: 'https://example.com/default-cover.jpg',
  media: 'https://example.com/default-media.png'
};

module.exports = {
  isValidUrl,
  validateImageUrl,
  defaultImages
};