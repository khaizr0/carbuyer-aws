const employeeAuth = (req, res, next) => {
  console.log('Auth check - Session:', {
    userId: req.session?.userId,
    userRole: req.session?.userRole,
    sessionID: req.sessionID
  });
  
  if (req.session.userRole === 0 || req.session.userRole === 1) {
    next(); // Admin (0) or Employee (1) can access
  } else {
    // Check if it's an API request (JSON expected)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(401).json({ error: 'Unauthorized', session: req.session });
    }
    res.redirect('/employee/login'); // Redirect to login if not logged in
  }
};

module.exports = employeeAuth;
