const jwt = require("jsonwebtoken");
const { AppError } = require("../helpers/utils");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authentication = {};

authentication.accessRequired = (req, res, next) => {
  try {
    // authorization in postman
    const tokenString = req.headers.authorization;
    // console.log(tokenString);
    if (!tokenString)
      throw new AppError(401, "Access required", "Authentication Error");

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

      // give userId to req (from token payload) so controller can have userId after accessRequired
      req.userId = payload._id;
      req.userRole = payload.role;
    });
    next();
  } catch (error) {
    next(error);
  }
};

authentication.managerRequired = (req, res, next) => {
  try {
    if (req.userRole !== "manager")
      throw new AppError(401, "Manager access only", "Authentication Error");
    console.log("Hi manager ", req.userId);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
