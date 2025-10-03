const crypto = require('crypto');

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

const comparePassword = (password, stored) => {
  const [salt, hash] = stored.split(':');
  const hashBuffer = crypto.scryptSync(password, salt, 64);
  return hash === hashBuffer.toString('hex');
};

module.exports = { hashPassword, comparePassword };