const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class ImageProcessingService {
  constructor() {
    this.avatarSizes = {
      thumb: { width: 100, height: 100 },
      small: { width: 200, height: 200 },
      medium: { width: 400, height: 400 }
    };

    this.coverSizes = {
      thumb: { width: 300, height: 150 },
      small: { width: 600, height: 300 },
      medium: { width: 1200, height: 600 },
      large: { width: 1920, height: 960 }
    };
  }

  async processAvatar(filePath, userId) {
    try {
      // Upload para Cloudinary com transformações
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: `avatars/${userId}`,
        transformation: [
          { width: 400, height: 400, crop: 'fill' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });

      // Gerar URLs para diferentes tamanhos
      const processedImages = {};
      
      for (const [size, dimensions] of Object.entries(this.avatarSizes)) {
        const url = cloudinary.url(uploadResult.public_id, {
          width: dimensions.width,
          height: dimensions.height,
          crop: 'fill',
          quality: 'auto',
          fetch_format: 'auto'
        });
        processedImages[size] = url;
      }

      // Deletar arquivo local
      const fs = require('fs');
      fs.unlinkSync(filePath);

      return processedImages;

    } catch (error) {
      console.error('Error processing avatar:', error);
      throw new Error('Falha ao processar imagem');
    }
  }

  async processCover(filePath, userId) {
    try {
      // Upload para Cloudinary com transformações
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: `covers/${userId}`,
        transformation: [
          { width: 1200, height: 600, crop: 'fill' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });

      // Gerar URLs para diferentes tamanhos
      const processedImages = {};
      
      for (const [size, dimensions] of Object.entries(this.coverSizes)) {
        const url = cloudinary.url(uploadResult.public_id, {
          width: dimensions.width,
          height: dimensions.height,
          crop: 'fill',
          quality: 'auto',
          fetch_format: 'auto'
        });
        processedImages[size] = url;
      }

      // Deletar arquivo local
      const fs = require('fs');
      fs.unlinkSync(filePath);

      return processedImages;

    } catch (error) {
      console.error('Error processing cover:', error);
      throw new Error('Falha ao processar imagem');
    }
  }

  // Gerar URL para a imagem - agora usando Cloudinary
  generateImageUrl(filename, type = 'avatar', size = 'medium') {
    if (!filename) {
      return this.getDefaultImageUrl(type, size);
    }

    // Se já é uma URL completa (incluindo Cloudinary), retorna como está
    if (filename.startsWith('http')) {
      return filename;
    }

    // Para Cloudinary, o filename é o public_id
    // Mapear tamanhos para dimensões do Cloudinary
    const dimensions = type === 'avatar' 
      ? this.avatarSizes[size] 
      : this.coverSizes[size];

    if (!dimensions) {
      return filename; // Retorna original se tamanho não encontrado
    }

    return cloudinary.url(filename, {
      width: dimensions.width,
      height: dimensions.height,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto'
    });
  }

  getDefaultImageUrl(type = 'avatar', size = 'medium') {
    // Usar uma imagem padrão do Cloudinary ou URL local
    const baseUrl = 'https://mediahubapi.up.railway.app';
    return `${baseUrl}/uploads/default-${type}-${size}.jpg`;
  }

  async deleteOldImages(filenames, type = 'avatar') {
    try {
      if (!filenames || !Array.isArray(filenames)) return;

      for (const filename of filenames) {
        if (filename && !filename.startsWith('http')) {
          // Para Cloudinary, o filename é o public_id
          try {
            await cloudinary.uploader.destroy(filename);
          } catch (error) {
            console.error(`Error deleting image ${filename}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting old images:', error);
    }
  }

  // Método auxiliar para extrair public_id da URL do Cloudinary
  extractPublicId(url) {
    if (!url.includes('cloudinary.com')) return null;
    
    try {
      const urlParts = url.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      if (uploadIndex !== -1) {
        // O public_id está após a versão (se existir)
        const versionIndex = uploadIndex + 1;
        let publicIdParts = [];
        
        for (let i = versionIndex + 1; i < urlParts.length; i++) {
          publicIdParts.push(urlParts[i]);
        }
        
        const publicId = publicIdParts.join('/').split('.')[0];
        return publicId;
      }
    } catch (error) {
      console.error('Error extracting public_id:', error);
    }
    
    return null;
  }
}

module.exports = new ImageProcessingService();