const roleAuth = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  };
};

module.exports = roleAuth;
