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
          bio: true,
          coverImage: true,
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
  }
};

module.exports = userController;