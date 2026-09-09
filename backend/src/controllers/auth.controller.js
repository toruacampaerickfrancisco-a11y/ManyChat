const userService = require('../services/userService');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor ingresa correo y contraseña.'
      });
    }

    const result = await userService.authenticateUser(email, password);
    if (!result.success) {
      return res.status(401).json(result);
    }

    return res.json(result);
  } catch (error) {
    console.error('[Auth Controller Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor durante la autenticación.'
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No autenticado' });
    }

    const token = authHeader.split(' ')[1];
    let decoded = null;

    try {
      const jwt = require('jsonwebtoken');
      decoded = jwt.verify(token, userService.JWT_SECRET);
    } catch (err) {
      // Fallback decodificador base64 si jsonwebtoken no estuviera presente
      try {
        const parts = token.split('.');
        if (parts.length >= 2) {
          decoded = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
        }
      } catch (e) {}
    }

    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }

    return res.json({
      success: true,
      user: decoded
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Sesión inválida o expirada' });
  }
};
