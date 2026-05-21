import { createRemoteJWKSet, jwtVerify } from "jose";

let JWKS;

function getJWKS() {
  if (!JWKS) {
    JWKS = createRemoteJWKSet(
      new URL(
        `${process.env.BETTER_AUTH_URL}/api/auth/jwks`
      )
    );
  }
  return JWKS;
}

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      message: "Unauthorized — missing token" 
    });
  }

  const token = authHeader.slice(7);

  if (!token) {
    return res.status(401).json({ 
      message: "Unauthorized — empty token" 
    });
  }

  try {
    const { payload } = await jwtVerify(
      token, 
      getJWKS(),
      {
        algorithms: ["RS256", "ES256"],
      }
    );

    req.user = {
      id: payload.sub,
      name: payload.name || null,
      email: payload.email || null,
      image: payload.image || null,
    };

    return next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    
    // Fallback: try cookie-based session
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
      try {
        const response = await fetch(
          `${process.env.BETTER_AUTH_URL}/api/auth/get-session`,
          {
            method: "GET",
            headers: { Cookie: cookieHeader },
          }
        );
        
        if (response.ok) {
          const session = await response.json();
          if (session?.user) {
            req.user = session.user;
            return next();
          }
        }
      } catch (fallbackErr) {
        console.error("Fallback auth failed:", fallbackErr.message);
      }
    }
    
    return res.status(403).json({ 
      message: "Forbidden — invalid token" 
    });
  }
};
