const prisma = require('../utils/database');

const listController = {
  async getUserLists(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10, includeItems = false } = req.query;
      
      const skip = (page - 1) * limit;

      const [lists, total] = await Promise.all([
        prisma.list.findMany({
          where: { 
            userId: parseInt(userId),
            isPublic: req.user?.id !== parseInt(userId) ? true : undefined
          },
          skip,
          take: parseInt(limit),
          orderBy: { updatedAt: 'desc' },
          include: {
            _count: {
              select: {
                items: true
              }
            },
            items: includeItems ? {
              take: 4,
              select: {
                id: true,
                title: true,
                image: true,
                type: true,
                year: true
              }
            } : false
          }
        }),
        prisma.list.count({
          where: { 
            userId: parseInt(userId),
            isPublic: req.user?.id !== parseInt(userId) ? true : undefined
          }
        })
      ]);

      res.json({
        lists,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error getting user lists:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getListById(req, res) {
    try {
      const { listId } = req.params;

      const list = await prisma.list.findUnique({
        where: { id: parseInt(listId) },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true
            }
          },
          items: {
            select: {
              id: true,
              title: true,
              image: true,
              type: true,
              year: true,
              rating: true,
              genres: true
            }
          },
          _count: {
            select: {
              items: true
            }
          }
        }
      });

      if (!list) {
        return res.status(404).json({ error: 'Lista não encontrada' });
      }

      // Verificar se a lista é privada e se o usuário é o dono
      if (!list.isPublic && list.userId !== req.user?.id) {
        return res.status(403).json({ error: 'Esta lista é privada' });
      }

      res.json(list);
    } catch (error) {
      console.error('Error getting list:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

 async getUserSavedMedia(req, res) {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        profileVisibility: true,
        showSavedItems: true,
        savedMedia: {
          skip,
          take: parseInt(limit),
          select: {
            id: true,
            title: true,
            image: true,
            type: true,
            year: true,
            rating: true,
            genres: true
          }
        },
        _count: {
          select: { savedMedia: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (user.profileVisibility !== 'public' || !user.showSavedItems) {
      return res.status(403).json({ error: 'Não é permitido acessar os itens salvos deste usuário' });
    }

    res.json({
      savedMedia: user.savedMedia,
      totalSaved: user._count.savedMedia
    });

  } catch (error) {
    console.error('Error getting saved media:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
},

async getUserFavorites(req, res) {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        profileVisibility: true,
        showFavorites: true,
        favorites: {
          skip,
          take: parseInt(limit),
          select: {
            id: true,
            title: true,
            image: true,
            type: true,
            year: true,
            rating: true,
            genres: true
          }
          
        },
        _count: {
          select: { favorites: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (user.profileVisibility !== 'public' || !user.showFavorites) {
      return res.status(403).json({ error: 'Não é permitido acessar os favoritos deste usuário' });
    }

    res.json({
      favorites: user.favorites,
      totalSaved: user._count.favorites
    });

  } catch (error) {
    console.error('Error getting favorite media:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
},

  async createList(req, res) {
    try {
      const { name, description, isPublic = false } = req.body;
      const userId = req.user.id;

      if (!name.trim()) {
        return res.status(400).json({ error: 'Nome da lista é obrigatório' });
      }

      const list = await prisma.list.create({
        data: {
          name: name.trim(),
          description: description?.trim() || '',
          isPublic: Boolean(isPublic),
          userId,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true
            }
          },
          _count: {
            select: {
              items: true
            }
          }
        }
      });

      res.status(201).json({
        message: 'Lista criada com sucesso',
        list
      });
    } catch (error) {
      console.error('Error creating list:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async updateList(req, res) {
    try {
      const { listId } = req.params;
      const { name, description, isPublic } = req.body;
      const userId = req.user.id;

      const list = await prisma.list.findUnique({
        where: { id: parseInt(listId) }
      });

      if (!list) {
        return res.status(404).json({ error: 'Lista não encontrada' });
      }

      if (list.userId !== userId) {
        return res.status(403).json({ error: 'Você não pode editar esta lista' });
      }

      const updatedList = await prisma.list.update({
        where: { id: parseInt(listId) },
        data: {
          name: name?.trim() || list.name,
          description: description?.trim() || list.description,
          isPublic: isPublic !== undefined ? Boolean(isPublic) : list.isPublic,
          updatedAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true
            }
          },
          items: {
            select: {
              id: true,
              title: true,
              image: true,
              type: true
            }
          },
          _count: {
            select: {
              items: true
            }
          }
        }
      });

      res.json({
        message: 'Lista atualizada com sucesso',
        list: updatedList
      });
    } catch (error) {
      console.error('Error updating list:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async deleteList(req, res) {
    try {
      const { listId } = req.params;
      const userId = req.user.id;

      const list = await prisma.list.findUnique({
        where: { id: parseInt(listId) }
      });

      if (!list) {
        return res.status(404).json({ error: 'Lista não encontrada' });
      }

      if (list.userId !== userId) {
        return res.status(403).json({ error: 'Você não pode excluir esta lista' });
      }

      await prisma.list.delete({
        where: { id: parseInt(listId) }
      });

      res.json({ message: 'Lista excluída com sucesso' });
    } catch (error) {
      console.error('Error deleting list:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async addItemToList(req, res) {
    try {
      const { listId, mediaId } = req.body;
      const userId = req.user.id;

      // Verificar se a lista existe e pertence ao usuário
      const list = await prisma.list.findUnique({
        where: { id: parseInt(listId) }
      });

      if (!list) {
        return res.status(404).json({ error: 'Lista não encontrada' });
      }

      if (list.userId !== userId) {
        return res.status(403).json({ error: 'Você não pode modificar esta lista' });
      }

      // Verificar se a mídia existe
      const media = await prisma.media.findUnique({
        where: { id: parseInt(mediaId) }
      });

      if (!media) {
        return res.status(404).json({ error: 'Mídia não encontrada' });
      }

      // Verificar se a mídia já está na lista
      const existingItem = await prisma.list.findFirst({
        where: {
          id: parseInt(listId),
          items: {
            some: { id: parseInt(mediaId) }
          }
        }
      });

      if (existingItem) {
        return res.status(400).json({ error: 'Mídia já está na lista' });
      }

      const updatedList = await prisma.list.update({
        where: { id: parseInt(listId) },
        data: {
          items: {
            connect: { id: parseInt(mediaId) }
          },
          updatedAt: new Date()
        },
        include: {
          items: {
            select: {
              id: true,
              title: true,
              image: true,
              type: true,
              year: true
            }
          },
          _count: {
            select: {
              items: true
            }
          }
        }
      });

      res.json({
        message: 'Mídia adicionada à lista com sucesso',
        list: updatedList
      });
    } catch (error) {
      console.error('Error adding item to list:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async removeItemFromList(req, res) {
    try {
      const { listId, mediaId } = req.params;
      const userId = req.user.id;

      // Verificar se a lista existe e pertence ao usuário
      const list = await prisma.list.findUnique({
        where: { id: parseInt(listId) }
      });

      if (!list) {
        return res.status(404).json({ error: 'Lista não encontrada' });
      }

      if (list.userId !== userId) {
        return res.status(403).json({ error: 'Você não pode modificar esta lista' });
      }

      const updatedList = await prisma.list.update({
        where: { id: parseInt(listId) },
        data: {
          items: {
            disconnect: { id: parseInt(mediaId) }
          },
          updatedAt: new Date()
        },
        include: {
          items: {
            select: {
              id: true,
              title: true,
              image: true,
              type: true,
              year: true
            }
          },
          _count: {
            select: {
              items: true
            }
          }
        }
      });

      res.json({
        message: 'Mídia removida da lista com sucesso',
        list: updatedList
      });
    } catch (error) {
      console.error('Error removing item from list:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async toggleSaveMedia(req, res) {
    try {
      const { mediaId } = req.body;
      const userId = req.user.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          savedMedia: {
            where: { id: parseInt(mediaId) },
            select: { id: true }
          }
        }
      });

      const isCurrentlySaved = user.savedMedia.length > 0;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          savedMedia: {
            [isCurrentlySaved ? 'disconnect' : 'connect']: { id: parseInt(mediaId) }
          }
        },
        select: {
          savedMedia: {
            select: {
              id: true,
              title: true,
              image: true,
              type: true
            }
          }
        }
      });

      res.json({
        message: isCurrentlySaved ? 'Mídia removida dos salvos' : 'Mídia salva com sucesso',
        isSaved: !isCurrentlySaved,
        savedMedia: updatedUser.savedMedia
      });
    } catch (error) {
      console.error('Error toggling saved media:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async toggleFavoriteMedia(req, res) {
    try {
      const { mediaId } = req.body;
      const userId = req.user.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          favorites: {
            where: { id: parseInt(mediaId) },
            select: { id: true }
          }
        }
      });

      const isCurrentlyFavorited = user.favorites.length > 0;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          favorites: {
            [isCurrentlyFavorited ? 'disconnect' : 'connect']: { id: parseInt(mediaId) }
          }
        },
        select: {
          favorites: {
            select: {
              id: true,
              title: true,
              image: true,
              type: true
            }
          }
        }
      });

      res.json({
        message: isCurrentlyFavorited ? 'Mídia removida dos favoritos' : 'Mídia favoritada com sucesso',
        isFavorited: !isCurrentlyFavorited,
        favorites: updatedUser.favorites
      });
    } catch (error) {
      console.error('Error toggling favorite media:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

};

module.exports = listController;