const employeeAuth = (req, res, next) => {
  console.log('Employee Auth Check:', {
    userId: req.session.userId,
    userRole: req.session.userRole,
    sessionID: req.sessionID
  });
  
  if (req.session.userId && (req.session.userRole === 0 || req.session.userRole === 1)) {
    next(); // Admin (0) or Employee (1) can access
  } else {
    console.log('Auth failed, redirecting to employee login');
    res.redirect('/employee/login'); // Redirect to employee login
  }
};

module.exports = employeeAuth;
