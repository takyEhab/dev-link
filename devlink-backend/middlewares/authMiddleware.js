// Example Express middleware
import jwt from "jsonwebtoken";

export default function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;
  const token = req.cookies?.token || bearerToken;
  if (!token) {
    const err = new Error("No token provided");
    err.statusCode = 401;
    return next(err);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user data to the request
    next();
  } catch (err) {
    err.statusCode = 403;
    err.message = "Invalid token";
    next(err); // Pass to global error handler
  }
}
