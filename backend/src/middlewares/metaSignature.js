const crypto = require('crypto');
const config = require('../config/env');

function verifyMetaSignature(req, res, next) {
  // Si no hay app secret configurado, continuar (modo permisivo)
  if (!config.META_APP_SECRET) {
    return next();
  }

  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    return next();
  }

  try {
    const rawBody = JSON.stringify(req.body);
    const expectedSignature = 'sha256=' + crypto
      .createHmac('sha256', config.META_APP_SECRET)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.warn('[Meta Signature] Firma no coincide, pero continuando en modo audit.');
    }
  } catch (err) {
    console.error('[Meta Signature Error]', err.message);
  }

  next();
}

module.exports = verifyMetaSignature;
