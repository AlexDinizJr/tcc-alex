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
      thumb: { width: 100, height: 100, crop: 'fill' },
      small: { width: 200, height: 200, crop: 'fill' },
      medium: { width: 400, height: 400, crop: 'fill' }
    };

    this.coverSizes = {
      thumb: { width: 300, height: 150, crop: 'fill' },
      small: { width: 600, height: 300, crop: 'fill' },
      medium: { width: 1200, height: 600, crop: 'fill' },
      large: { width: 1920, height: 960, crop: 'fill' }
    };
  }

  async processAvatar(filePath, userId) {
    try {
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: `avatars/${userId}`,
      });

      const processedImages = {};
      
      for (const [size, dimensions] of Object.entries(this.avatarSizes)) {
        const url = cloudinary.url(uploadResult.public_id, {
          width: dimensions.width,
          height: dimensions.height,
          crop: dimensions.crop,
          quality: 'auto',
          fetch_format: 'auto'
        });
        processedImages[size] = url;
      }

      processedImages.public_id = uploadResult.public_id;

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
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: `covers/${userId}`,
      });

      const processedImages = {
        public_id: uploadResult.public_id,
        original: uploadResult.secure_url,
      };

      // URLs derivadas sem distorção
      const coverSizes = {
        thumb: { width: 300, height: 150 },
        small: { width: 600, height: 300 },
        medium: { width: 1200, height: 600 },
        large: { width: 1920, height: 960 }
      };

      for (const [size, dimensions] of Object.entries(coverSizes)) {
        const url = cloudinary.url(uploadResult.public_id, {
          width: dimensions.width,
          height: dimensions.height,
          crop: 'limit', // limita sem cortar
          quality: 'auto',
          fetch_format: 'auto'
        });
        processedImages[size] = url;
      }

      const fs = require('fs');
      fs.unlinkSync(filePath);

      return processedImages;

    } catch (error) {
      console.error('Error processing cover:', error);
      throw new Error('Falha ao processar imagem');
    }
  }

  // Método simplificado para gerar URLs
  generateImageUrl(publicId, type = 'avatar', size = 'medium') {
    if (!publicId) {
      return this.getDefaultImageUrl(type, size);
    }

    const dimensions = type === 'avatar' 
      ? this.avatarSizes[size] 
      : this.coverSizes[size];

    if (!dimensions) {
      return cloudinary.url(publicId);
    }

    return cloudinary.url(publicId, {
      width: dimensions.width,
      height: dimensions.height,
      crop: dimensions.crop,
      quality: 'auto',
      fetch_format: 'auto'
    });
  }
  
  getDefaultImageUrl(type = 'avatar', size = 'medium') {
    const baseUrl = 'https://mediahubapi.up.railway.app';
    return `${baseUrl}/uploads/default-${type}-${size}.jpg`;
  }

  async deleteOldImages(filenames, type = 'avatar') {
    try {
      if (!filenames || !Array.isArray(filenames)) return;

      for (const filename of filenames) {
        if (filename && !filename.startsWith('http')) {
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

  extractPublicId(url) {
    if (!url.includes('cloudinary.com')) return null;
    
    try {
      const urlParts = url.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      if (uploadIndex !== -1) {
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