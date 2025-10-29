const crypto = require('crypto');

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

const comparePassword = (password, stored) => {
  try {
    if (!stored || typeof stored !== 'string') {
      console.error('Invalid stored password format:', stored);
      return false;
    }
    
    if (!stored.includes(':')) {
      console.error('Password hash missing separator:', stored);
      return false;
    }
    
    const [salt, hash] = stored.split(':');
    
    if (!salt || !hash) {
      console.error('Invalid salt or hash:', { salt, hash });
      return false;
    }
    
    const hashBuffer = crypto.scryptSync(password, salt, 64);
    return hash === hashBuffer.toString('hex');
  } catch (error) {
    console.error('Error comparing password:', error);
    return false;
  }
};

module.exports = { hashPassword, comparePassword };