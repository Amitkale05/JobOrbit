import { verifyToken } from "../utils/jwt.js";

/**
 * Middleware to protect routes — verifies JWT Bearer token
 */
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token." });
  }
};

/**
 * Middleware to restrict access by role
 * @param  {...string} roles - Allowed roles e.g. "ADMIN", "RECRUITER"
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        msg: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }
    next();
  };
};
