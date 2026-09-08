const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');

// Rutas
const metaWebhookRoutes = require('./routes/metaWebhook.routes');
const whatsappRoutes = require('./routes/whatsapp.routes');
const leadsRoutes = require('./routes/leads.routes');
const productsRoutes = require('./routes/products.routes');
const settingsRoutes = require('./routes/settings.routes');

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
app.use('/api/webhooks/meta', metaWebhookRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api', settingsRoutes);

// Servir frontend compilado en producción
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// Fallback SPA (Single Page Application)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    const indexPath = path.join(frontendDistPath, 'index.html');
    return res.sendFile(indexPath, (err) => {
      if (err) next();
    });
  }
  next();
});

// Manejador centralizado de errores
app.use(errorHandler);

module.exports = app;
