import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret';

function generateToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export {generateToken, verifyToken};