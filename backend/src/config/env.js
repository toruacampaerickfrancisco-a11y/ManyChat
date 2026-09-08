const path = require('path');
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const config = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: parseInt(process.env.PORT, 10) || 3000,
  DATABASE_URL: process.env.DATABASE_URL || '',
  
  // AI Keys
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY || '',
  
  // Video & Avatar Generation
  HEDRA_API_KEY: process.env.HEDRA_API_KEY || '',
  KLING_API_KEY: process.env.KLING_API_KEY || '',
  REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN || '',
  
  // Meta Configuration
  META_VERIFY_TOKEN: process.env.META_VERIFY_TOKEN || 'clipop2026',
  META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN || '',
  META_APP_SECRET: process.env.META_APP_SECRET || '',
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  
  // Notification Webhooks
  ADMIN_ALERT_TELEGRAM_BOT_TOKEN: process.env.ADMIN_ALERT_TELEGRAM_BOT_TOKEN || '',
  ADMIN_ALERT_CHAT_ID: process.env.ADMIN_ALERT_CHAT_ID || ''
};

module.exports = config;
