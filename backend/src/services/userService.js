const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'clipop_secret_key_2026_secure_jwt';

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
    console.warn('[Users Service] Sin conexión al pool PostgreSQL. Operando con fallback en memoria.');
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
      const hashedPassword = await bcrypt.hash(u.passwordPlain, 10);
      
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

    console.log('[Users Service] ✅ Usuarios oficiales verificados y sincronizados en PostgreSQL:');
    console.log('   - admin@clipop.com.mx (ADMIN - Control Total)');
    console.log('   - francisco@clipop.com.mx (CLIENT - Dashboard y Cursos)');
  } catch (error) {
    console.error('[Users Service Error] Error al sincronizar usuarios en DB:', error.message);
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
        let isValid = false;

        // Comprobar con bcrypt
        try {
          isValid = await bcrypt.compare(cleanPassword, user.password);
        } catch (e) {
          isValid = false;
        }

        // Fallback texto plano por seguridad
        if (!isValid && cleanPassword === user.password) {
          isValid = true;
          // Actualizar a hash
          const newHash = await bcrypt.hash(cleanPassword, 10);
          await pool.query('UPDATE "User" SET password = $1 WHERE id = $2', [newHash, user.id]);
        }

        if (isValid) {
          const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            JWT_SECRET,
            { expiresIn: '30d' }
          );

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
      console.error('[Auth Error] Error consultando PostgreSQL:', err.message);
    }
  }

  // 2. Fallback de contingencia si PostgreSQL no estuviera accesible
  const matched = SYSTEM_USERS.find(
    u => u.email.toLowerCase() === cleanEmail && u.passwordPlain === cleanPassword
  );

  if (matched) {
    const token = jwt.sign(
      { id: 999, email: matched.email, name: matched.name, role: matched.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return {
      success: true,
      user: {
        id: 999,
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
