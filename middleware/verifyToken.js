import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.BETTER_AUTH_URL}/api/auth/jwks`)
);

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized — missing token" });
  }

  const token = authHeader.slice(7);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized — empty token" });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS);

    req.user = {
      id: payload.sub,
      name: payload.name || null,
      email: payload.email || null,
      image: payload.image || null,
    };

    return next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(403).json({ message: "Forbidden — invalid token" });
  }
};
