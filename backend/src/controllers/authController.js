const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/database');
const { sendPasswordRecovery, sendWelcomeEmail } = require('../services/emailService');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const authController = {
  async register(req, res) {
    try {
      const { email, password, name, username, gender, location, birthDate } = req.body;

      if (!email || !password || !name || !username) {
        return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
      }

      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email ou username já cadastrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          username,
          gender,
          location,
          birthDate: birthDate ? new Date(birthDate) : null
        },
        select: { 
          id: true, 
          email: true, 
          name: true, 
          username: true, 
          createdAt: true,
          gender: true,
          location: true,
          birthDate: true
        }
      });

      const token = generateToken(user.id);
      await sendWelcomeEmail(user.email, user.name);

      res.status(201).json({ message: 'Usuário criado com sucesso', user, token });
    } catch (error) {
      console.error('Erro no register:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async login(req, res) {
    try {
      const { usernameOrEmail, password } = req.body;

      if (!usernameOrEmail || !password) {
        return res.status(400).json({ error: 'Todos os campos devem ser preenchidos' });
      }

      // Buscar por email ou username
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: usernameOrEmail },
            { username: usernameOrEmail }
          ]
        }
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = generateToken(user.id);
      const { password: _, ...userWithoutPassword } = user;

      res.json({ message: 'Login realizado com sucesso', user: userWithoutPassword, token });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
  },

  // Solicitar recuperação de senha
  async requestPasswordRecovery(req, res) {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 3600000); // 1h de validade

      await prisma.passwordRecovery.create({ data: { userId: user.id, token, expires } });
      await sendPasswordRecovery(email, token);

      res.json({ message: 'E-mail de recuperação enviado com sucesso' });
    } catch (error) {
      console.error('Error requesting password recovery:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // Resetar senha usando token de recuperação
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      // Busca o token válido e não usado
      const recovery = await prisma.passwordRecovery.findFirst({
        where: {
          token,
          expires: { gte: new Date() }, // garante que não expirou
          used: false
        },
        include: { user: true }
      });

      if (!recovery) {
        return res.status(400).json({ error: 'Token inválido ou expirado' });
      }

      // Atualiza a senha do usuário
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: recovery.userId },
        data: { password: hashedPassword }
      });

      // Marca o token como usado
      await prisma.passwordRecovery.update({
        where: { id: recovery.id },
        data: { used: true }
      });

      res.json({ message: 'Senha atualizada com sucesso' });

    } catch (error) {
      console.error('Error resetting password:', error);
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
          },
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