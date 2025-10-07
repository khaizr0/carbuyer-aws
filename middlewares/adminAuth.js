const adminAuth = (req, res, next) => {
  if (req.session.userRole === 0) {
    next(); // Continue to admin page if user is admin
  } else if (req.session.userRole === 1) {
    res.redirect('/employee/dashboard'); // Redirect to employee page if user is an employee
  } else {
    res.redirect('/login'); // Redirect to login page if not logged in
  }
};

module.exports = adminAuth;