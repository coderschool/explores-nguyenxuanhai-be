const jwt = require("jsonwebtoken");
const { AppError } = require("../helpers/utils");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authentication = {};

authentication.loginRequired = (req, res, next) => {
  try {
    // authorization in postman
    const tokenString = req.headers.authorization;
    console.log(tokenString);
    if (!tokenString)
      throw new AppError(401, "Login required", "Authentication Error");

    // delete Bearer from token string
    const token = tokenString.replace("Bearer ", "");

    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw new AppError(401, "Token expired", "Authentication Error");
        } else {
          throw new AppError(401, "Token invalid", "Authentication Error");
        }
      }

      // give userId to req (from token payload) so controller can have userId after loginRequired
      req.userId = payload._id;
    });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
