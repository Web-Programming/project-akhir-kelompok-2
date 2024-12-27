const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'your_secret_key';

const authenticateAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send({ message: 'Akses ditolak! Token tidak ada.' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Menyimpan data pengguna yang didekodekan ke request
    next();
  } catch (error) {
    res.status(401).send({ message: 'Token tidak valid!' });
  }
};

module.exports = authenticateAdmin;
