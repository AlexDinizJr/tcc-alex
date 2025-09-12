const prisma = require('../utils/database');

const userController = {
  async getUserById(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(req.params.id) },
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          bio: true,
          createdAt: true,
          reviews: {
            where: {
              media: {
                type: req.query.mediaType || undefined
              }
            },
            include: {
              media: {
                select: {
                  id: true,
                  title: true,
                  type: true,
                  image: true
                }
              }
            }
          },
          lists: {
            where: {
              isPublic: true
            },
            include: {
              items: {
                take: 4,
                select: {
                  id: true,
                  title: true,
                  image: true
                }
              }
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getUserByUsername(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { username: req.params.username },
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          bio: true,
          coverImage: true,
          createdAt: true,
          reviews: {
            where: {
              media: {
                type: req.query.mediaType || undefined
              }
            },
            include: {
              media: {
                select: {
                  id: true,
                  title: true,
                  type: true,
                  image: true
                }
              }
            }
          },
          lists: {
            where: {
              isPublic: true
            },
            include: {
              items: {
                take: 4,
                select: {
                  id: true,
                  title: true,
                  image: true
                }
              }
            }
          },
          _count: {
            select: {
              reviews: true,
              lists: true,
              savedMedia: true,
              favorites: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async updateUser(req, res) {
    try {
      const { bio, privacySettings } = req.body;
      
      const user = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          bio,
          ...privacySettings
        },
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          coverImage: true,
          bio: true,
          profileVisibility: true,
          showActivity: true,
          showSavedItems: true,
          showFavorites: true,
          showReviews: true,
          showStats: true,
          dataCollection: true
        }
      });

      res.json({ message: 'Perfil atualizado com sucesso', user });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada' });
      }

      // Processar a imagem
      const processedImages = await imageProcessingService.processAvatar(
        req.file.path,
        req.user.id
      );

      // Gerar URL da imagem média
      const avatarUrl = imageProcessingService.generateImageUrl(
        processedImages.medium,
        'avatar',
        'medium'
      );

      // Buscar avatar antigo para deletar
      const oldUser = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { avatar: true }
      });

      // Atualizar usuário
      const user = await prisma.user.update({
        where: { id: req.user.id },
        data: { avatar: avatarUrl },
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true
        }
      });

      // Deletar imagens antigas
      if (oldUser.avatar) {
        const oldFilename = oldUser.avatar.split('/').pop();
        await imageProcessingService.deleteOldImages([oldFilename], 'avatar');
      }

      res.json({
        message: 'Avatar atualizado com sucesso',
        user,
        images: processedImages
      });

    } catch (error) {
      console.error('Error uploading avatar:', error);
      res.status(500).json({ error: 'Erro ao processar imagem' });
    }
  },

  async uploadCover(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada' });
      }

      // Processar a imagem
      const processedImages = await imageProcessingService.processCover(
        req.file.path,
        req.user.id
      );

      // Gerar URL da imagem grande
      const coverUrl = imageProcessingService.generateImageUrl(
        processedImages.large,
        'cover',
        'large'
      );

      // Buscar capa antiga para deletar
      const oldUser = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { coverImage: true }
      });

      // Atualizar usuário
      const user = await prisma.user.update({
        where: { id: req.user.id },
        data: { coverImage: coverUrl },
        select: {
          id: true,
          name: true,
          username: true,
          coverImage: true
        }
      });

      // Deletar imagens antigas
      if (oldUser.coverImage) {
        const oldFilename = oldUser.coverImage.split('/').pop();
        await imageProcessingService.deleteOldImages([oldFilename], 'cover');
      }

      res.json({
        message: 'Imagem de capa atualizada com sucesso',
        user,
        images: processedImages
      });

    } catch (error) {
      console.error('Error uploading cover:', error);
      res.status(500).json({ error: 'Erro ao processar imagem' });
    }
  },

  async deleteAvatar(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { avatar: true }
      });

      if (user.avatar) {
        // Deletar imagens do sistema de arquivos
        const filename = user.avatar.split('/').pop();
        await imageProcessingService.deleteOldImages([filename], 'avatar');

        // Atualizar usuário
        await prisma.user.update({
          where: { id: req.user.id },
          data: { avatar: null }
        });
      }

      res.json({ message: 'Avatar removido com sucesso' });

    } catch (error) {
      console.error('Error deleting avatar:', error);
      res.status(500).json({ error: 'Erro ao remover avatar' });
    }
  },

  async deleteCover(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { coverImage: true }
      });

      if (user.coverImage) {
        // Deletar imagens do sistema de arquivos
        const filename = user.coverImage.split('/').pop();
        await imageProcessingService.deleteOldImages([filename], 'cover');

        // Atualizar usuário
        await prisma.user.update({
          where: { id: req.user.id },
          data: { coverImage: null }
        });
      }

      res.json({ message: 'Imagem de capa removida com sucesso' });

    } catch (error) {
      console.error('Error deleting cover:', error);
      res.status(500).json({ error: 'Erro ao remover imagem de capa' });
    }
  }
  
};

module.exports = userController;