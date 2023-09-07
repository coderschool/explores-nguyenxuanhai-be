const utilsHelper = {};

utilsHelper.sendResponse = (res, status, success, data, errors, message) => {
  const response = {};
  if (success) response.success = success;
  if (data) response.data = data;
  if (errors) response.errors = errors;
  if (message) response.message = message;
  return res.status(status).json(response);
};

// create AppError class that inherits methods from Error class
class AppError extends Error {
  constructor(statusCode, message, errorType) {
    // Use the "super" method to call the parent's constructor function
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    // all errors using this class are operational errors (errors that we can foresee)
    this.isOperational = true; // set default to true
    // create a stack trace for debugging (Error obj, void obj to avoid stack polution)
    Error.captureStackTrace(this, this.constructor);
  }
}

utilsHelper.AppError = AppError;
module.exports = utilsHelper;
