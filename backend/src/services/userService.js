const crypto = require('crypto');
const { pool } = require('../config/database');

let bcrypt = null;
try {
  bcrypt = require('bcryptjs');
} catch (e) {
  // Fallback a crypto nativo de Node.js si bcryptjs no está instalado en la VM
}

let jwt = null;
try {
  jwt = require('jsonwebtoken');
} catch (e) {
  // Fallback a tokens crypto nativos de Node.js
}

const JWT_SECRET = process.env.JWT_SECRET || 'clipop_secret_key_2026_secure_jwt';

// Helper seguro de hash nativo si bcrypt no estuviera disponible
function hashPasswordSafe(password) {
  if (bcrypt) {
    return bcrypt.hashSync(password, 10);
  }
  return crypto.createHash('sha256').update(password + JWT_SECRET).digest('hex');
}

function verifyPasswordSafe(password, storedHash) {
  if (bcrypt && storedHash && (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$'))) {
    try {
      return bcrypt.compareSync(password, storedHash);
    } catch (e) {}
  }
  const sha = crypto.createHash('sha256').update(password + JWT_SECRET).digest('hex');
  return sha === storedHash || password === storedHash;
}

function createTokenSafe(payload) {
  if (jwt) {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    } catch (e) {}
  }
  // Fallback token JWT-compatible simple
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + (30 * 86400) })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

// Usuarios oficiales solicitados por el cliente
const SYSTEM_USERS = [
  {
    email: 'admin@clipop.com.mx',
    passwordPlain: 'Clipop*Clp*1986',
    name: 'Administrador Clipop',
    role: 'ADMIN' // Control total del sistema
  },
  {
    email: 'francisco@clipop.com.mx',
    passwordPlain: 'Pako*Clp*1986',
    name: 'Francisco',
    role: 'CLIENT' // Solo Dashboard y Cursos
  }
];

/**
 * Inicializa la tabla de usuarios en PostgreSQL y asegura los usuarios exactos requeridos
 */
async function initUserTableAndSeed() {
  if (!pool) {
    console.warn('[Users Service] Sin conexión al pool PostgreSQL. Operando con usuarios predeterminados.');
    return;
  }

  try {
    // 1. Crear tabla User si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "User" (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'CLIENT',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Eliminar cualquier otro usuario que no sea francisco@clipop.com.mx o admin@clipop.com.mx
    await pool.query(`
      DELETE FROM "User" 
      WHERE LOWER(email) NOT IN ('admin@clipop.com.mx', 'francisco@clipop.com.mx');
    `);

    // 3. Insertar o actualizar los 2 usuarios exactos requeridos
    for (const u of SYSTEM_USERS) {
      const hashedPassword = hashPasswordSafe(u.passwordPlain);
      
      const existing = await pool.query('SELECT id, password FROM "User" WHERE LOWER(email) = LOWER($1)', [u.email]);
      if (existing.rows.length > 0) {
        // Actualizar contraseña y rol
        await pool.query(`
          UPDATE "User"
          SET password = $1, name = $2, role = $3, "updatedAt" = NOW()
          WHERE LOWER(email) = LOWER($4)
        `, [hashedPassword, u.name, u.role, u.email]);
      } else {
        // Insertar nuevo
        await pool.query(`
          INSERT INTO "User" (email, password, name, role, "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, NOW(), NOW())
        `, [u.email.toLowerCase(), hashedPassword, u.name, u.role]);
      }
    }

    console.log('[Users Service] ✅ Usuarios oficiales verificados y sincronizados:');
    console.log('   - admin@clipop.com.mx (ADMIN - Control Total)');
    console.log('   - francisco@clipop.com.mx (CLIENT - Dashboard y Cursos)');
  } catch (error) {
    console.warn('[Users Service Warning] Sincronización DB omitida (usando memoria):', error.message);
  }
}

/**
 * Autentica a un usuario y genera su token JWT con rol
 */
async function authenticateUser(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  // 1. Intentar verificar en PostgreSQL
  if (pool) {
    try {
      const res = await pool.query('SELECT * FROM "User" WHERE LOWER(email) = LOWER($1)', [cleanEmail]);
      if (res.rows.length > 0) {
        const user = res.rows[0];
        const isValid = verifyPasswordSafe(cleanPassword, user.password);

        if (isValid) {
          const token = createTokenSafe({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          });

          return {
            success: true,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role
            },
            token
          };
        }
      }
    } catch (err) {
      console.warn('[Auth Notice] Consultando fallback local:', err.message);
    }
  }

  // 2. Fallback de contingencia si PostgreSQL no estuviera accesible
  const matched = SYSTEM_USERS.find(
    u => u.email.toLowerCase() === cleanEmail && u.passwordPlain === cleanPassword
  );

  if (matched) {
    const token = createTokenSafe({
      id: matched.email === 'admin@clipop.com.mx' ? 1 : 2,
      email: matched.email,
      name: matched.name,
      role: matched.role
    });

    return {
      success: true,
      user: {
        id: matched.email === 'admin@clipop.com.mx' ? 1 : 2,
        email: matched.email,
        name: matched.name,
        role: matched.role
      },
      token
    };
  }

  return {
    success: false,
    message: 'Correo o contraseña incorrectos. Verifica tus credenciales.'
  };
}

module.exports = {
  JWT_SECRET,
  initUserTableAndSeed,
  authenticateUser
};
