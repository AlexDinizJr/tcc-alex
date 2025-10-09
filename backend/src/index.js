const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/usersRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const reviewRoutes = require('./routes/reviewsRoutes');
const listRoutes = require('./routes/listsRoutes');
const reportRoutes = require('./routes/reportRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

// Rotas admin
const adminMediaRoutes = require('./routes/admin/mediaAdminRoutes');
const adminStreamingRoutes = require('./routes/admin/streamingAdminRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// --------------------
// Middleware geral
// --------------------
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir arquivos de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------------
// Rotas API
// --------------------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/recommendations', recommendationRoutes);
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

// --------------------
// Frontend React
// --------------------
const frontendPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(frontendPath));

// Captura todas as rotas não-API (React Router SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// --------------------
// Manipuladores de erros
// --------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// --------------------
// Start server
// --------------------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/health`);
});
