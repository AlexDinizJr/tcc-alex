const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/database');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const authController = {
  async register(req, res) {
    try {
      const { email, password, name, username } = req.body;

      // Verificar se usuário já existe
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }]
        }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email ou username já cadastrado' });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 12);

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          username,
          profileVisibility: 'public',
          showActivity: true,
          showSavedItems: true,
          showFavorites: true,
          showReviews: true,
          showStats: true,
          dataCollection: true
        },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          avatar: true,
          createdAt: true
        }
      });

      const token = generateToken(user.id);

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user,
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          reviews: {
            select: {
              id: true,
              mediaId: true,
              rating: true
            }
          },
          lists: {
            select: {
              id: true,
              name: true,
              isPublic: true
            }
          }
        }
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = generateToken(user.id);

      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        message: 'Login realizado com sucesso',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          reviews: {
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
            include: {
              items: {
                select: {
                  id: true,
                  title: true,
                  image: true,
                  type: true
                }
              }
            }
          },
          savedMedia: {
            select: {
              id: true,
              title: true,
              image: true,
              type: true
            }
          },
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

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

module.exports = authController;