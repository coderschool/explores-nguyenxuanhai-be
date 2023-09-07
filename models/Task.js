const mongoose = require("mongoose");
//Create schema
const taskSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "working", "review", "done", "archive"],
      //   required: true,
    },
    isDeleted: { type: Boolean, default: false, required: true },
    assignedTo: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

taskSchema.pre("find", function () {
  this.where({ isDeleted: false });
});
taskSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

//Create and export model

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
