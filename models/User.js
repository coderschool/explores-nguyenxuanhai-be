const mongoose = require("mongoose");
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
    isDeleted: { type: Boolean, default: false, required: true },
    responsibleFor: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Task" }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("find", function () {
  this.where({ isDeleted: false });
});
userSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

//Create and export model

const User = mongoose.model("User", userSchema);
module.exports = User;
