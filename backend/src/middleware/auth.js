const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatar: true,
        role: true // <- importante para se é admin
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado: somente administradores' });
  }
  next();
};

const authenticateTokenOptional = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('🔐 Middleware Debug:', {
    hasAuthHeader: !!authHeader,
    hasToken: !!token,
    url: req.originalUrl
  });

  if (!token) {
    req.user = undefined;
    console.log('👤 Usuário: Visitante (sem token)');
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, email: true }
    });
    
    req.user = user;
    console.log('👤 Usuário autenticado:', user);
    next();
  } catch (error) {
    console.log('⚠️ Token inválido:', error.message);
    req.user = undefined;
    next();
  }
};

module.exports = { authenticateToken, authenticateTokenOptional, isAdmin };
