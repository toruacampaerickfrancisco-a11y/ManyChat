const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');

// Rutas
const metaWebhookRoutes = require('./routes/metaWebhook.routes');
const whatsappRoutes = require('./routes/whatsapp.routes');
const leadsRoutes = require('./routes/leads.routes');
const settingsRoutes = require('./routes/settings.routes');
const videoRoutes = require('./routes/video.routes');
const mediaRoutes = require('./routes/media.routes');
const productsRoutes = require('./routes/products.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middlewares base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging simple de solicitudes
app.use((req, res, next) => {
  if (!req.path.startsWith('/assets') && !req.path.endsWith('.png') && !req.path.endsWith('.ico')) {
    console.log(`[HTTP ${req.method}] ${req.path}`);
  }
  next();
});

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/webhooks/meta', metaWebhookRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api', mediaRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', settingsRoutes);


// Servir videos generados y uploads multimedia
const generatedVideosPath = path.join(__dirname, '../generated_videos');
app.use('/generated-videos', express.static(generatedVideosPath));

const uploadsPath = path.join(__dirname, '../public/uploads');
app.use('/uploads', express.static(uploadsPath));


// Servir frontend compilado en producción con resolución robusta de rutas
const fs = require('fs');
let frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (!fs.existsSync(frontendDistPath)) {
  frontendDistPath = path.join(__dirname, '../frontend/dist');
}
if (!fs.existsSync(frontendDistPath)) {
  frontendDistPath = path.join(process.cwd(), '../frontend/dist');
}
if (!fs.existsSync(frontendDistPath)) {
  frontendDistPath = path.join(process.cwd(), 'frontend/dist');
}

console.log(`[Frontend Static] Sirviendo archivos estáticos desde: ${frontendDistPath}`);
app.use(express.static(frontendDistPath));

// Fallback SPA (Single Page Application) - únicamente para rutas de navegación web
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/assets') && !path.extname(req.path)) {
    const indexPath = path.join(frontendDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  next();
});

// Manejador centralizado de errores
app.use(errorHandler);

module.exports = app;
