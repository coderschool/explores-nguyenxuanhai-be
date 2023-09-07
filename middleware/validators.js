const { checkSchema, validationResult, param } = require("express-validator");

const userInputSchema = {
  name: {
    notEmpty: { bail: true, errorMessage: "Name of user is required!" },
    isString: { errorMessage: "Name of user must be a string" },
  },
  role: {
    isIn: {
      options: [["manager", "employee"]],
      errorMessage: "Invalid role",
    },
  },
};

const taskInputSchema = {
  name: {
    notEmpty: { bail: true, errorMessage: "Name of task is required!" },
    isString: { errorMessage: "Name of task must be a string" },
  },
  description: {
    notEmpty: { bail: true, errorMessage: "Task description is required!" },
    isString: { errorMessage: "Task description must be a string" },
  },
  status: {
    // skip validation if no status in body
    optional: true,
    isIn: {
      options: [["pending", "working", "review", "done", "archive"]],
      errorMessage: "Invalid status",
    },
  },

  assignedTo: {
    optional: true,
    isMongoId: { errorMessage: "Invalid MongoId" },
  },
};

const taskEditSchema = {
  ...taskInputSchema,
  name: { ...taskInputSchema.name, optional: true },
  description: { ...taskInputSchema.description, optional: true },
};

const userValidator = [
  checkSchema(userInputSchema),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

const taskValidator = [
  checkSchema(taskInputSchema),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

const taskEditValidator = [
  checkSchema(taskEditSchema),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

const reqIdValidator = [
  param("id").isMongoId().withMessage("Invalid ID!"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

module.exports = {
  userValidator,
  taskValidator,
  taskEditValidator,
  reqIdValidator,
};
