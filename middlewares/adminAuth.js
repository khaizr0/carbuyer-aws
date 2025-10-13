const adminAuth = (req, res, next) => {
  if (req.session.userRole === 0) {
    next(); // Only admin can access admin pages
  } else if (req.session.userRole === 1) {
    res.redirect('/employee/dashboard'); // Redirect employee to their dashboard
  } else {
    res.redirect('/login'); // Redirect to login if not logged in
  }
};

module.exports = adminAuth;