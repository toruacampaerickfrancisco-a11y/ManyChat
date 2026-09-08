const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const config = require('./env');

let prisma = null;
let pool = null;

if (config.DATABASE_URL) {
  try {
    pool = new Pool({ connectionString: config.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
    console.log('[Database] Pool de conexiones PostgreSQL inicializado');
  } catch (error) {
    console.warn('[Database Warning] No se pudo inicializar adapter-pg, usando fallback PrismaClient directo:', error.message);
    prisma = new PrismaClient();
  }
} else {
  console.warn('[Database Notice] Sin DATABASE_URL; los datos operarán en memoria temporal.');
}

module.exports = {
  prisma,
  pool
};
