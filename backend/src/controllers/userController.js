const prisma = require('../utils/database');
const bcrypt = require('bcrypt');
const imageProcessingService = require('../services/imageProcessingService');

const userController = {

  // Pegar todos os usuários com paginação
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 20, search } = req.query;
      const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
      const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 20;
      const skip = (pageNumber - 1) * limitNumber;

      const where = {};
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } }
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limitNumber,
          orderBy: { name: 'asc' },
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            bio: true,
            coverImage: true,
            createdAt: true,
            _count: { select: { reviews: true, lists: true, savedMedia: true, favorites: true } }
          }
        }),
        prisma.user.count({ where })
      ]);

      res.json({
        users,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          pages: Math.ceil(total / limitNumber)
        }
      });
    } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Pegar usuário por ID
  async getUserById(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          coverImage: true,
          bio: true,
          createdAt: true,
          profileVisibility: true,
          showActivity: true,
          showSavedItems: true,
          showFavorites: true,
          showReviews: true,
          showStats: true,
          dataCollection: true,
          reviews: {
            include: {
              media: { select: { id: true, title: true, type: true, image: true } }
            }
          },
          lists: {
            include: {
              items: { take: 4, select: { id: true, title: true, image: true } }
            }
          },
          _count: { select: { reviews: true, lists: true, savedMedia: true, favorites: true } }
        }
      });

      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      res.json(user);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Pegar usuário por username
  async getUserByUsername(req, res) {
    try {
      const username = req.params.username;
      const user = await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          coverImage: true,
          bio: true,
          createdAt: true,
          profileVisibility: true,
          showActivity: true,
          showSavedItems: true,
          showFavorites: true,
          showReviews: true,
          showStats: true,
          dataCollection: true,
          reviews: {
            include: {
              media: { select: { id: true, title: true, type: true, image: true } }
            }
          },
          lists: {
            include: {
              items: { take: 4, select: { id: true, title: true, image: true } }
            }
          },
          _count: { select: { reviews: true, lists: true, savedMedia: true, favorites: true } }
        }
      });

      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      res.json(user);
    } catch (error) {
      console.error('Error getting user by username:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Atualizar nome, bio e configurações de privacidade
  async updateUser(req, res) {
    try {
      const { name, bio, privacySettings } = req.body;

      const dataToUpdate = {};
      if (name !== undefined) dataToUpdate.name = name;
      if (bio !== undefined) dataToUpdate.bio = bio;

      if (privacySettings && typeof privacySettings === 'object') {
        const allowedFields = [
          'profileVisibility',
          'showActivity',
          'showSavedItems',
          'showFavorites',
          'showReviews',
          'showStats',
          'dataCollection'
        ];
        allowedFields.forEach(field => {
          if (privacySettings[field] !== undefined) dataToUpdate[field] = privacySettings[field];
        });
      }

      if (Object.keys(dataToUpdate).length === 0) {
        return res.status(400).json({ error: 'Nenhum dado válido para atualizar' });
      }

      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: dataToUpdate,
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

      res.json({ message: 'Perfil atualizado com sucesso', user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Atualizar email, username ou senha com senha atual
  async updateUserWithPassword(req, res) {
    try {
      const { currentPassword, newPassword, newEmail, newUsername } = req.body;

      if (!currentPassword) return res.status(400).json({ error: 'Senha atual é obrigatória' });

      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Senha atual incorreta' });

      const dataToUpdate = {};
      if (newPassword) dataToUpdate.password = await bcrypt.hash(newPassword, 12);
      if (newEmail) dataToUpdate.email = newEmail;
      if (newUsername) dataToUpdate.username = newUsername;

      if (Object.keys(dataToUpdate).length === 0) {
        return res.status(400).json({ error: 'Nenhum dado para atualizar' });
      }

      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: dataToUpdate,
        select: { id: true, name: true, username: true, email: true }
      });

      res.json({ message: 'Dados atualizados com sucesso', user: updatedUser });
    } catch (error) {
      console.error('Error updating user with password:', error);

      if (error.code === 'P2002') { // Unique constraint fail
        return res.status(400).json({ error: 'Email ou username já está em uso' });
      }

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
  // Atualizar apenas configurações de privacidade do usuário
  async updateUserPrivacy(req, res) {
    try {
      const { privacySettings } = req.body;

      if (!privacySettings || typeof privacySettings !== 'object') {
        return res.status(400).json({ error: 'Dados de privacidade inválidos' });
      }

      const allowedFields = [
        'profileVisibility',
        'showActivity',
        'showSavedItems',
        'showFavorites',
        'showReviews',
        'showStats',
        'dataCollection'
      ];

      const dataToUpdate = {};
      allowedFields.forEach(field => {
        if (privacySettings[field] !== undefined) dataToUpdate[field] = privacySettings[field];
      });

      if (Object.keys(dataToUpdate).length === 0) {
        return res.status(400).json({ error: 'Nenhum dado de privacidade para atualizar' });
      }

      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: dataToUpdate,
        select: {
          id: true,
          name: true,
          username: true,
          profileVisibility: true,
          showActivity: true,
          showSavedItems: true,
          showFavorites: true,
          showReviews: true,
          showStats: true,
          dataCollection: true
        }
      });

      res.json({ message: 'Privacidade atualizada com sucesso', user: updatedUser });

    } catch (error) {
      console.error('Erro ao atualizar privacidade do usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Upload avatar
  async uploadAvatar(req, res) {
    try {
      if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });

      const processedImages = await imageProcessingService.processAvatar(req.file.path, req.user.id);
      const avatarUrl = imageProcessingService.generateImageUrl(processedImages.medium, 'avatar', 'medium');

      const oldUser = await prisma.user.findUnique({ where: { id: req.user.id }, select: { avatar: true } });

      const user = await prisma.user.update({
        where: { id: req.user.id },
        data: { avatar: avatarUrl },
        select: { id: true, name: true, username: true, avatar: true }
      });

      if (oldUser.avatar) {
        const oldFilename = oldUser.avatar.split('/').pop();
        await imageProcessingService.deleteOldImages([oldFilename], 'avatar');
      }

      res.json({ message: 'Avatar atualizado com sucesso', user, images: processedImages });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      res.status(500).json({ error: 'Erro ao processar imagem' });
    }
  },

  // Upload cover
  async uploadCover(req, res) {
    try {
      if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });

      const processedImages = await imageProcessingService.processCover(req.file.path, req.user.id);
      const coverUrl = imageProcessingService.generateImageUrl(processedImages.large, 'cover', 'large');

      const oldUser = await prisma.user.findUnique({ where: { id: req.user.id }, select: { coverImage: true } });

      const user = await prisma.user.update({
        where: { id: req.user.id },
        data: { coverImage: coverUrl },
        select: { id: true, name: true, username: true, coverImage: true }
      });

      if (oldUser.coverImage) {
        const oldFilename = oldUser.coverImage.split('/').pop();
        await imageProcessingService.deleteOldImages([oldFilename], 'cover');
      }

      res.json({ message: 'Imagem de capa atualizada com sucesso', user, images: processedImages });
    } catch (error) {
      console.error('Error uploading cover:', error);
      res.status(500).json({ error: 'Erro ao processar imagem' });
    }
  },

  // Deletar avatar
  async deleteAvatar(req, res) {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { avatar: true } });

      if (user.avatar) {
        const filename = user.avatar.split('/').pop();
        await imageProcessingService.deleteOldImages([filename], 'avatar');
        await prisma.user.update({ where: { id: req.user.id }, data: { avatar: null } });
      }

      res.json({ message: 'Avatar removido com sucesso' });
    } catch (error) {
      console.error('Error deleting avatar:', error);
      res.status(500).json({ error: 'Erro ao remover avatar' });
    }
  },

  // Deletar cover
  async deleteCover(req, res) {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { coverImage: true } });

      if (user.coverImage) {
        const filename = user.coverImage.split('/').pop();
        await imageProcessingService.deleteOldImages([filename], 'cover');
        await prisma.user.update({ where: { id: req.user.id }, data: { coverImage: null } });
      }

      res.json({ message: 'Imagem de capa removida com sucesso' });
    } catch (error) {
      console.error('Error deleting cover:', error);
      res.status(500).json({ error: 'Erro ao remover imagem de capa' });
    }
  },

  async deleteProfile(req, res) {
    try {
      const userId = req.user.id;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ error: "Senha é obrigatória para excluir a conta." });
      }

      // Buscar usuário com hash da senha
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true, avatar: true, coverImage: true }
      });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Senha incorreta." });
      }

      // Deletar imagens associadas, se houver
      if (user.avatar) {
        const avatarFilename = user.avatar.split("/").pop();
        await imageProcessingService.deleteOldImages([avatarFilename], "avatar");
      }
      if (user.coverImage) {
        const coverFilename = user.coverImage.split("/").pop();
        await imageProcessingService.deleteOldImages([coverFilename], "cover");
      }

      // Deletar usuário do banco
      await prisma.user.delete({ where: { id: userId } });

      res.json({ message: "Perfil deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar perfil:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  
};

module.exports = userController;