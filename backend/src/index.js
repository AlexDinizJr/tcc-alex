const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/usersRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const reviewRoutes = require('./routes/reviewsRoutes');
const listRoutes = require('./routes/listsRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

// Rotas de admin
const adminMediaRoutes = require('./routes/admin/mediaAdminRoutes');
const adminStreamingRoutes = require('./routes/admin/streamingAdminRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Configurar Helmet com política menos restritiva para imagens
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } 
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (imagens)
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
      // 🔥 Headers específicos para imagens
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache de 1 dia
    }
  })
);

// Swagger
const setupSwagger = require('./config/swagger');
setupSwagger(app);

// Rotas públicas e de usuários
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Rotas de administração
app.use('/api/admin/media', adminMediaRoutes);
app.use('/api/admin/streaming', adminStreamingRoutes);

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MediaHub API is running',
    timestamp: new Date().toISOString()
  });
});

// Manipulador de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`🖼️  Images serving from: http://localhost:${PORT}/uploads/`);
});