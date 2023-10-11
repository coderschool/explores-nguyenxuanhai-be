const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_SECRET_REFRESH_KEY = process.env.JWT_SECRET_REFRESH_KEY;

const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  // Get data from request
  const { email, password } = req.body;

  // Business Logic Validation
  const user = await User.findOne({ email }, "+password")
    .select("+isVerified")
    .populate("memberOf");
  if (!user) throw new AppError("400", "Invalid Credentials", "Login Error");
  if (!user.isVerified)
    throw new AppError("400", "Account unverified", "Login Error");

  // Process
  // gen accessToken and refreshToken if password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("400", "Wrong password", "Login Error");
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  // Assigning refresh token in http-only cookie
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  // Response
  sendResponse(res, 200, true, { user, accessToken }, null, "Login successful");
});

authController.refreshAccess = catchAsync(async (req, res, next) => {
  //   const refreshToken = req.cookies?.jwt;
  //   if (!refreshToken)
  //     throw new AppError(401, "Refresh Token required", "Refresh Access Error");

  const refreshToken = req.cookies.jwt;

  let decodedId;

  // verifying refresh token
  jwt.verify(refreshToken, JWT_SECRET_REFRESH_KEY, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        throw new AppError(
          401,
          "Refresh Token expired",
          "Refresh Access Error"
        );
      } else {
        throw new AppError(
          401,
          "Refresh Token invalid",
          "Refresh Access Error"
        );
      }
    }
    decodedId = decoded._id;
  });

  // gen and send a new access token
  const user = await User.findById(decodedId).populate("memberOf");
  if (!user)
    throw new AppError("404", "User not found", "Refresh Access Error");

  const accessToken = await user.generateAccessToken();

  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Refresh Access successful"
  );
});

authController.logout = async (req, res, next) => {
  try {
    // Destroying refresh token in http-only cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    sendResponse(res, 200, true, {}, null, "Log out success");
  } catch (error) {
    next(error);
  }
};

module.exports = authController;
