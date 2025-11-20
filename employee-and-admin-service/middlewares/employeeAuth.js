const employeeAuth = (req, res, next) => {
  if (req.session.userRole === 0 || req.session.userRole === 1) {
    next(); // Admin (0) or Employee (1) can access
  } else {
    res.redirect('/login'); // Redirect to login if not logged in
  }
};

module.exports = employeeAuth;
