const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_SECRET_REFRESH_KEY = process.env.JWT_SECRET_REFRESH_KEY;

//Create schema
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    role: {
      type: String,
      default: "employee",
      enum: ["manager", "employee"],
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
      select: false,
    },
    isDeleted: { type: Boolean, default: false, required: true, select: false },
    responsibleFor: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Task" }],
    memberOf: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Project" }],
  },
  {
    timestamps: true,
  }
);

// omit password and isDeleted in res
userSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.password;
  delete user.isDeleted;
  return user;
};

// method to gen accessToken for user for 1 day
userSchema.methods.generateAccessToken = async function () {
  const payload = {
    _id: this._id,
    role: this.role,
  };
  const accessToken = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: "10m",
  });
  return accessToken;
};

userSchema.methods.generateRefreshToken = async function () {
  const refreshToken = jwt.sign({ _id: this._id }, JWT_SECRET_REFRESH_KEY, {
    expiresIn: "1d",
  });
  return refreshToken;
};

userSchema.pre("find", function () {
  this.where({ isDeleted: false });
});
userSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

//Create and export model

const User = mongoose.model("User", userSchema);
module.exports = User;
