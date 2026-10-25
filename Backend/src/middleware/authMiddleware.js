const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const authorization = req.headers.authorization || "";
  const token = authorization.match(/^Bearer\s+(\S+)$/i)?.[1];

  if (!token) {
    return res.status(401).json({ error: "Sign in to continue." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof payload !== "object" || typeof payload.sub !== "string") {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    req.userId = payload.sub;
    return next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    return next(error);
  }
}

module.exports = requireAuth;
