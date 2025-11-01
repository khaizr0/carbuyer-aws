const adminAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Chưa đăng nhập' });
  }
  
  if (req.session.userRole !== 0) {
    return res.status(403).json({ message: 'Chỉ admin mới có quyền truy cập' });
  }
  
  next();
};

module.exports = adminAuth;
