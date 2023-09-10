const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
  {
    name: { type: String, required: true },

    isDeleted: { type: Boolean, default: false, required: true },
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
