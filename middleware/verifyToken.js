export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing authorization token" });
  }

  try {
    const authBaseURL = process.env.BETTER_AUTH_URL || process.env.CLIENT_URL;
    const response = await fetch(`${authBaseURL}/api/auth/get-session`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return res.status(401).json({ message: "Invalid authorization token" });
    }

    const session = await response.json();

    if (!session?.user) {
      return res.status(401).json({ message: "Invalid session" });
    }

    req.user = session.user;
    req.session = session.session;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Unable to verify authorization token",
      error: error.message,
    });
  }
};
