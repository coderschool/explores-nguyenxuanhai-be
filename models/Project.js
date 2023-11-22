const mongoose = require("mongoose");
const { addHours } = require("date-fns");

const projectSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, required: true },
    includeTasks: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Task" }],
    includeMembers: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
    startAt: { type: Date, required: true, default: new Date() },

    endAt: {
      type: Date,
      required: true,
      default: addHours(new Date(), 24),
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.pre("find", function () {
  this.where({ isDeleted: false });
});
projectSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

//Create and export model

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
