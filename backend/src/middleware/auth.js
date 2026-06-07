const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'tumur_zam_surgalt_2025_secret_key';

function authRequired(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Нэвтрэх шаардлагатай' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Токен хүчингүй' });
  }
}

function adminRequired(req, res, next) {
  authRequired(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Админ эрх шаардлагатай' });
    next();
  });
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.lastName + ' ' + user.firstName },
    SECRET, { expiresIn: '7d' }
  );
}

module.exports = { authRequired, adminRequired, generateToken, SECRET };
