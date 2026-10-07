import { verifyAccessToken } from "../utils/jwt.js";
import { User } from "../models/index.js";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Malformed token" });
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not found or inactive" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    }
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
