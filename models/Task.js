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
    priority: {
      type: String,
      default: "normal",
      enum: ["low", "normal", "high"],
    },
    dueDate: { type: Date },
    isDeleted: { type: Boolean, default: false, required: true },
    assignedTo: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    creator: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      // required: true,
    },
    inProject: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Project",
    },
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
