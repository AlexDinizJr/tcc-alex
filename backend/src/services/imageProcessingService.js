const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

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
      const filename = path.basename(filePath);
      const ext = path.extname(filename);
      const baseName = path.basename(filename, ext);
      const dir = path.dirname(filePath);

      const processedImages = {};

      // Processar cada tamanho
      for (const [size, dimensions] of Object.entries(this.avatarSizes)) {
        const outputFilename = `${baseName}-${size}${ext}`;
        const outputPath = path.join(dir, outputFilename);

        await sharp(filePath)
          .resize(dimensions.width, dimensions.height, {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: 80, progressive: true })
          .toFile(outputPath);

        processedImages[size] = outputFilename;
      }

      // Deletar arquivo original
      fs.unlinkSync(filePath);

      return processedImages;

    } catch (error) {
      console.error('Error processing avatar:', error);
      throw new Error('Falha ao processar imagem');
    }
  }

  async processCover(filePath, userId) {
    try {
      const filename = path.basename(filePath);
      const ext = path.extname(filename);
      const baseName = path.basename(filename, ext);
      const dir = path.dirname(filePath);

      const processedImages = {};

      // Processar cada tamanho
      for (const [size, dimensions] of Object.entries(this.coverSizes)) {
        const outputFilename = `${baseName}-${size}${ext}`;
        const outputPath = path.join(dir, outputFilename);

        await sharp(filePath)
          .resize(dimensions.width, dimensions.height, {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: 85, progressive: true })
          .toFile(outputPath);

        processedImages[size] = outputFilename;
      }

      // Deletar arquivo original
      fs.unlinkSync(filePath);

      return processedImages;

    } catch (error) {
      console.error('Error processing cover:', error);
      throw new Error('Falha ao processar imagem');
    }
  }

  // Gerar URL para a imagem
  generateImageUrl(filename, type = 'avatar', size = 'medium') {
    const baseUrl = process.env.APP_URL || 'https://mediahubapi.up.railway.app';
    return `${baseUrl}/uploads/${type}s/${filename}`;
  }

  // Deletar imagens antigas
  async deleteOldImages(filenames, type = 'avatar') {
    try {
      const dir = path.join(__dirname, '../uploads', `${type}s`);
      
      for (const filename of filenames) {
        if (filename && !filename.startsWith('http')) {
          const filePath = path.join(dir, filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting old images:', error);
    }
  }
}

module.exports = new ImageProcessingService();