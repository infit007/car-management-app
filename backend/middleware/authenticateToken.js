const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Middleware function to authenticate the token
const authenticate = (req, res, next) => {
  // Retrieve the token from the 'Authorization' header (expecting a 'Bearer <token>' format)
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // If no token is provided, return a 401 Unauthorized error
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    }

    // Handle generic errors (e.g., invalid token)
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authenticate;
